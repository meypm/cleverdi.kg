(() => {
  const PREVIEW_KEY = "cleverdi_schedule_admin_preview_v3";
  let schedules = (window.CLEVERDI_SCHEDULES && typeof window.CLEVERDI_SCHEDULES === "object")
    ? JSON.parse(JSON.stringify(window.CLEVERDI_SCHEDULES))
    : { economics: window.CLEVERDI_SCHEDULE };

  try {
    const preview = localStorage.getItem(PREVIEW_KEY);
    if (preview) {
      const parsed = JSON.parse(preview);
      if (parsed && typeof parsed === "object") schedules = parsed;
    }
  } catch (_) {
    // Если localStorage недоступен, показываем schedule.js.
  }

  const keys = Object.keys(schedules || {});
  let activeKey = keys.includes("pedagogy") ? "pedagogy" : keys[0];

  const escapeHtml = (value) => String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

  function renderPicker(){
    const picker = document.getElementById("scheduleTrackPicker");
    if(!picker) return;
    picker.innerHTML = keys.map(key=>{
      const item = schedules[key] || {};
      const active = key === activeKey;
      return `<button type="button" class="schedule-track-btn ${active ? "is-active" : ""}" data-schedule-key="${escapeHtml(key)}" aria-pressed="${active ? "true" : "false"}">
        <span class="schedule-track-icon">${key === "pedagogy" ? "🎓" : "📊"}</span>
        <span class="schedule-track-copy"><strong>${escapeHtml(item.label || item.title || key)}</strong><small>${escapeHtml(item.shortLabel || "")}</small></span>
        <span class="schedule-track-action">${active ? "→ Выбрано" : "Открыть →"}</span>
      </button>`;
    }).join("");

    picker.querySelectorAll("[data-schedule-key]").forEach(button=>{
      button.addEventListener("click",()=>{
        activeKey = button.dataset.scheduleKey;
        renderPicker();
        renderSchedule();
      });
    });
  }

  function renderSchedule(){
    const SCHEDULE = schedules[activeKey];
    if(!SCHEDULE) return;
    const title = document.getElementById("scheduleTitle");
    const subtitle = document.getElementById("scheduleSubtitle");
    const scheduleDays = document.getElementById("scheduleDays");

    if(title) title.textContent = SCHEDULE.title || "Расписание занятий";
    if(subtitle) subtitle.textContent = SCHEDULE.semester || "";

    if(scheduleDays){
      const days = Array.isArray(SCHEDULE.days) ? SCHEDULE.days : [];
      scheduleDays.innerHTML = days.map((day,index)=>`
        <article class="schedule-day-card">
          <div class="schedule-day-head">
            <div class="schedule-day-number">${String(index+1).padStart(2,"0")}</div>
            <div class="schedule-day-copy">
              <div class="schedule-day-title-row"><h3>${escapeHtml(day.day || "")}</h3>${day.date ? `<span class="schedule-day-date">${escapeHtml(day.date)}</span>` : ""}</div>
              <p>${escapeHtml(day.groups || "")}</p>
            </div>
          </div>
          <div class="schedule-lessons">
            ${(Array.isArray(day.lessons)?day.lessons:[]).map(lesson=>{
              const hasSubject = String(lesson.subject || "").trim().length > 0;
              return `<div class="schedule-lesson ${hasSubject ? "" : "schedule-lesson-empty"}">
                <div class="schedule-time">${escapeHtml(lesson.time || "—")}</div>
                <div class="schedule-lesson-main">
                  ${hasSubject ? `<strong>${escapeHtml(lesson.subject)}</strong><div class="schedule-meta">${lesson.teacher ? `<span>👤 ${escapeHtml(lesson.teacher)}</span>` : ""}${lesson.room ? `<span>📍 ${escapeHtml(lesson.room)}</span>` : ""}</div>` : `<strong class="schedule-empty-text">Занятие не указано</strong>`}
                </div>
              </div>`;
            }).join("")}
          </div>
        </article>`).join("");
    }
  }

  const menuButton = document.getElementById("menuButton");
  const nav = document.getElementById("nav");
  if(menuButton && nav){
    menuButton.addEventListener("click",()=>{
      const open = nav.classList.toggle("open");
      menuButton.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }

  const year = document.getElementById("currentYear");
  if(year) year.textContent = new Date().getFullYear();
  renderPicker();
  renderSchedule();
})();
