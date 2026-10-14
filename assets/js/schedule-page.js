(() => {
  const PREVIEW_KEY = "cleverdi_schedule_admin_preview_v1";
  let SCHEDULE = (window.CLEVERDI_SCHEDULE && typeof window.CLEVERDI_SCHEDULE === "object")
    ? window.CLEVERDI_SCHEDULE
    : null;

  try {
    const preview = localStorage.getItem(PREVIEW_KEY);
    if (preview) SCHEDULE = JSON.parse(preview);
  } catch (_) {
    // Если localStorage недоступен, показываем обычный schedule.js.
  }

  const escapeHtml = (value) => String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

  function renderSchedule(){
    if(!SCHEDULE) return;
    const title = document.getElementById("scheduleTitle");
    const subtitle = document.getElementById("scheduleSubtitle");
    const startDate = document.getElementById("scheduleStartDate");
    const scheduleDays = document.getElementById("scheduleDays");

    if(title) title.textContent = SCHEDULE.title || "Расписание занятий";
    if(subtitle) subtitle.textContent = SCHEDULE.semester || "";
    if(startDate) startDate.textContent = SCHEDULE.startDate || "—";

    if(scheduleDays){
      const days = Array.isArray(SCHEDULE.days) ? SCHEDULE.days : [];
      scheduleDays.innerHTML = days.map((day,index)=>`
        <article class="schedule-day-card">
          <div class="schedule-day-head">
            <div class="schedule-day-number">${String(index+1).padStart(2,"0")}</div>
            <div><h3>${escapeHtml(day.day || "")}</h3><p>${escapeHtml(day.groups || "")}</p></div>
          </div>
          <div class="schedule-lessons">
            ${(Array.isArray(day.lessons)?day.lessons:[]).map(lesson=>{
              const hasSubject = String(lesson.subject || "").trim().length > 0;
              return `<div class="schedule-lesson ${hasSubject ? "" : "schedule-lesson-empty"}">
                <div class="schedule-time">${escapeHtml(lesson.time || "—")}</div>
                <div class="schedule-lesson-main">
                  ${hasSubject ? `<strong>${escapeHtml(lesson.subject)}</strong><div class="schedule-meta">${lesson.teacher ? `<span>👤 ${escapeHtml(lesson.teacher)}</span>` : ""}${lesson.room ? `<span>📍 ${escapeHtml(lesson.room)}</span>` : ""}</div>` : `<strong class="schedule-empty-text">В документе не указано</strong>`}
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
  renderSchedule();
})();
