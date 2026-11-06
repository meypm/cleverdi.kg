(() => {
  "use strict";

  const ADMIN_LOGIN = "admin";
  const ADMIN_PASSWORD_SHA256 = "351c016bddb5ae8aa8831bb995ac85bfbbd099cc679e97ced5b407104cbb6012";
  const STORAGE_KEY = "cleverdi_schedule_admin_preview_v3";
  const SESSION_KEY = "cleverdi_schedule_admin_logged_in";

  const loginView = document.getElementById("adminLoginView");
  const panel = document.getElementById("adminPanel");
  const loginForm = document.getElementById("adminLoginForm");
  const loginInput = document.getElementById("adminLogin");
  const passwordInput = document.getElementById("adminPassword");
  const loginError = document.getElementById("adminLoginError");
  const togglePassword = document.getElementById("togglePassword");
  const logoutButton = document.getElementById("adminLogout");

  const trackSelect = document.getElementById("scheduleTrackSelect");
  const titleInput = document.getElementById("scheduleTitleInput");
  const semesterInput = document.getElementById("scheduleSemesterInput");
  const daysContainer = document.getElementById("adminDays");
  const addDayButton = document.getElementById("addDayButton");
  const savePreviewButton = document.getElementById("savePreviewButton");
  const downloadScheduleButton = document.getElementById("downloadScheduleButton");
  const resetScheduleButton = document.getElementById("resetScheduleButton");
  const saveStatus = document.getElementById("adminSaveStatus");

  const sourceSchedules = (window.CLEVERDI_SCHEDULES && typeof window.CLEVERDI_SCHEDULES === "object")
    ? window.CLEVERDI_SCHEDULES
    : { economics: window.CLEVERDI_SCHEDULE || { title:"Расписание занятий",semester:"",days:[] } };

  let schedules = clone(loadInitialSchedules());
  let activeKey = Object.keys(schedules).includes("pedagogy") ? "pedagogy" : Object.keys(schedules)[0];

  function clone(value){ return JSON.parse(JSON.stringify(value || {})); }

  function loadInitialSchedules(){
    try{
      const local = localStorage.getItem(STORAGE_KEY);
      if(local){
        const parsed = JSON.parse(local);
        if(parsed && typeof parsed === "object") return parsed;
      }
    }catch(_){ }
    return sourceSchedules;
  }

  function currentSchedule(){
    if(!schedules[activeKey]) schedules[activeKey] = {label:activeKey,title:"Расписание занятий",semester:"",startDate:"",days:[]};
    return schedules[activeKey];
  }

  async function sha256(text){
    const bytes = new TextEncoder().encode(text);
    const hash = await crypto.subtle.digest("SHA-256", bytes);
    return Array.from(new Uint8Array(hash)).map(b=>b.toString(16).padStart(2,"0")).join("");
  }

  function showPanel(){ loginView.hidden = true; panel.hidden = false; renderEditor(); }
  function showLogin(){ panel.hidden = true; loginView.hidden = false; passwordInput.value = ""; }

  if(sessionStorage.getItem(SESSION_KEY) === "1") showPanel(); else showLogin();

  loginForm.addEventListener("submit", async (event)=>{
    event.preventDefault();
    loginError.textContent = "";
    if(loginInput.value.trim() === ADMIN_LOGIN && await sha256(passwordInput.value) === ADMIN_PASSWORD_SHA256){
      sessionStorage.setItem(SESSION_KEY,"1"); showPanel(); return;
    }
    loginError.textContent = "Неверный логин или пароль";
  });

  togglePassword.addEventListener("click",()=>{
    const isPassword = passwordInput.type === "password";
    passwordInput.type = isPassword ? "text" : "password";
    togglePassword.textContent = isPassword ? "🙈" : "👁";
  });
  logoutButton.addEventListener("click",()=>{ sessionStorage.removeItem(SESSION_KEY); showLogin(); });

  function escapeAttr(value){
    return String(value ?? "").replaceAll("&","&amp;").replaceAll('"',"&quot;").replaceAll("<","&lt;").replaceAll(">","&gt;");
  }

  function renderTrackOptions(){
    trackSelect.innerHTML = Object.entries(schedules).map(([key,item])=>`<option value="${escapeAttr(key)}" ${key===activeKey?"selected":""}>${escapeAttr(item.label || item.title || key)}</option>`).join("");
  }

  function renderEditor(){
    renderTrackOptions();
    const schedule = currentSchedule();
    titleInput.value = schedule.title || "";
    semesterInput.value = schedule.semester || "";
    const days = Array.isArray(schedule.days) ? schedule.days : [];
    daysContainer.innerHTML = days.map((day, dayIndex)=>renderDay(day, dayIndex)).join("");
    bindDayEvents();
  }

  function renderDay(day, dayIndex){
    const lessons = Array.isArray(day.lessons) ? day.lessons : [];
    return `<article class="admin-day-card" data-day-index="${dayIndex}">
      <div class="admin-day-card-head">
        <div class="admin-day-index">${String(dayIndex+1).padStart(2,"0")}</div>
        <div class="admin-day-main-fields">
          <label class="admin-field"><span>Дата</span><input data-day-field="date" value="${escapeAttr(day.date)}" placeholder="02.11.2026"></label>
          <label class="admin-field"><span>День недели</span><input data-day-field="day" value="${escapeAttr(day.day)}"></label>
          <label class="admin-field"><span>Группы</span><input data-day-field="groups" value="${escapeAttr(day.groups)}"></label>
        </div>
        <button class="admin-icon-danger" data-action="delete-day" type="button" title="Удалить день">×</button>
      </div>
      <div class="admin-lessons-editor">${lessons.map((lesson, i)=>renderLesson(lesson, i)).join("")}</div>
      <button class="admin-add-lesson-btn" data-action="add-lesson" type="button">+ Добавить занятие</button>
    </article>`;
  }

  function renderLesson(lesson, lessonIndex){
    return `<div class="admin-lesson-row" data-lesson-index="${lessonIndex}">
      <label class="admin-field"><span>Время</span><input data-lesson-field="time" value="${escapeAttr(lesson.time)}"></label>
      <label class="admin-field admin-field-wide"><span>Предмет</span><input data-lesson-field="subject" value="${escapeAttr(lesson.subject)}"></label>
      <label class="admin-field"><span>Преподаватель</span><input data-lesson-field="teacher" value="${escapeAttr(lesson.teacher)}"></label>
      <label class="admin-field"><span>Аудитория</span><input data-lesson-field="room" value="${escapeAttr(lesson.room)}"></label>
      <button class="admin-icon-danger admin-lesson-delete" data-action="delete-lesson" type="button" title="Удалить занятие">×</button>
    </div>`;
  }

  function syncFromInputs(){
    const schedule = currentSchedule();
    schedule.title = titleInput.value.trim();
    schedule.semester = semesterInput.value.trim();
    daysContainer.querySelectorAll(".admin-day-card").forEach((dayCard, dayIndex)=>{
      const day = schedule.days[dayIndex]; if(!day) return;
      dayCard.querySelectorAll("[data-day-field]").forEach(input=>{ day[input.dataset.dayField] = input.value.trim(); });
      dayCard.querySelectorAll(".admin-lesson-row").forEach((row, lessonIndex)=>{
        const lesson = day.lessons[lessonIndex]; if(!lesson) return;
        row.querySelectorAll("[data-lesson-field]").forEach(input=>{ lesson[input.dataset.lessonField] = input.value.trim(); });
      });
    });
  }

  function markDirty(){ saveStatus.textContent = "Есть несохранённые изменения"; saveStatus.className = "admin-save-status is-dirty"; }

  function bindDayEvents(){
    daysContainer.querySelectorAll("input").forEach(input=>input.addEventListener("input",markDirty));
    daysContainer.querySelectorAll("[data-action='delete-day']").forEach(button=>button.addEventListener("click",()=>{
      syncFromInputs(); const i=Number(button.closest(".admin-day-card").dataset.dayIndex);
      if(confirm("Удалить этот день из расписания?")){ currentSchedule().days.splice(i,1); renderEditor(); markDirty(); }
    }));
    daysContainer.querySelectorAll("[data-action='add-lesson']").forEach(button=>button.addEventListener("click",()=>{
      syncFromInputs(); const i=Number(button.closest(".admin-day-card").dataset.dayIndex);
      currentSchedule().days[i].lessons.push({time:"",subject:"",teacher:"",room:""}); renderEditor(); markDirty();
    }));
    daysContainer.querySelectorAll("[data-action='delete-lesson']").forEach(button=>button.addEventListener("click",()=>{
      syncFromInputs(); const dc=button.closest(".admin-day-card"), lr=button.closest(".admin-lesson-row");
      currentSchedule().days[Number(dc.dataset.dayIndex)].lessons.splice(Number(lr.dataset.lessonIndex),1); renderEditor(); markDirty();
    }));
  }

  trackSelect.addEventListener("change",()=>{ syncFromInputs(); activeKey = trackSelect.value; renderEditor(); });
  titleInput.addEventListener("input",markDirty); semesterInput.addEventListener("input",markDirty);
  addDayButton.addEventListener("click",()=>{ syncFromInputs(); currentSchedule().days.push({date:"",day:"Новый день",groups:"",lessons:[{time:"",subject:"",teacher:"",room:""}]}); renderEditor(); markDirty(); });

  savePreviewButton.addEventListener("click",()=>{
    syncFromInputs(); localStorage.setItem(STORAGE_KEY, JSON.stringify(schedules));
    saveStatus.textContent = "Оба раздела расписания сохранены в браузере. Откройте страницу расписания для проверки.";
    saveStatus.className = "admin-save-status is-saved";
  });

  resetScheduleButton.addEventListener("click",()=>{
    if(!confirm("Удалить сохранённые в браузере изменения и вернуть расписание из schedule.js?")) return;
    localStorage.removeItem(STORAGE_KEY); schedules = clone(sourceSchedules); activeKey = Object.keys(schedules).includes("pedagogy") ? "pedagogy" : Object.keys(schedules)[0];
    renderEditor(); saveStatus.textContent = "Локальные изменения удалены. Загружено расписание из schedule.js"; saveStatus.className = "admin-save-status";
  });

  downloadScheduleButton.addEventListener("click",()=>{
    syncFromInputs();
    const file = `/* Расписание Cleverdi — обновлено через admin.html */\nwindow.CLEVERDI_SCHEDULES = ${JSON.stringify(schedules,null,2)};\nwindow.CLEVERDI_SCHEDULE = window.CLEVERDI_SCHEDULES.economics || Object.values(window.CLEVERDI_SCHEDULES)[0];\n`;
    const blob = new Blob([file],{type:"text/javascript;charset=utf-8"}); const url = URL.createObjectURL(blob); const a = document.createElement("a");
    a.href=url; a.download="schedule.js"; document.body.appendChild(a); a.click(); a.remove(); setTimeout(()=>URL.revokeObjectURL(url),500);
    saveStatus.textContent = "Новый schedule.js скачан — замените им файл на сайте"; saveStatus.className = "admin-save-status is-saved";
  });
})();
