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

  /* ---------- STUDY: olympiads and contests ---------- */

  {
    cat: 'study',
    t: 'SASMO — Silver Award',
    orig: 'SILVER AWARD — for outstanding achievement in Grade 8, Singapore & Asian Schools Math Olympiad 2025',
    org: 'SASMO · Nazarbayev Intellectual School of Physics and Mathematics, Astana',
    y: 2025,
    res: 'Silver Award',
    status: 'confirmed',
    img: 'sasmo-silver-award-2025.jpg',
    note: 'Singapore & Asian Schools Math Olympiad 2025. Silver Award for outstanding achievement in Grade 8. Certificate no. A0483166.'
  },
  {
    cat: 'study',
    t: 'SASMO — Bronze Award',
    orig: 'BRONZE AWARD — for outstanding achievement in Grade 09, 2026 SINGAPORE AND ASIAN SCHOOLS MATH OLYMPIAD',
    org: 'SASMO · Nazarbayev Intellectual School of Science and Mathematics, Nura district of Astana',
    y: 2026,
    res: 'Bronze Award',
    status: 'confirmed',
    img: 'sasmo-bronze-award-2026.jpg',
    note: 'Singapore & Asian Schools Math Olympiad 2026. Bronze Award for outstanding achievement in Grade 09. Certificate no. A0838666.'
  },
  {
    cat: 'study',
    t: 'American Mathematics Olympiad — Bronze Award',
    orig: 'BRONZE AWARD — for outstanding achievement in Grade 9, 2025 AMERICAN MATHEMATICS OLYMPIAD',
    org: 'SIMCC · SIU Carbondale STEM Education Research Center',
    y: 2025,
    res: 'Bronze Award',
    status: 'confirmed',
    img: 'amo-bronze-award-2025.jpg',
    note: 'American Mathematics Olympiad 2025, run by the Singapore International Mastery Contests Centre with Southern Illinois University. Bronze Award for outstanding achievement in Grade 9. Certificate no. A0627761.'
  },
  {
    cat: 'study',
    t: 'Singapore Math Challenge — Commendable Award',
    orig: 'COMMENDABLE AWARD — for outstanding achievement in Grade 9, Singapore Math Challenge 2025',
    org: 'SIMCC · STSTI',
    y: 2025,
    res: 'Commendable Award',
    status: 'confirmed',
    img: 'singapore-math-challenge-commendable-2025.jpg',
    note: 'Singapore Math Challenge 2025. Commendable Award for outstanding achievement in Grade 9. Certificate no. A0592943.'
  },
  {
    cat: 'study',
    t: 'Nurorda Junior Olympiad — 3rd place',
    orig: '«NURORDA JUNIOR OLYMPIAD»-та жүлделі III орын',
    org: 'Nurorda School · Astana Daryny',
    y: 2022,
    res: '3rd place',
    status: 'confirmed',
    img: 'nurorda-junior-olympiad-3rd-2022.jpg',
    note: 'Third-degree diploma at the Nurorda Junior Olympiad in Nur-Sultan, awarded through Astana Daryny.'
  },
  {
    cat: 'study',
    t: 'Daryn national research contest',
    orig: null,
    org: 'Daryn · Economics and Finance section',
    y: 2026,
    res: 'participant',
    status: 'check',
    img: null,
    note: 'Research on how AI is changing sales work in Kazakhstan: which parts of a sales manager\'s job AI augments, which it automates, and which still need a person. The topic grew out of my own sales experience and my work on Deliox. No certificate yet — the contest is in progress.'
  },

  /* ---------- STUDY: school, conferences, volunteering ---------- */

  {
    cat: 'study',
    t: 'WALS 2024 — conference volunteer',
    orig: 'CERTIFICATE — This certifies that Uais Leskhan participated as a volunteer in the International Conference «Lesson Studies: Aspiring for Better Learning and Teaching» organized by the World Association for Lesson Studies and the Center of Excellence NIS',
    org: 'World Association for Lesson Studies · Center of Excellence NIS',
    y: 2024,
    res: 'volunteer',
    status: 'confirmed',
    img: 'wals-conference-volunteer-2024.jpg',
    note: 'Volunteered at the international conference "Lesson Studies: Aspiring for Better Learning and Teaching", Astana, 24–26 September 2024, where I performed on the dombra for the participants. Certificate CV no. 000047.'
  },
  {
    cat: 'study',
    t: 'Science Fair at NIS PhM Astana — letter of appreciation',
    orig: 'III Өңірлік «Science Fair at NIS PhMD Astana» — алғыс хат',
    org: 'Nazarbayev Intellectual School of Physics and Mathematics, Astana',
    y: 2025,
    res: 'letter of appreciation',
    status: 'confirmed',
    img: 'nis-science-fair-organiser-2025.jpg',
    note: 'Letter of appreciation from the third regional Science Fair for student research projects. The letter credits my contribution to running the event; my own part in it was performing on the dombra. It is not an award for competing.'
  },
  {
    cat: 'study',
    t: 'School recognition for olympiad results',
    orig: 'Алғыс хат — пәндік олимпиадаларда жоғары нәтиже',
    org: 'Nazarbayev Intellectual School of Physics and Mathematics, Astana',
    y: 2025,
    res: 'letter of appreciation',
    status: 'confirmed',
    img: 'nis-letter-to-parents-2025.jpg',
    note: 'School letter naming me one of its top students for results in subject olympiads. The letter is addressed to my parents; their names are masked on the scan.'
  },
  /* ---------- SPORT: taekwon-do ITF ---------- */

  {
    cat: 'sport',
    t: 'Russian Open ITF Taekwon-Do Championship — 1st place',
    orig: 'DIPLOMA — 1 PLACE is awarded to LESHAN WIAS for participation in the Russian Open 12th Senior and Junior ITF Taekwon-Do Championship · INDIVIDUAL SPARRING 8-9 YEARS OLD (29 KG) · KLIMOVSK, Moscow region, March 25-28 2019',
    org: 'Russian Taekwon-Do ITF Federation · Klimovsk, Moscow region',
    y: 2019,
    res: '1st place',
    status: 'confirmed',
    img: 'tkd-russian-open-1st-individual-sparring-2019.jpg',
    note: '12th Russian Open Senior and Junior ITF Taekwon-Do Championship, 25–28 March 2019. First place in individual sparring, 29 kg. My surname is misspelled on the certificate itself.'
  },
  {
    cat: 'sport',
    t: 'Russian Open ITF Taekwon-Do Championship — 3rd place, team sparring',
    orig: 'DIPLOMA — 3 PLACE is awarded to LESHAN WEISS for participation in the Russian Open 12th Senior and Junior ITF Taekwon-Do Championship · TEAM SPARRING 8-9 YEARS OLD (8-1 GUP) · KLIMOVSK, Moscow region, March 25-28 2019',
    org: 'Russian Taekwon-Do ITF Federation · Klimovsk, Moscow region',
    y: 2019,
    res: '3rd place',
    status: 'confirmed',
    img: 'tkd-russian-open-3rd-team-sparring-2019.jpg',
    note: 'Third place in team sparring at the same championship, 8–9 years old, 8–1 gup. This event was bracketed by belt grade rather than by weight. My surname is misspelled on the certificate.'
  },
  {
    cat: 'sport',
    t: 'Russian Open ITF Taekwon-Do Championship — 3rd place, team pattern',
    orig: 'DIPLOMA — 3 PLACE is awarded to LESKHAN YAIS for participation in the Russian Open 12th Senior and Junior ITF Taekwon-Do Championship · TEAM PATTERN 8-9 YEARS OLD (8 - 1 GUP) · KLIMOVSK, Moscow region, March 25-28 2019',
    org: 'Russian Taekwon-Do ITF Federation · Klimovsk, Moscow region',
    y: 2019,
    res: '3rd place',
    status: 'confirmed',
    img: 'tkd-russian-open-3rd-team-pattern-2019.jpg',
    note: 'Third place in team pattern at the same championship, 8–9 years old, 8–1 gup. My surname is misspelled on the certificate.'
  },
  {
    cat: 'sport',
    t: 'World Taekwon-Do ITF Festival — 3rd place, sparring',
    orig: 'DIPLOMA — Is awarded to ЛЕСХАН УАИС (Казахстан) · III место · program СПАРРИНГ · age category 8-9 лет · weight category до 30 кг (А) · WORLD TAEKWON-DO ITF FESTIVAL - 2019, ITF HQ Korea',
    org: 'ITF Headquarters Korea · National Taekwon-Do Federation of Kazakhstan',
    y: 2019,
    res: '3rd place',
    status: 'confirmed',
    img: 'tkd-world-itf-festival-3rd-sparring-2019.jpg',
    note: 'World Taekwon-Do ITF Festival 2019. Third place in sparring, under 30 kg. Signed by the ITF HQ Korea president and the head of the Kazakhstan federation.'
  },
  {
    cat: 'sport',
    t: 'Open Asian ITF Taekwon-Do Club Championship — 1st place',
    orig: 'ДИПЛОМ — Награждается [Лесхан Уаис] за занятое I место в открытом клубном чемпионате Азии по таэквон-до ITF в весовой категории [рукописно, не читается] в возрасте 6-8 лет · город Шымкент, 2019 год',
    org: 'National Sport Federation of Taekwon-Do ITF · Shymkent',
    y: 2019,
    res: '1st place',
    status: 'confirmed',
    img: 'tkd-asian-club-1st-weight-category-2019.jpg',
    note: 'Open Asian Taekwon-Do ITF Club Championship, Shymkent, 2019. First place in the 6–8 age group; the weight category is handwritten and cannot be read. The other Shymkent diploma is for the 8–9 age group, so the two are probably different events even though both print 2019.'
  },
  {
    cat: 'sport',
    t: 'Open Asian ITF Taekwon-Do Club Championship — 1st place, second event',
    orig: 'ДИПЛОМ — Награждается [Лесхан Уаис] за занятое I место в открытом клубном чемпионате Азии по таэквон-до ITF в весовой категории [-24] в возрасте 8-9 лет · город Шымкент, 2019 год',
    org: 'National Sport Federation of Taekwon-Do ITF · Shymkent',
    y: 2019,
    res: '1st place',
    status: 'confirmed',
    img: 'tkd-asian-club-1st-age-category-2019.jpg',
    note: 'Second first-place diploma from the Shymkent championship, 8–9 age group, weight category handwritten as −24. Both Shymkent diplomas print 2019 but name different age groups, so they are probably two different events.'
  },
  {
    cat: 'sport',
    t: 'Taekwon-Do — 4th gup',
    orig: 'СЕРТИФИКАТ — Казахстанская национальная федерация традиционного таэквон-до · Имя/Аты: УАИС · Фамилия/Фамилиясы: ЛЕСХАН · Тренер: АБЕНОВ Н.Ж. · Региональный филиал: Астана · Присвоен/Тағайындалған 4 гып 01.11.2019',
    org: 'Kazakhstan National Federation of Traditional Taekwon-Do',
    y: 2019,
    res: '4th gup',
    status: 'confirmed',
    img: 'tkd-belt-4-gup-2019.jpg',
    note: 'Belt rank awarded 1 November 2019, Astana branch. The printed date of birth is masked in the scan.'
  },

  /* ---------- SPORT: chess ---------- */

  {
    cat: 'sport',
    t: 'Chess — 2nd place and second category norm',
    orig: 'Диплом — НАГРАЖДАЕТСЯ [Лесхан Уаис] За занятое II место и выполнения нормы II разряда в квалификационном турнире по шахматам · Главный судья М.Кашев · Шахматный Клуб «ШАХ и МАТ»',
    org: 'Chess club «Шах и мат» · Astana',
    y: null,
    res: '2nd place',
    status: 'confirmed',
    img: 'chess-shahimat-2nd-rank2-norm.jpg',
    note: 'Second place in a qualifying tournament, which also met the norm for the second category — the highest chess rank I hold. The year is not printed on the diploma.'
  },
  {
    cat: 'sport',
    t: 'Chess — second category certificate',
    orig: 'СЕРТИФИКАТ — ВЫДАН [Лесхан Уаис] ЗА ВЫПОЛНЕНИЕ НОРМАТИВА II РАЗРЯДА В КВАЛИФИКАЦИОННОМ ТУРНИРЕ ПО ШАХМАТАМ · ГЛАВНЫЙ СУДЬЯ М. КАШЕВ · ШАХМАТНЫЙ КЛУБ «ШАХ И МАТ» · г. НУР-СУЛТАН',
    org: 'Chess club «Шах и мат» · Nur-Sultan',
    y: null,
    res: '2nd category',
    status: 'confirmed',
    img: 'chess-shahimat-rank2-certificate.jpg',
    note: 'Certificate confirming the second-category norm. Issued in Nur-Sultan, so no later than 2022; the exact year is not printed.'
  },
  {
    cat: 'sport',
    t: 'Chess — 1st place and third category norm',
    orig: 'Диплом — НАГРАЖДАЕТСЯ [Лесхан Уаис] За занятое I место и выполнения нормы 3 разряда в квалификационном турнире по шахматам · Главный судья М.Кашев · Шахматный Клуб «ШАХ и МАТ»',
    org: 'Chess club «Шах и мат»',
    y: null,
    res: '1st place',
    status: 'confirmed',
    img: 'chess-shahimat-1st-rank3-norm.jpg',
    note: 'First place in a qualifying tournament, meeting the third-category norm. No year printed.'
  },
  {
    cat: 'sport',
    t: 'Chess — third category certificate',
    orig: 'СЕРТИФИКАТ — ВЫДАН [Лесхан Уаис] ЗА ВЫПОЛНЕНИЕ НОРМАТИВА III РАЗРЯДА В КВАЛИФИКАЦИОННОМ ТУРНИРЕ ПО ШАХМАТАМ · ГЛАВНЫЙ СУДЬЯ М. КАШЕВ · ШАХМАТНЫЙ КЛУБ «ШАХ И МАТ» · НУР-СУЛТАН 2021',
    org: 'Chess club «Шах и мат» · Nur-Sultan',
    y: 2021,
    res: '3rd category',
    status: 'confirmed',
    img: 'chess-shahimat-rank3-2021.jpg',
    note: 'Certificate for the third-category norm, judge M. Kashev, Nur-Sultan 2021.'
  },
  {
    cat: 'sport',
    t: 'Chess tournament — 1st place',
    orig: 'ГРАМОТА — НАГРАЖДАЕТСЯ [Лесхан Уаис] за занятое «I» место в шахматном турнире · Главный судья Ишмухаметов А.Р · Дата 5-12.06.2021 · г. Нур-Султан 2021г',
    org: 'Nur-Sultan',
    y: 2021,
    res: '1st place',
    status: 'confirmed',
    img: 'chess-tournament-1st-2021.jpg',
    note: 'First place in a chess tournament held 5–12 June 2021, chief judge A. Ishmukhametov.'
  },
  {
    cat: 'sport',
    t: 'Chess — fourth category norm',
    orig: 'СЕРТИФИКАТ — ВЫДАН [Лесхан Уаис] за выполнение нормы «4» разряда по шахматам · Главный судья Ишмухаметов А.Р · Дата 5-12.06.2021 · г. Нур-Султан 2021г',
    org: 'Nur-Sultan',
    y: 2021,
    res: '4th category',
    status: 'confirmed',
    img: 'chess-rank4-norm-2021.jpg',
    note: 'Certificate for the fourth-category norm from the same tournament week, 5–12 June 2021.'
  },
  {
    cat: 'sport',
    t: 'Chess — 1st place, fifth category tournament',
    orig: 'ДИПЛОМ — НАГРАЖДАЕТСЯ [Лесхан Уаис] За занятое 1-е место в квалификационном турнире на пятый разряд · Академия шахмат «Гроссмейстер»',
    org: 'Grossmeister Chess Academy',
    y: null,
    res: '1st place',
    status: 'confirmed',
    img: 'chess-grossmeister-1st-rank5.jpg',
    note: 'First place in a qualifying tournament for the fifth category, at the Grossmeister chess academy. No year printed; this is the earliest of the chess documents. The ladder ran across three organisers: Grossmeister for the fifth category, A. Ishmukhametov\'s June 2021 tournament for the fourth, and the «Shakh i Mat» club for the third and second.'
  },
  {
    cat: 'sport',
    t: 'Chess — fifth category norm',
    orig: 'СЕРТИФИКАТ — НАГРАЖДАЕТСЯ [Лесхан Уаис] За выполнение нормы пятого разряда в квалификационном турнире · Академия шахмат «Гроссмейстер»',
    org: 'Grossmeister Chess Academy',
    y: null,
    res: '5th category',
    status: 'confirmed',
    img: 'chess-grossmeister-rank5-norm.jpg',
    note: 'Certificate for the fifth-category norm, Grossmeister chess academy. No year printed.'
  },

  /* ---------- SPORT: tennis ---------- */

  {
    cat: 'sport',
    t: 'KATL tennis — 1st place, Orange Ball',
    orig: 'ДИПЛОМ — НАГРАЖДАЕТСЯ [Лесхан Уаис] за I место в одиночном разряде среди мальчиков ORANGE BALL · Дата 05.12.21 · г. Нур-Султан · KATL, Kids Amateur Tennis League',
    org: 'Kids Amateur Tennis League · Nur-Sultan',
    y: 2021,
    res: '1st place',
    status: 'confirmed',
    img: 'tennis-katl-orange-ball-1st-2021.jpg',
    note: 'First place in boys\' singles, Orange Ball category, 5 December 2021.'
  },
  {
    cat: 'sport',
    t: 'KATL tennis — 1st place, Orange Ball, second tournament',
    orig: 'ДИПЛОМ — НАГРАЖДАЕТСЯ [Лесхан Уаис] за I место в одиночном разряде среди мальчиков ORANGE BALL · Дата 09.10.202… (последняя цифра года обрезана) · г. Нур-Султан',
    org: 'Kids Amateur Tennis League · Nur-Sultan',
    y: null,
    res: '1st place',
    status: 'confirmed',
    img: 'tennis-katl-orange-ball-1st-a.jpg',
    note: 'Another first place in boys\' singles, Orange Ball. The handwritten date reads 09.10 but the year is cut off. The blank prints Nur-Sultan, the city\'s name until September 2022, and the Green Ball results start in December 2021 — so 2020 or 2021 fit the progression, while 2022 would mean dropping back a category. Left unset rather than guessed.'
  },
  {
    cat: 'sport',
    t: 'KATL tennis — 2nd place, Green Ball',
    orig: 'ДИПЛОМ — НАГРАЖДАЕТСЯ [Лесхан Уаис] за II место в одиночном разряде среди мальчиков GREEN BALL · Дата 26.12.2021 · г. Нур-Султан',
    org: 'Kids Amateur Tennis League · Nur-Sultan',
    y: 2021,
    res: '2nd place',
    status: 'confirmed',
    img: 'tennis-katl-green-ball-2nd-2021.jpg',
    note: 'Second place in boys\' singles, Green Ball category, 26 December 2021.'
  },
  {
    cat: 'sport',
    t: 'KATL tennis — 3rd place, Green Ball, February',
    orig: 'ДИПЛОМ — НАГРАЖДАЕТСЯ [Лесхан Уаис] за III место в одиночном разряде среди мальчиков GREEN BALL · Дата 27.02.2022 · г. Нур-Султан',
    org: 'Kids Amateur Tennis League · Nur-Sultan',
    y: 2022,
    res: '3rd place',
    status: 'confirmed',
    img: 'tennis-katl-green-ball-3rd-2022-02.jpg',
    note: 'Third place in boys\' singles, Green Ball category, 27 February 2022.'
  },
  {
    cat: 'sport',
    t: 'KATL tennis — 3rd place, Green Ball, April',
    orig: 'ДИПЛОМ — НАГРАЖДАЕТСЯ [Лесхан Уаис] за III место в одиночном разряде среди мальчиков GREEN BALL · Дата 10.04.2022 · г. Нур-Султан',
    org: 'Kids Amateur Tennis League · Nur-Sultan',
    y: 2022,
    res: '3rd place',
    status: 'confirmed',
    img: 'tennis-katl-green-ball-3rd-2022-04.jpg',
    note: 'Third place in boys\' singles, Green Ball category, 10 April 2022.'
  },

  /* ---------- SPORT: school competitions ---------- */

  {
    cat: 'sport',
    t: 'School athletics multi-event — 3rd place',
    orig: 'Мектепшілік көпсайыс — III орын, 163 ұпай',
    org: 'Nazarbayev Intellectual School of Physics and Mathematics, Astana',
    y: null,
    res: '3rd place',
    status: 'confirmed',
    img: 'nis-athletics-multi-event-3rd.jpg',
    note: 'Third place in the school-wide athletics multi-event with 163 points. The year is not printed on the diploma.'
  },
  {
    cat: 'sport',
    t: '«Нысана» military-patriotic contest — 2nd place',
    orig: '«Ұлдар кеңесі» жобасы аясында «Нысана» әскери-патриоттық сайыс',
    org: 'Nazarbayev Intellectual School of Physics and Mathematics, Astana',
    y: 2024,
    res: '2nd place',
    status: 'confirmed',
    img: 'nis-nysana-2nd-2024.jpg',
    note: 'Second place in a father-and-son military-patriotic contest at school, 11 December 2024. My father\'s name is masked on the scan.'
  },

  /* ---------- ARTS ---------- */

  {
    cat: 'creative',
    t: 'NIS certificate of appreciation — dormitory life',
    orig: 'CERTIFICATE OF APPRECIATION — certifies that [Лесхан Уаіс, 7 «F»] a student of Nazarbayev Intellectual School in Astana, has actively contributed to the development of creative life of the school’s dormitory and own talents · 2023-2024',
    org: 'Nazarbayev Intellectual School of Physics and Mathematics, Astana',
    y: 2024,
    res: 'certificate',
    status: 'confirmed',
    img: 'nis-appreciation-dormitory-2024.jpg',
    note: 'Awarded for the 2023–2024 school year, grade 7, for contributing to the creative life of the school dormitory and to my own talents — the paper says both, and the second half is the only written trace of the dombra playing.'
  },
  {
    cat: 'creative',
    t: 'Dombra — concert certificates',
    orig: null,
    org: null,
    y: null,
    res: null,
    status: 'approx',
    img: null,
    note: 'Three years of dombra and 5–6 concerts on school and city stages, including one large ensemble performance in a theatre. Two of those performances are documented elsewhere in this archive: the WALS 2024 conference and the NIS Science Fair. The concert certificates themselves are not in the archive yet; each should become its own entry once found.'
  },

  /* ---------- PROJECTS AND HACKATHONS ---------- */

  {
    cat: 'projects',
    t: 'NIS Hackathon — participant',
    orig: '«NIS Hackathon» байқауының мектепшілік кезеңі',
    org: 'Nazarbayev Intellectual School of Science and Mathematics, Nura district of Astana',
    y: 2025,
    res: 'participant',
    status: 'confirmed',
    img: 'nis-hackathon-participant.jpg',
    note: 'Participant in the school stage of the NIS Hackathon, open to grades 9–12. The year is not printed on the certificate; 2025 is from my own recollection — it was around the start of my 9th-grade year, and it was my first contact with AI.'
  }

];

/* ===========================================================================
   EXPERIENCE — отдельная секция, не попадает в сетку грамот.
   То, что реально было, но бумагой не подтверждается.
   =========================================================================== */

const EXPERIENCE = [
  {
    t: 'Nazarbayev Intellectual School — admission',
    period: 'ongoing',
    note: 'Admitted to the Nazarbayev Intellectual School of Physics and Mathematics in Astana. The only paper I have for it is the welcome letter every admitted student receives: it carries no name and no date, so it is not evidence of anything personal and it is not in the awards grid. The earliest dated proof that I was studying there is the dormitory letter of appreciation for 2023–2024, grade 7.'
  },
  {
    t: 'Deliox — founder',
    period: 'ongoing',
    note: 'An AI trainer for cold sales calls. Product idea, frontend and landing page. A team of three: development, backend, marketing.'
  },
  {
    t: 'QozGal — a transit service for Astana',
    period: 'ongoing',
    note: 'A Telegram bot that makes public transport in Astana easier to track: it picks the right bus and tells you when to get off. A bot for now. Roughly 50–60% done. The blocker is access to real-time bus movement data.'
  },
  {
    t: 'Sabaqtas — Future Minds Hackathon 2026',
    period: 'one hackathon, 2026',
    note: 'A project for the Social Impact track of the Future Minds Hackathon 2026. The hackathon certificate was issued to the team and not in my name, so there is no personal document behind it and it is not in the awards grid.'
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
