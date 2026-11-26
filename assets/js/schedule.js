/* ============================================================
   РАСПИСАНИЕ CLEVERDI — РЕДАКТИРУЙТЕ ДАННЫЕ ЗДЕСЬ

   Расписания разделены на два независимых блока:
   1) pedagogy  — Педагогика / Физ-26
   2) economics — ЭУП / ФК / БУХ

   Чтобы изменить время, предмет, преподавателя или аудиторию,
   поменяйте нужную строку ниже и сохраните этот файл.
   ============================================================ */

const CLEVERDI_PEDAGOGY_TIMES = {
  first: "8.00-9.20",
  second: "9.30-10.50"
};

const CLEVERDI_ECONOMY_TIMES = {
  morningFirst: "9.30-10.50",
  morningSecond: "11.20-12.40",
  first: "12.50-14.10",
  second: "14.20-15.20"
};

const CLEVERDI_ITU_RYAL_TIMES = {
  early: "8.00-9.20",
  first: "9.30-10.50",
  second: "11.20-12.40",
  third: "12.50-14.10"
};

window.CLEVERDI_SCHEDULES = {
  pedagogy: {
    label: "Педагогика и физвоспитание",
    shortLabel: "Педагогика / Физ-26",
    title: "Расписание — Педагогика и физвоспитание",
    semester: "1 семестр · 2026–2027 учебный год",
    startDate: "09.11.2026",
    days: [
      {
        date: "09.11.2026",
        day: "Понедельник",
        groups: "Пед-26, Физ-26",
        lessons: [
          { time: CLEVERDI_PEDAGOGY_TIMES.first, subject: "Философия", teacher: "Мырзабаева Н.С.", room: "30 ауд" }
        ]
      },
      {
        date: "10.11.2026",
        day: "Вторник",
        groups: "Пед-26, Физ-26",
        lessons: [
          { time: CLEVERDI_PEDAGOGY_TIMES.first, subject: "Математика и информатика", teacher: "Абдуразак у. Уларбек", room: "30 ауд" },
          { time: CLEVERDI_PEDAGOGY_TIMES.second, subject: "Основы педагогического мастерства", teacher: "Паязова А.", room: "30 ауд." }
        ]
      },
      {
        date: "11.11.2026",
        day: "Среда",
        groups: "Пед-26, Физ-26",
        lessons: [
          { time: CLEVERDI_PEDAGOGY_TIMES.first, subject: "Русский язык", teacher: "Пайзуллаева К.У.", room: "30 ауд" },
          { time: CLEVERDI_PEDAGOGY_TIMES.second, subject: "Педагогика", teacher: "Танырыкова М.", room: "30 ауд" }
        ]
      },
      {
        date: "12.11.2026",
        day: "Четверг",
        groups: "Пед-26, Физ-26",
        lessons: [
          { time: CLEVERDI_PEDAGOGY_TIMES.first, subject: "Введение в специальность", teacher: "Мамбеталиева Г.", room: "30 ауд" },
          { time: CLEVERDI_PEDAGOGY_TIMES.second, subject: "Экология", teacher: "Пирматова Ж.", room: "30 ауд." }
        ]
      },
      {
        date: "13.11.2026",
        day: "Пятница",
        groups: "Пед-26, Физ-26",
        lessons: [
          { time: CLEVERDI_PEDAGOGY_TIMES.first, subject: "Педагогика", teacher: "Танырыкова М.", room: "30 ауд." },
          { time: CLEVERDI_PEDAGOGY_TIMES.second, subject: "ОБЖ", teacher: "Оружев О.К.", room: "30 ауд" }
        ]
      }
    ]
  },

  economics: {
    label: "Экономика",
    shortLabel: "ЭУП / ФК / БУХ",
    title: "Расписание — Экономические направления",
    semester: "1 семестр · 2026–2027 учебный год",
    startDate: "09.11.2026",
    days: [
      {
        date: "09.11.2026",
        day: "Понедельник",
        groups: "ЭУП-26, ФК-26, БУХ-26",
        lessons: [
          { time: CLEVERDI_ECONOMY_TIMES.first, subject: "Информатика и математика", teacher: "Жапаров А.", room: "40 ауд." },
          { time: CLEVERDI_ECONOMY_TIMES.second, subject: "Философия", teacher: "Мырзабаева Н.С.", room: "30 ауд" }
        ]
      },
      {
        date: "10.11.2026",
        day: "Вторник",
        groups: "ЭУП-1-26, ФК-1-26, БУХ-1-26",
        lessons: [
          { time: CLEVERDI_ECONOMY_TIMES.first, subject: "", teacher: "", room: "" },
          { time: CLEVERDI_ECONOMY_TIMES.second, subject: "Микроэкономика", teacher: "Сартбаева Г.П.", room: "30 ауд" },
          { time: "15.30-16.30", subject: "Философия", teacher: "Мырзабаева Н.С.", room: "30 ауд" }
        ]
      },
      {
        date: "11.11.2026",
        day: "Среда",
        groups: "ЭУП-1-26, ФК-1-26, БУХ-1-26",
        lessons: [
          { time: CLEVERDI_ECONOMY_TIMES.first, subject: "", teacher: "", room: "" },
          { time: CLEVERDI_ECONOMY_TIMES.second, subject: "Введение в специальность", teacher: "Абдыкалыкова Ж.", room: "30 ауд" }
        ]
      },
      {
        date: "12.11.2026",
        day: "Четверг",
        groups: "ЭУП-1-26, ФК-1-26, БУХ-1-26",
        lessons: [
          { time: CLEVERDI_ECONOMY_TIMES.morningFirst, subject: "Русский язык и литература", teacher: "Пайзулаева К.У.", room: "" },
          { time: CLEVERDI_ECONOMY_TIMES.morningSecond, subject: "Русский язык и литература", teacher: "Пайзулаева К.У.", room: "" },
          { time: CLEVERDI_ECONOMY_TIMES.first, subject: "Экономическое мышление", teacher: "Абдыкалыкова Ж.", room: "30 ауд" },
          { time: CLEVERDI_ECONOMY_TIMES.second, subject: "ОБЖ", teacher: "Оружев О.К.", room: "30 ауд." }
        ]
      },
      {
        date: "13.11.2026",
        day: "Пятница",
        groups: "ЭУП-1-26, ФК-1-26, БУХ-1-26",
        lessons: [
          { time: CLEVERDI_ECONOMY_TIMES.morningFirst, subject: "Русский язык и литература", teacher: "Пайзулаева К.У.", room: "" },
          { time: CLEVERDI_ECONOMY_TIMES.morningSecond, subject: "Русский язык и литература", teacher: "Пайзулаева К.У.", room: "" },
          { time: CLEVERDI_ECONOMY_TIMES.second, subject: "Экология", teacher: "Пирматова Ж.", room: "30 ауд." }
        ]
      }
    ]
  },

  itu: {
    label: "ИТУ",
    shortLabel: "ИТУ-26",
    title: "Расписание — ИТУ",
    semester: "1 семестр · 2026–2027 учебный год",
    startDate: "23.11.2026",
    days: [
      {
        date: "23.11.2026",
        day: "Понедельник",
        groups: "ИТУ-26",
        lessons: [
          { time: CLEVERDI_ITU_RYAL_TIMES.early, subject: "Философия", teacher: "Мырзабаева Н.С.", room: "18б ауд" },
          { time: CLEVERDI_ITU_RYAL_TIMES.first, subject: "Математика и информатика", teacher: "Мамадалиева К.А.", room: "18б ауд" },
          { time: CLEVERDI_ITU_RYAL_TIMES.second, subject: "ОБЖ", teacher: "Оружев О.", room: "18б ауд" }
        ]
      },
      {
        date: "24.11.2026",
        day: "Вторник",
        groups: "ИТУ-26",
        lessons: [
          { time: CLEVERDI_ITU_RYAL_TIMES.second, subject: "Технические средства интернет технологий", teacher: "Абдуразак у. У.", room: "18б ауд" },
          { time: CLEVERDI_ITU_RYAL_TIMES.third, subject: "Английский язык", teacher: "Алымкулов А.", room: "42 ауд" }
        ]
      },
      {
        date: "25.11.2026",
        day: "Среда",
        groups: "ИТУ-26",
        lessons: []
      },
      {
        date: "26.11.2026",
        day: "Четверг",
        groups: "ИТУ-26",
        lessons: [
          { time: CLEVERDI_ITU_RYAL_TIMES.early, subject: "Основы программирования", teacher: "Сапарбек кызы А.", room: "18б ауд" },
          { time: CLEVERDI_ITU_RYAL_TIMES.first, subject: "Экология", teacher: "Пирматова Ж.", room: "18б ауд" },
          { time: CLEVERDI_ITU_RYAL_TIMES.second, subject: "Английский язык", teacher: "Алымкулов А.", room: "18б ауд" }
        ]
      },
      {
        date: "27.11.2026",
        day: "Пятница",
        groups: "ИТУ-26",
        lessons: [
          { time: CLEVERDI_ITU_RYAL_TIMES.early, subject: "Математика и информатика", teacher: "Мамадалиева К.", room: "18б ауд" },
          { time: CLEVERDI_ITU_RYAL_TIMES.first, subject: "Архитектура ЭВМ", teacher: "Мамасадыков М.Х.", room: "30 ауд" }
        ]
      },
      {
        date: "28.11.2026",
        day: "Суббота",
        groups: "ИТУ-26",
        lessons: [
          { time: CLEVERDI_ITU_RYAL_TIMES.early, subject: "Математика и информатика", teacher: "Мамадалиева К.", room: "20, 22 ауд" },
          { time: CLEVERDI_ITU_RYAL_TIMES.first, subject: "Основы программирования", teacher: "Сапарбек к. Аймончок", room: "20, 22 ауд" }
        ]
      }
    ]
  },

  ryal: {
    label: "РЯЛ",
    shortLabel: "РЯЛ-26",
    title: "Расписание — РЯЛ",
    semester: "1 семестр · 2026–2027 учебный год",
    startDate: "23.11.2026",
    days: [
      {
        date: "23.11.2026",
        day: "Понедельник",
        groups: "РЯЛ-26",
        lessons: [
          { time: CLEVERDI_ITU_RYAL_TIMES.early, subject: "Философия", teacher: "Мырзабаева Н.С.", room: "18б ауд" },
          { time: CLEVERDI_ITU_RYAL_TIMES.first, subject: "Математика и информатика", teacher: "Мамадалиева К.А.", room: "18б ауд" },
          { time: CLEVERDI_ITU_RYAL_TIMES.second, subject: "ОБЖ", teacher: "Оружев О.", room: "18б ауд" }
        ]
      },
      {
        date: "24.11.2026",
        day: "Вторник",
        groups: "РЯЛ-26",
        lessons: []
      },
      {
        date: "25.11.2026",
        day: "Среда",
        groups: "РЯЛ-26",
        lessons: [
          { time: CLEVERDI_ITU_RYAL_TIMES.early, subject: "Практический курс русского языка и литературы", teacher: "Зулпукарова Н.Д.", room: "30 ауд" },
          { time: CLEVERDI_ITU_RYAL_TIMES.first, subject: "Русский язык", teacher: "Пайзулаева К.К.", room: "30 ауд" },
          { time: CLEVERDI_ITU_RYAL_TIMES.second, subject: "Английский язык", teacher: "Алымкулов А.", room: "30 ауд" }
        ]
      },
      {
        date: "26.11.2026",
        day: "Четверг",
        groups: "РЯЛ-26",
        lessons: [
          { time: CLEVERDI_ITU_RYAL_TIMES.early, subject: "Основы программирования", teacher: "Сапарбек кызы А.", room: "18б ауд" },
          { time: CLEVERDI_ITU_RYAL_TIMES.first, subject: "Экология", teacher: "Пирматова Ж.", room: "18б ауд" },
          { time: CLEVERDI_ITU_RYAL_TIMES.second, subject: "Развитие устной и письменной речи", teacher: "Зулпукарова Н.Д.", room: "30 ауд" }
        ]
      },
      {
        date: "27.11.2026",
        day: "Пятница",
        groups: "РЯЛ-26",
        lessons: [
          { time: CLEVERDI_ITU_RYAL_TIMES.early, subject: "Математика и информатика", teacher: "Мамадалиева К.", room: "18б ауд" },
          { time: CLEVERDI_ITU_RYAL_TIMES.first, subject: "Русский язык", teacher: "Пайзулаева К.", room: "45 ауд" }
        ]
      },
      {
        date: "28.11.2026",
        day: "Суббота",
        groups: "РЯЛ-26",
        lessons: [
          { time: CLEVERDI_ITU_RYAL_TIMES.first, subject: "Математика и информатика", teacher: "Мамадалиева К.", room: "20, 22 ауд" },
          { time: "11.20-10.50", subject: "ОБЖ", teacher: "Оружев О.К.", room: "32 ауд" }
        ]
      }
    ]
  },

  jurisprudence: {
    label: "Юриспруденция",
    shortLabel: "ЮР-26",
    title: "Расписание — Юриспруденция",
    semester: "1 семестр · 2026–2027 учебный год",
    startDate: "30.11.2026",
    days: [
      {
        date: "30.11.2026",
        day: "Понедельник",
        groups: "ЮР-26",
        lessons: [
          { time: "8.00-9.20", subject: "История государства и права зарубежных стран", teacher: "Кудаярова Б.А.", room: "18б ауд" },
          { time: "9.30-10.50", subject: "Введение в специальность", teacher: "Чонотаева М.С.", room: "18б ауд" },
          { time: "11.20-12.40", subject: "ОБЖ", teacher: "Оружев О.", room: "18б ауд" }
        ]
      },
      {
        date: "01.12.2026",
        day: "Вторник",
        groups: "ЮР-26",
        lessons: [
          { time: "11.20-12.40", subject: "Профессиональная этика юриста", teacher: "Качкынбаева А.С.", room: "18б ауд" },
          { time: "12.50-14.10", subject: "Английский язык", teacher: "Алымкулов А.", room: "42 ауд" }
        ]
      },
      {
        date: "02.12.2026",
        day: "Среда",
        groups: "ЮР-26",
        lessons: [
          { time: "9.30-10.50", subject: "История России", teacher: "Курбанбекова К.К.", room: "18б ауд" },
          { time: "11.20-12.40", subject: "Теория государства и права", teacher: "Чонотаева М.С.", room: "18б ауд" }
        ]
      },
      {
        date: "03.12.2026",
        day: "Четверг",
        groups: "ЮР-26",
        lessons: [
          { time: "8.00-9.20", subject: "История России", teacher: "Курбанбекова К.К.", room: "18б ауд" },
          { time: "9.30-10.50", subject: "Введение в специальность", teacher: "Чонотаева М.С.", room: "18б ауд" },
          { time: "11.20-12.40", subject: "Английский язык", teacher: "Алымкулов А.", room: "18б ауд" }
        ]
      },
      {
        date: "04.12.2026",
        day: "Пятница",
        groups: "ЮР-26",
        lessons: [
          { time: "8.00-9.20", subject: "ОБЖ", teacher: "Оружев О.", room: "18б ауд" },
          { time: "9.30-10.50", subject: "История государства и права зарубежных стран", teacher: "Кудаярова Б.А.", room: "42 ауд" }
        ]
      }
    ]
  }
};

// Совместимость со старой админкой/кодом.
window.CLEVERDI_SCHEDULE = window.CLEVERDI_SCHEDULES.economics;
