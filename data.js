/* ===========================================================================
   data.js — единственное место, где живут записи архива.
   Сайт читает этот файл напрямую: <script src="data.js"></script> перед app.js.

   ЯЗЫК. Текст записей — всегда английский, на обеих версиях сайта. Половина
   грамот на русском и казахском, и перевод делается один раз здесь, а не
   каждый раз заново под заявку. По-русски остаётся только интерфейс ru.html:
   меню, заголовки секций, «Обо мне».

   ДОБАВИТЬ ЗАПИСЬ = дописать один объект в массив ACHIEVEMENTS. Ничего
   больше трогать не надо: карточка, счётчики и фильтры пересчитаются сами.

   ---------------------------------------------------------------------------
   ПОЛЯ

   cat      категория, один из четырёх ключей:
              'study'    — олимпиады, конкурсы, сертификаты, исследования
              'sport'    — соревнования, разряды
              'creative' — домбра, концерты, театр, актёрское
              'projects' — свои проекты, хакатоны, сайты
   t        название по-английски. Показывается на карточке.
   orig     название как оно напечатано на самой грамоте — по-русски или
            по-казахски. Видно только при открытии скана, на карточке нет.
            Нужно, чтобы перевод можно было перепроверить, не разбирая папку.
            null, пока грамота не на руках.
   org      кто выдал / кто проводил, по-английски. null, если неизвестно.
   y        год. Число, либо null — если год ещё не уточнён.
   res      результат: '1st place', 'participant', 'certificate'. null — если нет.
   status   насколько это подтверждено:
              'confirmed' — есть грамота/диплом на руках
              'approx'    — было, но цифры или детали по памяти
              'check'     — нужно найти документ и уточнить формулировку
   img      ИМЯ ФАЙЛА скана, без папки: 'sasmo-silver-award-2025.jpg'.
            Папку дописывает app.js: 'images/thumbs/<img>' для карточки,
            'images/full/<img>' для лайтбокса. Оба файла делает скрипт
            `cd tools && npm run images` из фотографии в _raw/. null — скана нет.
   note     одно-два предложения по-английски. Что за событие, сколько
            участников, что сделал лично. null — если пока нечего сказать.

   ---------------------------------------------------------------------------
   ПРАВИЛО ЧЕСТНОСТИ

   Ничего не додумывать. Если точное название олимпиады, год или место
   неизвестны — оставить null и поставить status:'check'. Пустое поле честнее
   правдоподобной выдумки: этот архив пойдёт в CV и заявки, и каждая строка
   должна выдержать вопрос «покажи документ».

   Записи ниже собраны с твоих слов. Всё, что было сказано приблизительно,
   помечено 'approx' или 'check' — пройдись по ним, когда достанешь папку
   с грамотами, и заодно впиши orig с бумаги.
   =========================================================================== */

const ACHIEVEMENTS = [

  /* ---------- STUDY ---------- */

  {
    cat: 'study',
    t: 'Daryn national research contest',
    orig: null,
    org: 'Daryn · Economics and Finance section',
    y: 2026,
    res: 'participant',
    status: 'check',
    img: null,
    note: 'Research on how AI is changing sales work in Kazakhstan: which parts of a sales manager\'s job AI augments, which it automates, and which still need a person. The topic grew out of my own sales experience and my work on Deliox.'
  },
  {
    cat: 'study',
    t: 'SASMO — Silver Award',
    orig: null,
    org: 'SASMO · Nazarbayev Intellectual School of Physics and Mathematics, Astana',
    y: 2025,
    res: 'Silver Award',
    status: 'confirmed',
    img: 'sasmo-silver-award-2025.jpg',
    note: 'Singapore & Asian Schools Math Olympiad 2025. Silver Award for outstanding achievement, sat through Nazarbayev Intellectual School of Physics and Mathematics in Astana. Certificate no. A0483166.'
  },
  {
    cat: 'study',
    t: 'Mathematics olympiad — Bronze Award',
    orig: null,
    org: null,
    y: null,
    res: 'Bronze Award',
    status: 'check',
    img: null,
    note: 'One of three bronze results. Which olympiad (SASMO / AMO / Nurorda) and which year — to be filled in from the certificate.'
  },
  {
    cat: 'study',
    t: 'Mathematics olympiad — Bronze Award',
    orig: null,
    org: null,
    y: null,
    res: 'Bronze Award',
    status: 'check',
    img: null,
    note: 'Second of three bronze results.'
  },
  {
    cat: 'study',
    t: 'Mathematics olympiad — Bronze Award',
    orig: null,
    org: null,
    y: null,
    res: 'Bronze Award',
    status: 'check',
    img: null,
    note: 'Third of three bronze results.'
  },
  {
    cat: 'study',
    t: 'Mathematics olympiad — Honorable Mention',
    orig: null,
    org: null,
    y: null,
    res: 'Honorable Mention',
    status: 'check',
    img: null,
    note: 'Olympiad and year to be confirmed from the certificate.'
  },

  /* ---------- SPORT ---------- */

  {
    cat: 'sport',
    t: 'Chess — second category rank',
    orig: null,
    org: null,
    y: null,
    res: '2nd category',
    status: 'confirmed',
    img: null,
    note: 'The rank is backed by a certificate. Year and issuing body still to be filled in.'
  },
  {
    cat: 'sport',
    t: 'Tennis tournaments',
    orig: null,
    org: null,
    y: null,
    res: '1st and 2nd places',
    status: 'approx',
    img: null,
    note: 'About five tournaments, with both first and second places among the results. Exact counts are to be confirmed from the certificates; this entry should then be split into one entry per tournament.'
  },
  {
    cat: 'sport',
    t: 'Taekwondo — 1st place',
    orig: null,
    org: null,
    y: null,
    res: '1st place',
    status: 'check',
    img: null,
    note: 'From childhood training. The exact name and level of the competition must be verified against the certificate before this goes into any official application.'
  },

  /* ---------- ARTS ---------- */

  {
    cat: 'creative',
    t: 'Dombra — concert certificates',
    orig: null,
    org: null,
    y: null,
    res: null,
    status: 'approx',
    img: null,
    note: 'Three years of dombra and 5–6 concerts on school and city stages, including one large ensemble performance in a theatre. Some concerts came with certificates; each should become its own entry once collected.'
  },

  /* ---------- PROJECTS AND HACKATHONS ---------- */

  {
    cat: 'projects',
    t: 'Hackathon — participation award',
    orig: null,
    org: null,
    y: null,
    res: 'participant',
    status: 'check',
    img: null,
    note: 'First hackathon. Name, date, team and project to be filled in.'
  },
  {
    cat: 'projects',
    t: 'Hackathon — participation award',
    orig: null,
    org: null,
    y: null,
    res: 'participant',
    status: 'check',
    img: null,
    note: 'Second hackathon. Name, date, team and project to be filled in.'
  },
  {
    cat: 'projects',
    t: 'Future Minds Hackathon, Social Impact track',
    orig: null,
    org: 'Future Minds',
    y: 2026,
    res: 'certificate pending',
    status: 'check',
    img: null,
    note: 'The Sabaqtas project. Update the result and attach the scan once the certificate arrives.'
  }

];

/* ===========================================================================
   EXPERIENCE — отдельная секция, не попадает в сетку грамот.
   То, что реально было, но бумагой не подтверждается.
   =========================================================================== */

const EXPERIENCE = [
  {
    t: 'Deliox — founder',
    period: 'ongoing',
    note: 'An AI trainer for cold sales calls. Product idea, frontend and landing page. A team of three: development, backend, marketing.'
  },
  {
    t: 'QozGal — a transit service for Astana',
    period: 'wrapping up autumn 2026',
    note: 'An app that picks the right bus and tells you when to get off. Roughly 50–60% done. The blocker is access to real-time bus movement data.'
  },
  {
    t: 'Sales experience',
    period: 'a few weeks',
    note: 'Cold calls, conversations with prospects, handling objections. Both Deliox and the Daryn research topic came out of this.'
  },
  {
    t: 'Football',
    period: 'ongoing',
    note: 'I play regularly. Roughly top ten in my year was mentioned once, but the criteria were never recorded and there is no document.'
  },
  {
    t: 'Web development',
    period: 'ongoing',
    note: 'The Deliox landing page, sites for hackathon projects, and this archive.'
  }
];
