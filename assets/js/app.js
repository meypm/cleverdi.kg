const DATA = Array.isArray(window.CLEVERDI_STUDENTS) ? window.CLEVERDI_STUDENTS : [];
const PAGE_SIZE = 40;

const specialtyGrid = document.getElementById("specialtyGrid");
const roundSelect = document.getElementById("roundSelect");
const specialtySelect = document.getElementById("specialtySelect");
const statusSelect = document.getElementById("statusSelect");
const searchInput = document.getElementById("studentSearch");
const body = document.getElementById("studentsBody");
const emptyState = document.getElementById("emptyState");
const pagination = document.getElementById("pagination");
const listTitle = document.getElementById("listTitle");
const listDescription = document.getElementById("listDescription");
const listCount = document.getElementById("listCount");
const listKicker = document.getElementById("listKicker");
const passingScoreHeader = document.getElementById("passingScoreHeader");
const resultHeader = document.getElementById("resultHeader");
const clearButton = document.getElementById("clearButton");
const menuButton = document.getElementById("menuButton");
const nav = document.getElementById("nav");

let currentPage = 1;
let currentRound = roundSelect?.value || "1";

function normalize(value){
  return String(value ?? "").trim().toLocaleLowerCase("ru-RU").replace(/\s+/g," ");
}
function roundLabel(round=currentRound){
  return round === "3" ? "3 тур" : round === "2" ? "2 тур" : "1 тур";
}
function isInRound(student,round=currentRound){
  if(round === "3") return student.hasRound3 === true;
  if(round === "2") return student.hasRound2 === true;
  return student.hasRound1 !== false;
}
function roundValues(student,round=currentRound){
  if(round === "3"){
    return {passingScore:student.round3PassingScore, result:student.round3Result};
  }
  if(round === "2"){
    return {passingScore:student.round2PassingScore, result:student.round2Result};
  }
  return {passingScore:student.passingScore, result:student.result};
}
function statusOf(student,round=currentRound){
  const values = roundValues(student,round);
  if(values.result === null || values.result === "" || values.passingScore === null || values.passingScore === "") return "pending";
  return Number(values.result) >= Number(values.passingScore) ? "passed" : "failed";
}
function statusLabel(status){
  return status === "passed" ? "Проходной балл набран" : status === "failed" ? "Не набран" : "Нет результата";
}
function score(value){
  return value === null || value === "" ? "—" : String(value);
}
function specialties(){
  return [...new Set(DATA.filter(s=>isInRound(s)).map(s=>s.specialty).filter(Boolean))].sort((a,b)=>a.localeCompare(b,"ru"));
}
function allSpecialties(){
  return [...new Set(DATA.map(s=>s.specialty).filter(Boolean))].sort((a,b)=>a.localeCompare(b,"ru"));
}
function countBySpecialty(name){
  return DATA.filter(s=>isInRound(s) && s.specialty===name).length;
}
function escapeHtml(v){
  return String(v ?? "").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]));
}
function plural(n,one,few,many){
  n=Math.abs(n)%100;const n1=n%10;
  if(n>10&&n<20)return many;
  if(n1>1&&n1<5)return few;
  if(n1===1)return one;
  return many;
}

function updateHeroStats(){
  const active = DATA.filter(s=>isInRound(s));
  const heroStudentCount = document.getElementById("heroStudentCount");
  const heroSpecialtyCount = document.getElementById("heroSpecialtyCount");
  if(heroStudentCount) heroStudentCount.textContent = active.length;
  if(heroSpecialtyCount) heroSpecialtyCount.textContent = new Set(active.map(s=>s.specialty).filter(Boolean)).size;
}

function buildSpecialties(preferredSpecialty=""){
  const names = specialties();
  specialtyGrid.innerHTML = "";
  specialtySelect.innerHTML = '<option value="">Все специальности</option>';

  names.forEach((name,index)=>{
    const count = countBySpecialty(name);

    const option = document.createElement("option");
    option.value = name;
    option.textContent = `${name} — ${count}`;
    specialtySelect.appendChild(option);

    const button = document.createElement("button");
    button.type = "button";
    button.className = "specialty-card";
    button.dataset.specialty = name;
    button.innerHTML = `
      <span class="specialty-icon">${String(index+1).padStart(2,"0")}</span>
      <strong>${escapeHtml(name)}</strong>
      <span>${count} ${plural(count,"студент","студента","студентов")}</span>`;
    button.addEventListener("click",()=>{
      specialtySelect.value = name;
      searchInput.value = "";
      statusSelect.value = "";
      currentPage = 1;
      render();
      document.getElementById("students").scrollIntoView({behavior:"smooth",block:"start"});
    });
    specialtyGrid.appendChild(button);
  });

  if(preferredSpecialty && names.includes(preferredSpecialty)){
    specialtySelect.value = preferredSpecialty;
  }else{
    specialtySelect.value = "";
  }
}

function filtered(){
  const q = normalize(searchInput.value);
  const spec = specialtySelect.value;
  const stat = statusSelect.value;

  return DATA.filter(s=>{
    const roundOk = isInRound(s);
    const qOk = !q || normalize(s.fullName).includes(q) || normalize(s.rawName).includes(q);
    const specOk = !spec || s.specialty === spec;
    const statOk = !stat || statusOf(s) === stat;
    return roundOk && qOk && specOk && statOk;
  }).sort((a,b)=>{
    const bySpec = a.specialty.localeCompare(b.specialty,"ru");
    return bySpec || a.fullName.localeCompare(b.fullName,"ru");
  });
}

function render(){
  const items = filtered();
  const spec = specialtySelect.value;
  const q = searchInput.value.trim();
  const rLabel = roundLabel();

  if(listKicker) listKicker.textContent = `Список 2026–2027 · ${rLabel}`;
  if(passingScoreHeader) passingScoreHeader.textContent = `Проходной балл`;
  if(resultHeader) resultHeader.textContent = `Результат ${rLabel}`;

  listTitle.textContent = spec || (q ? "Результаты поиска" : `Все студенты — ${rLabel}`);
  listDescription.textContent = spec
    ? `Студенты специальности «${spec}». Показаны результаты за ${rLabel}.`
    : q
      ? `Совпадения по запросу «${q}» за ${rLabel}.`
      : `Все специальности. Сейчас выбран ${rLabel}. Используйте поиск или фильтры для быстрого просмотра.`;
  listCount.textContent = `${items.length} ${plural(items.length,"запись","записи","записей")}`;

  document.querySelectorAll(".specialty-card").forEach(card=>{
    card.classList.toggle("active", !!spec && card.dataset.specialty === spec);
  });

  const pages = Math.max(1,Math.ceil(items.length/PAGE_SIZE));
  if(currentPage > pages) currentPage = pages;
  const start = (currentPage-1)*PAGE_SIZE;
  const pageItems = items.slice(start,start+PAGE_SIZE);

  body.innerHTML = pageItems.map((s,idx)=>{
    const values = roundValues(s);
    const status = statusOf(s);
    return `<tr>
      <td data-label="№">${start+idx+1}</td>
      <td data-label="ФИО"><span class="student-name">${escapeHtml(s.fullName)}</span></td>
      <td data-label="Специальность"><span class="student-spec">${escapeHtml(s.specialty)}</span></td>
      <td data-label="Проходной балл"><span class="score ${values.passingScore==null?"missing":""}">${score(values.passingScore)}</span></td>
      <td data-label="Результат ${rLabel}"><span class="score ${values.result==null?"missing":""}">${score(values.result)}</span></td>
      <td data-label="Итог"><span class="status ${status}">${statusLabel(status)}</span></td>
    </tr>`;
  }).join("");

  emptyState.classList.toggle("hidden",items.length!==0);
  document.querySelector(".table-wrap").classList.toggle("hidden",items.length===0);
  renderPagination(items.length,pages);
}

function renderPagination(total,pages){
  pagination.innerHTML = "";
  if(total <= PAGE_SIZE) return;

  const make=(label,page,disabled=false,active=false)=>{
    const b=document.createElement("button");
    b.type="button";b.className="page-button"+(active?" active":"");
    b.textContent=label;b.disabled=disabled;
    b.addEventListener("click",()=>{
      currentPage=page;render();
      document.getElementById("students").scrollIntoView({behavior:"smooth",block:"start"});
    });
    pagination.appendChild(b);
  };

  make("←",Math.max(1,currentPage-1),currentPage===1);
  let points = new Set([1,pages,currentPage-1,currentPage,currentPage+1]);
  [...points].filter(p=>p>=1&&p<=pages).sort((a,b)=>a-b).forEach((p,i,arr)=>{
    if(i>0 && p-arr[i-1]>1){
      const dots=document.createElement("span");dots.className="page-button";dots.textContent="…";dots.style.display="grid";dots.style.placeItems="center";pagination.appendChild(dots);
    }
    make(String(p),p,false,p===currentPage);
  });
  make("→",Math.min(pages,currentPage+1),currentPage===pages);
}

let searchTimer;
searchInput.addEventListener("input",()=>{
  clearTimeout(searchTimer);
  searchTimer=setTimeout(()=>{currentPage=1;render()},120);
});
if(roundSelect){
  roundSelect.addEventListener("change",()=>{
    const preferredSpecialty = specialtySelect.value;
    currentRound = ["1","2","3"].includes(roundSelect.value) ? roundSelect.value : "1";
    statusSelect.value = "";
    currentPage = 1;
    buildSpecialties(preferredSpecialty);
    updateHeroStats();
    render();
  });
}
specialtySelect.addEventListener("change",()=>{currentPage=1;render()});
statusSelect.addEventListener("change",()=>{currentPage=1;render()});
clearButton.addEventListener("click",()=>{
  searchInput.value="";specialtySelect.value="";statusSelect.value="";currentPage=1;render();
});

menuButton.addEventListener("click",()=>{
  const open=nav.classList.toggle("open");
  menuButton.setAttribute("aria-expanded",String(open));
});
nav.querySelectorAll("a").forEach(a=>a.addEventListener("click",()=>{nav.classList.remove("open");menuButton.setAttribute("aria-expanded","false")}));

const currentYear = document.getElementById("currentYear");
if(currentYear) currentYear.textContent = new Date().getFullYear();

buildSpecialties();
updateHeroStats();
render();

// Student services
const modals=document.querySelectorAll(".modal");
function openModal(id){const m=document.getElementById(id);if(!m)return;m.classList.remove("hidden");m.setAttribute("aria-hidden","false");document.body.style.overflow="hidden";}
function closeModal(m){if(!m)return;m.classList.add("hidden");m.setAttribute("aria-hidden","true");if(!document.querySelector(".modal:not(.hidden)"))document.body.style.overflow="";}
document.querySelectorAll("[data-open-modal]").forEach(b=>b.addEventListener("click",()=>openModal(b.dataset.openModal)));
document.querySelectorAll("[data-close-modal]").forEach(b=>b.addEventListener("click",()=>closeModal(b.closest(".modal"))));
document.addEventListener("keydown",e=>{if(e.key==="Escape")document.querySelectorAll(".modal:not(.hidden)").forEach(closeModal);});

const certSpec=document.getElementById("certificateSpecialty");
if(certSpec){allSpecialties().forEach(name=>{const o=document.createElement("option");o.value=name;o.textContent=name;certSpec.appendChild(o);});}
const certForm=document.getElementById("certificateForm");
if(certForm){certForm.addEventListener("submit",e=>{e.preventDefault();certForm.classList.add("hidden");document.getElementById("certificateSuccess").classList.remove("hidden");});}

const faqSearch=document.getElementById("faqSearch");
if(faqSearch){faqSearch.addEventListener("input",()=>{const q=normalize(faqSearch.value);document.querySelectorAll("[data-faq-item]").forEach(i=>i.style.display=normalize(i.textContent).includes(q)?"":"none");});}
document.querySelectorAll("[data-faq-question]").forEach(b=>b.addEventListener("click",()=>{openModal("faqModal");const q=normalize(b.dataset.faqQuestion);const item=[...document.querySelectorAll("[data-faq-item]")].find(i=>normalize(i.querySelector("summary").textContent).includes(q));if(item)item.open=true;}));


// ===== Automatic study certificate =====
const certificateStudentSearch = document.getElementById("certificateStudentSearch");
const certificateFindButton = document.getElementById("certificateFindButton");
const certificateSearchMessage = document.getElementById("certificateSearchMessage");
const certificateMatches = document.getElementById("certificateMatches");
const certificatePreview = document.getElementById("certificatePreview");
const certificateFullName = document.getElementById("certificateFullName");
const certificateStudentSpecialty = document.getElementById("certificateStudentSpecialty");
const certificateDate = document.getElementById("certificateDate");
const certificatePrintButton = document.getElementById("certificatePrintButton");
const certificateChangeStudent = document.getElementById("certificateChangeStudent");

function certificateNormalize(value){
  return String(value ?? "").trim().toLocaleLowerCase("ru-RU").replace(/\s+/g," ");
}

function formatCertificateDate(){
  const d = new Date();
  return new Intl.DateTimeFormat("ru-RU",{
    day:"2-digit",month:"2-digit",year:"numeric"
  }).format(d);
}

function findCertificateStudents(){
  if(!certificateStudentSearch) return;
  const q = certificateNormalize(certificateStudentSearch.value);

  certificateMatches.innerHTML = "";
  certificateMatches.classList.add("hidden");
  certificatePreview.classList.add("hidden");
  certificateSearchMessage.classList.remove("error");

  if(q.length < 2){
    certificateSearchMessage.textContent = "Введите минимум 2 буквы фамилии или ФИО.";
    certificateSearchMessage.classList.add("error");
    return;
  }

  const found = DATA
    .filter(student =>
      certificateNormalize(student.fullName).includes(q) ||
      certificateNormalize(student.rawName).includes(q)
    )
    .sort((a,b)=>a.fullName.localeCompare(b.fullName,"ru"))
    .slice(0,20);

  if(!found.length){
    certificateSearchMessage.textContent = "Студент с таким ФИО не найден в списке.";
    certificateSearchMessage.classList.add("error");
    return;
  }

  if(found.length === 1){
    selectCertificateStudent(found[0]);
    return;
  }

  certificateSearchMessage.textContent = `Найдено совпадений: ${found.length}. Выберите нужного студента.`;
  certificateMatches.classList.remove("hidden");

  found.forEach(student=>{
    const button = document.createElement("button");
    button.type = "button";
    button.className = "certificate-match";
    button.innerHTML = `
      <span>
        <strong>${escapeHtml(student.fullName)}</strong>
        <span>${escapeHtml(student.specialty)}</span>
      </span>
      <b>Выбрать</b>`;
    button.addEventListener("click",()=>selectCertificateStudent(student));
    certificateMatches.appendChild(button);
  });
}

function selectCertificateStudent(student){
  certificateSearchMessage.textContent = "Студент найден. Справка сформирована автоматически.";
  certificateSearchMessage.classList.remove("error");
  certificateMatches.classList.add("hidden");

  certificateFullName.textContent = student.fullName;
  certificateStudentSpecialty.textContent = student.specialty;
  certificateDate.textContent = formatCertificateDate();
  
  certificatePreview.classList.remove("hidden");
  setTimeout(()=>certificatePreview.scrollIntoView({behavior:"smooth",block:"nearest"}),50);
}

if(certificateFindButton){
  certificateFindButton.addEventListener("click",findCertificateStudents);
}
if(certificateStudentSearch){
  certificateStudentSearch.addEventListener("keydown",event=>{
    if(event.key==="Enter"){
      event.preventDefault();
      findCertificateStudents();
    }
  });
}
if(certificateChangeStudent){
  certificateChangeStudent.addEventListener("click",()=>{
    certificatePreview.classList.add("hidden");
    certificateStudentSearch.focus();
    certificateStudentSearch.select();
  });
}
if(certificatePrintButton){
  certificatePrintButton.addEventListener("click",()=>{
    document.body.classList.add("print-certificate");
    window.print();
    setTimeout(()=>document.body.classList.remove("print-certificate"),300);
  });
}


// ===== Schedule and announcements =====
const SCHEDULE = (window.CLEVERDI_SCHEDULE && typeof window.CLEVERDI_SCHEDULE === "object")
  ? window.CLEVERDI_SCHEDULE
  : null;

function renderSchedule(){
  if(!SCHEDULE) return;

  const title = document.getElementById("scheduleTitle");
  const subtitle = document.getElementById("scheduleSubtitle");
  const startDate = document.getElementById("scheduleStartDate");
  const announcementTitle = document.getElementById("announcementTitle");
  const announcementGrid = document.getElementById("announcementGrid");
  const lectureNote = document.getElementById("announcementLectureNote");
  const changeNote = document.getElementById("announcementChangeNote");
  const scheduleDays = document.getElementById("scheduleDays");

  if(title) title.textContent = SCHEDULE.title || "Расписание занятий";
  if(subtitle) subtitle.textContent = SCHEDULE.semester || "";
  if(startDate) startDate.textContent = SCHEDULE.startDate || "—";
  if(announcementTitle) announcementTitle.textContent = SCHEDULE.announcementTitle || "Объявление";
  if(lectureNote) lectureNote.textContent = SCHEDULE.lectureNote || "";
  if(changeNote) changeNote.textContent = SCHEDULE.changeNote || "";

  if(announcementGrid){
    const announcements = Array.isArray(SCHEDULE.announcements) ? SCHEDULE.announcements : [];
    announcementGrid.innerHTML = announcements.map((item,index)=>`
      <article class="announcement-card">
        <div class="announcement-number">${String(index+1).padStart(2,"0")}</div>
        <div class="announcement-content">
          <strong class="announcement-period">${escapeHtml(item.period || "")}</strong>
          <div class="announcement-groups">${(Array.isArray(item.groups)?item.groups:[]).map(group=>`<span>${escapeHtml(group)}</span>`).join("")}</div>
          <p>${escapeHtml(item.text || "")}</p>
        </div>
      </article>`).join("");
  }

  if(scheduleDays){
    const days = Array.isArray(SCHEDULE.days) ? SCHEDULE.days : [];
    scheduleDays.innerHTML = days.map((day,index)=>`
      <article class="schedule-day-card">
        <div class="schedule-day-head">
          <div class="schedule-day-number">${String(index+1).padStart(2,"0")}</div>
          <div>
            <h3>${escapeHtml(day.day || "")}</h3>
            <p>${escapeHtml(day.groups || "")}</p>
          </div>
        </div>
        <div class="schedule-lessons">
          ${(Array.isArray(day.lessons)?day.lessons:[]).map(lesson=>{
            const hasSubject = String(lesson.subject || "").trim().length > 0;
            return `
              <div class="schedule-lesson ${hasSubject ? "" : "schedule-lesson-empty"}">
                <div class="schedule-time">${escapeHtml(lesson.time || "—")}</div>
                <div class="schedule-lesson-main">
                  ${hasSubject
                    ? `<strong>${escapeHtml(lesson.subject)}</strong>
                       <div class="schedule-meta">
                         ${lesson.teacher ? `<span>👤 ${escapeHtml(lesson.teacher)}</span>` : ""}
                         ${lesson.room ? `<span>📍 ${escapeHtml(lesson.room)}</span>` : ""}
                       </div>`
                    : `<strong class="schedule-empty-text">В документе не указано</strong>`}
                </div>
              </div>`;
          }).join("")}
        </div>
      </article>`).join("");
  }
}

renderSchedule();
