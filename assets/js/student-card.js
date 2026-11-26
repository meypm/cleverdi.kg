(() => {
  const DATA = Array.isArray(window.CLEVERDI_STUDENTS) ? window.CLEVERDI_STUDENTS : [];
  const $ = (id) => document.getElementById(id);
  const search = $("studentCardSearch");
  const findBtn = $("studentCardFindButton");
  const message = $("studentCardSearchMessage");
  const matches = $("studentCardMatches");
  const preview = $("studentCardPreview");
  const photoInput = $("studentCardPhoto");
  if (!search || !findBtn || !message || !matches || !preview) return;

  let selected = null;
  const esc = (v) => String(v ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]));
  const norm = (v) => String(v ?? "").trim().toLocaleLowerCase("ru-RU").replace(/\s+/g, " ");

  function initials(name) {
    const parts = String(name || "").trim().split(/\s+/).filter(Boolean);
    return (parts.slice(0, 2).map(x => x[0]).join("") || "СТ").toUpperCase();
  }

  function profileId(student) {
    return `CLV-2026-${String(student?.id ?? 0).padStart(4, "0")}`;
  }

  function simpleCode(student) {
    const input = `${student?.id ?? ""}|${student?.fullName ?? ""}|${student?.specialty ?? ""}`;
    let h = 2166136261;
    for (let i = 0; i < input.length; i++) {
      h ^= input.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return `C-${(h >>> 0).toString(16).toUpperCase().padStart(8, "0")}`;
  }

  function photoKey(student) {
    return `cleverdi_student_card_photo_${student?.id ?? "unknown"}`;
  }

  function showPhoto(student, dataUrl = "") {
    const box = $("studentCardPhotoPreview");
    if (!box) return;
    if (dataUrl) {
      box.innerHTML = `<img alt="Фото студента" src="${dataUrl}">`;
    } else {
      box.innerHTML = `<span id="studentCardInitials">${esc(initials(student?.fullName))}</span>`;
    }
  }

  function loadSavedPhoto(student) {
    try { return localStorage.getItem(photoKey(student)) || ""; } catch { return ""; }
  }

  function renderStudent(student) {
    selected = student;
    matches.innerHTML = "";
    matches.classList.add("hidden");
    $("studentCardFullName").textContent = student.fullName || "—";
    $("studentCardSpecialty").textContent = student.specialty || "—";
    $("studentCardProfileId").textContent = profileId(student);
    $("studentCardVerifyCode").textContent = simpleCode(student);
    $("studentCardStatus").textContent = "В базе Cleverdi";
    showPhoto(student, loadSavedPhoto(student));
    preview.classList.remove("hidden");
    message.textContent = "Студент найден. Электронный студенческий билет сформирован автоматически.";
    message.classList.remove("error");
    setTimeout(() => preview.scrollIntoView({ behavior: "smooth", block: "nearest" }), 30);
  }

  function resetResult() {
    matches.innerHTML = "";
    matches.classList.add("hidden");
    preview.classList.add("hidden");
    message.textContent = "";
    message.classList.remove("error");
  }

  function find() {
    resetResult();
    const q = norm(search.value);
    if (q.length < 2) {
      message.textContent = "Введите минимум 2 буквы фамилии или ФИО.";
      message.classList.add("error");
      return;
    }
    const found = DATA.filter(s => norm(s.fullName).includes(q) || norm(s.rawName).includes(q))
      .sort((a, b) => String(a.fullName).localeCompare(String(b.fullName), "ru"))
      .slice(0, 30);

    if (!found.length) {
      message.textContent = "Студент с таким ФИО не найден в базе.";
      message.classList.add("error");
      return;
    }
    if (found.length === 1) {
      renderStudent(found[0]);
      return;
    }

    message.textContent = `Найдено совпадений: ${found.length}. Выберите себя.`;
    matches.classList.remove("hidden");
    found.forEach(student => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "certificate-match";
      btn.innerHTML = `<span><strong>${esc(student.fullName)}</strong><span>${esc(student.specialty)}</span></span><b>Открыть билет</b>`;
      btn.addEventListener("click", () => renderStudent(student));
      matches.appendChild(btn);
    });
  }

  findBtn.addEventListener("click", find);
  search.addEventListener("keydown", e => {
    if (e.key === "Enter") { e.preventDefault(); find(); }
  });

  photoInput?.addEventListener("change", () => {
    if (!selected) return;
    const file = photoInput.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      message.textContent = "Выберите файл изображения.";
      message.classList.add("error");
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      message.textContent = "Фото слишком большое. Выберите файл до 8 МБ.";
      message.classList.add("error");
      photoInput.value = "";
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const maxW = 420, maxH = 560;
        const ratio = Math.min(maxW / img.width, maxH / img.height, 1);
        const canvas = document.createElement("canvas");
        canvas.width = Math.max(1, Math.round(img.width * ratio));
        canvas.height = Math.max(1, Math.round(img.height * ratio));
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL("image/jpeg", 0.82);
        showPhoto(selected, dataUrl);
        try { localStorage.setItem(photoKey(selected), dataUrl); } catch {}
        message.textContent = "Фото добавлено к билету на этом устройстве.";
        message.classList.remove("error");
      };
      img.src = String(reader.result || "");
    };
    reader.readAsDataURL(file);
  });

  $("studentCardChangeButton")?.addEventListener("click", () => {
    selected = null;
    preview.classList.add("hidden");
    search.focus();
    search.select();
  });

  $("studentCardPrintButton")?.addEventListener("click", () => {
    document.body.classList.add("print-student-card");
    window.print();
    setTimeout(() => document.body.classList.remove("print-student-card"), 300);
  });
})();
