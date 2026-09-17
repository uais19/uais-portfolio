/* ============================================================================
   app.js — behaviour shared by index.html and ru.html

   Ported from design-preview.html, in six parts:
     1. the burger toggle
     2. closing the drawer when a link inside it is clicked
     3. the scrollspy that highlights the tab for the section you are looking at
     4. the awards grid: cards, category chips, year and status filters
     5. the lightbox that opens when a card is clicked
     6. the experience list, built from the EXPERIENCE array

   The scroll-reveal animations live in the prototype and arrive in a later step.
   ========================================================================= */

/* ----------------------------------------------------------------------------
   LESSON 22 — THE IIFE, AND WHY WE WRAP EVERYTHING IN ONE

   This whole file is wrapped in  (function(){ ... })();
   That is an IIFE: an Immediately Invoked Function Expression. It defines a
   function and calls it straight away.

   Why bother? Because any variable declared with var/let/const at the TOP level
   of a script becomes a global - shared with every other script on the page.
   Two scripts that both use a variable named "links" would silently overwrite
   each other. Wrapping the code in a function gives it its own private scope,
   so nothing leaks out.

   You will see this pattern constantly in older JavaScript.
-------------------------------------------------------------------------- */
(function () {
  'use strict';

  /* --------------------------------------------------------------------------
     1. BURGER TOGGLE

     LESSON 23 — addEventListener

     addEventListener(type, callback) says "when this thing happens to this
     element, run this function". The browser calls the function for you; you
     never call it yourself. This is called event-driven programming.

     classList.toggle('open') adds the class if it is missing and removes it if
     it is present, and RETURNS true/false telling you which it did. We use that
     return value to keep aria-expanded truthful.

     Note what this code does NOT do: it sets no colours, no positions, no
     animation. All of that is in style.css, reacting to the .open class and to
     aria-expanded. JavaScript flips a switch; CSS decides what the switch looks
     like. Keeping that separation is the single most useful habit in front-end
     work.
  -------------------------------------------------------------------------- */
  var burger = document.getElementById('burger');
  var drawer = document.getElementById('drawer');

  function closeDrawer() {
    drawer.classList.remove('open');
    burger.setAttribute('aria-expanded', 'false');
  }

  burger.addEventListener('click', function () {
    var open = drawer.classList.toggle('open');
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
  });

  /* --------------------------------------------------------------------------
     2. DRAWER LINK HANDLER

     Without this, tapping a link in the mobile menu would scroll the page to
     the section but leave the menu covering it. So every link inside the drawer
     closes the drawer on click.
  -------------------------------------------------------------------------- */
  drawer.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', closeDrawer);
  });

  /* --------------------------------------------------------------------------
     3. SCROLLSPY — highlight the tab for the section currently on screen

     LESSON 24 — HOW A SCROLLSPY WORKS

     Draw an imaginary horizontal line 120px below the top of the window
     (just under the sticky header). Walk down the list of sections in document
     order and remember the last one whose top edge is ABOVE that line. That is
     the section you are currently reading.

     window.scrollY   how far down the page has been scrolled, in pixels
     s.offsetTop      distance from the top of the document to this element

     {passive:true} on the scroll listener is a performance promise to the
     browser: "this handler will never call preventDefault()". That lets the
     browser scroll immediately instead of waiting to see whether our code
     cancels the scroll. On a phone the difference is visible.

     spy() is also called once at the end, so the correct tab is highlighted on
     load rather than only after the first scroll.

     LESSON 27 — THE LAST-SECTION PROBLEM

     The rule above has a blind spot. You can only scroll until the BOTTOM of
     the document reaches the bottom of the window - after that, scrolling stops.
     If the final section starts less than one screen-height from the end of the
     page, the imaginary line never reaches it, and its tab can never light up.

     Measured on this page before the fix: #contact started at 1422px, but the
     furthest you could scroll was 1035px, putting the line at 1155px. 267px
     short, permanently.

     The fix is a special case: if the page is scrolled to the bottom, the last
     section is by definition the one you are looking at, so activate it and skip
     the normal calculation.

       scrollY + innerHeight     the position of the bottom edge of the window
       documentElement.scrollHeight   the full height of the document

     When those two are equal you are at the bottom. They are compared with a
     2px tolerance because both can be fractional on high-DPI screens and on
     zoomed pages, so an exact === would sometimes silently fail.
  -------------------------------------------------------------------------- */
  var links = [].slice.call(document.querySelectorAll('.tabs a, .drawer a'));

  /* NOTE — .filter(Boolean) is a deliberate addition, not in the prototype.
     getElementById returns null for a section that does not exist yet. The
     prototype could assume all four were present; this page does not have
     #awards until a later step, so without this filter the list would contain
     null and s.offsetTop would throw "Cannot read properties of null" on every
     single scroll event. Boolean as the filter callback drops null entries. */
  var secs = ['about', 'awards', 'projects', 'experience', 'contact']
    .map(function (id) { return document.getElementById(id); })
    .filter(Boolean);

  /* --------------------------------------------------------------------------
     LESSON 39 — AN EXPLICIT CLICK OUTRANKS A GUESS

     spy() is a GUESS about what you are reading, made from the scroll
     position. A click on a tab is not a guess: it names the section you want.
     The two used to disagree. Clicking Projects scrolled as far as the page
     would go - the very bottom - and the bottom-of-page rule from LESSON 27
     promptly decided you were reading Contact. You asked for Projects, and the
     header told you Contact.

     So a clicked tab is PINNED. While a pin is set, spy() shows the pinned
     tab and does no guessing. The pin lasts until you move the page yourself -
     a wheel turn, a press, a key - because that is when a guess starts to mean
     something again.

     Why not simply drop the pin on the next scroll event? Because the click
     CAUSES one: jumping to #projects fires a scroll event a moment later, and
     "unpin on scroll" would throw the pin away before it had done its job.

     And why pointerdown rather than click for unpinning? It fires first. Press
     a tab: pointerdown clears the old pin, then click sets the new one - in
     that order, every time. Press the logo, the scrollbar or a card, and the
     pin is simply cleared.
  -------------------------------------------------------------------------- */
  var pinned = null;

  function highlight(id) {
    links.forEach(function (a) {
      a.classList.toggle('is-active', a.getAttribute('href') === '#' + id);
    });
  }

  function spy() {
    if (pinned) {
      highlight(pinned);
      return;
    }

    var cur = null;

    var atBottom = window.scrollY + window.innerHeight >=
                   document.documentElement.scrollHeight - 2;

    if (atBottom && secs.length) {
      cur = secs[secs.length - 1].id;
    } else {
      var line = window.scrollY + 120;
      secs.forEach(function (s) {
        if (s.offsetTop <= line) cur = s.id;
      });
    }

    highlight(cur);
  }

  links.forEach(function (a) {
    a.addEventListener('click', function () {
      pinned = a.getAttribute('href').slice(1);
      highlight(pinned);
    });
  });

  ['wheel', 'pointerdown', 'keydown'].forEach(function (type) {
    window.addEventListener(type, function () { pinned = null; }, { passive: true });
  });

  window.addEventListener('scroll', spy, { passive: true });
  spy();

  /* ==========================================================================
     4. THE AWARDS GRID

     Everything below builds the #awards section from the ACHIEVEMENTS array in
     data.js. No award markup exists in the HTML at all.
     ====================================================================== */

  /* --------------------------------------------------------------------------
     LESSON 30 — TWO KINDS OF TEXT ON ONE PAGE

     There is a language rule here that is worth stating clearly, because it
     looks inconsistent until you know the reason:

       UI text   (chip labels, "All years", "showing 3 of 14")
                 follows the page. Russian on ru.html, English on index.html.

       ENTRY text (an award's title, organiser, result, note)
                 is ENGLISH ON BOTH PAGES.

     Why the difference? Half the certificates are printed in Russian or Kazakh.
     Translating them once, into data.js, means the wording is settled and can be
     pasted straight into an application. Translating them twice - once per page
     - would mean two versions of the same claim slowly drifting apart, and this
     archive has to survive the question "show me the document".

     data.js keeps the original printed wording in an "orig" field for exactly
     that reason. It is not rendered on the card; it belongs in the lightbox,
     next to the scan.

     So: UI strings are looked up by language below. Entry fields are not.
  -------------------------------------------------------------------------- */
  var LANG = document.documentElement.lang === 'ru' ? 'ru' : 'en';

  var UI = {
    ru: {
      all: 'Все',
      allYears: 'Все годы',
      noYear: 'год уточняется',
      cats: { study: 'Учёба', sport: 'Спорт', creative: 'Творчество', projects: 'Проекты' },
      shown: function (n, total) { return 'показано ' + n + ' из ' + total; },
      empty: 'В этом срезе пока пусто — попробуйте другой год или категорию.',
      noYearShort: '—',
      verifiedOnly: 'Только подтверждённые',
      statusApprox: 'приблизительно',
      statusCheck: 'нужно подтвердить'
    },
    en: {
      all: 'All',
      allYears: 'All years',
      noYear: 'year to confirm',
      cats: { study: 'Studies', sport: 'Sport', creative: 'Arts', projects: 'Projects' },
      shown: function (n, total) { return 'showing ' + n + ' of ' + total; },
      empty: 'Nothing in this slice yet — try another year or category.',
      noYearShort: '—',
      verifiedOnly: 'Verified only',
      statusApprox: 'approximate',
      statusCheck: 'to confirm'
    }
  }[LANG];

  /* The four categories, in the order the chips should appear. Fixed on
     purpose: reading them off the data would let the order change whenever an
     entry is added or removed. */
  var CAT_ORDER = ['study', 'sport', 'creative', 'projects'];

  var grid = document.getElementById('grid');
  var filters = document.getElementById('filters');
  var shownEl = document.getElementById('shown');

  /* If data.js failed to load, ACHIEVEMENTS is undefined. Bail out quietly
     rather than throwing and taking the burger and the scrollspy down with it -
     one broken feature is better than a dead page. */
  if (grid && filters && typeof ACHIEVEMENTS !== 'undefined') {
    initAwards(ACHIEVEMENTS);
  }

  function initAwards(items) {

    /* ---- hero counters -------------------------------------------------
       Computed, not hardcoded. distinctCats counts how many of the four
       categories actually appear in the data, so removing every entry of one
       category correctly drops this to 3. */
    var distinctCats = items
      .map(function (i) { return i.cat; })
      .filter(function (v, idx, arr) { return arr.indexOf(v) === idx; })
      .length;

    setText(document.getElementById('cnt'), items.length);
    setText(document.getElementById('catCount'), distinctCats);

    /* ---- state ---------------------------------------------------------
       The three filters are just three variables. Every change writes here and
       then calls render(), which rebuilds the grid from scratch. Rebuilding
       everything is wasteful in theory and completely fine at 14 entries; it
       is also far easier to reason about than patching the DOM in place.

       Keeping all three in ONE object is what makes them combine instead of
       overriding each other: matches() reads all three every time, so no
       filter has to know that the others exist. */
    var state = { cat: 'all', year: 'all', verifiedOnly: false };

    /* ---- chips ---------------------------------------------------------
       One chip per category plus "All", each showing how many entries it
       holds. Counts come from the data, so they can never disagree with the
       grid. */
    var counts = { all: items.length };
    items.forEach(function (i) { counts[i.cat] = (counts[i.cat] || 0) + 1; });

    function chip(key, label) {
      var b = document.createElement('button');
      b.className = 'chip' + (key === state.cat ? ' on' : '');
      b.type = 'button';
      b.dataset.cat = key;
      b.textContent = label;

      var n = document.createElement('span');
      n.className = 'n';
      n.textContent = counts[key] || 0;
      b.appendChild(n);

      b.addEventListener('click', function () {
        state.cat = key;
        /* Scoped to [data-cat] on purpose. The "verified only" toggle below is
           also a .chip, and a bare '.chip' selector here would strip its active
           styling on every category click while state.verifiedOnly stayed true
           - the button would lie about what the grid is showing. */
        filters.querySelectorAll('.chip[data-cat]').forEach(function (c) {
          c.classList.toggle('on', c.dataset.cat === key);
        });
        render();
      });
      return b;
    }

    filters.appendChild(chip('all', UI.all));
    CAT_ORDER.forEach(function (k) { filters.appendChild(chip(k, UI.cats[k])); });

    /* ---- "verified only" toggle ----------------------------------------
       LESSON 33 — aria-pressed, AND WHAT MAKES A BUTTON A TOGGLE

       This looks like the chips next to it, but it is a different kind of
       control. A chip is one choice out of several - press another and this one
       lets go. This button has its own independent on/off state.

       aria-pressed is how you say that in HTML. A screen reader announces
       "Verified only, toggle button, pressed" or "not pressed". Without it, a
       blind user hears only "Verified only, button" and has no way to know
       whether the filter is currently on.

       Compare with aria-expanded on the burger (LESSON 20): expanded describes
       something ELSE that this button opens; pressed describes THIS button's
       own state. Using the wrong one is a common mistake.

       Note it carries no data-cat attribute. That is what keeps the category
       chip handler above from touching it, and it is why the CSS matches it on
       [aria-pressed="true"] rather than on the .on class the chips use.
    */
    var verifyBtn = document.createElement('button');
    verifyBtn.className = 'chip';
    verifyBtn.type = 'button';
    verifyBtn.textContent = UI.verifiedOnly;
    verifyBtn.setAttribute('aria-pressed', 'false');
    verifyBtn.addEventListener('click', function () {
      state.verifiedOnly = !state.verifiedOnly;
      verifyBtn.setAttribute('aria-pressed', state.verifiedOnly ? 'true' : 'false');
      render();
    });
    filters.appendChild(verifyBtn);

    /* ---- year select ---------------------------------------------------
       LESSON 31 — null IS A VALUE, NOT AN ABSENCE

       12 of the 14 entries have y: null, because the year is not confirmed yet.
       The naive version of this select does:

         items.map(i => i.y).filter(unique).sort()

       and produces an option literally labelled "null", which then sorts
       somewhere random because null compared with a number is neither greater
       nor smaller.

       Worse, filtering with String(i.y) === selectedValue would make those 12
       entries reachable ONLY through that broken option - and if you dropped
       null instead, 12 of 14 entries would silently vanish from the archive.

       So null is handled as its own case:
         - real years are collected, deduplicated and sorted newest first
         - if any entry has no year, one extra option is added at the END,
           with the value 'none' and a readable label
         - 'all' still means all, nulls included
    */
    var years = items
      .map(function (i) { return i.y; })
      .filter(function (y) { return y !== null && y !== undefined; })
      .filter(function (v, idx, arr) { return arr.indexOf(v) === idx; })
      .sort(function (a, b) { return b - a; });

    var hasUndated = items.some(function (i) { return i.y === null || i.y === undefined; });

    var sel = document.createElement('select');
    sel.className = 'year-sel';
    sel.appendChild(option('all', UI.allYears));
    years.forEach(function (y) { sel.appendChild(option(String(y), String(y))); });
    if (hasUndated) sel.appendChild(option('none', UI.noYear));

    sel.addEventListener('change', function () {
      state.year = sel.value;
      render();
    });
    filters.appendChild(sel);

    function option(value, label) {
      var o = document.createElement('option');
      o.value = value;
      o.textContent = label;
      return o;
    }

    /* ---- filtering ------------------------------------------------------ */
    function matches(i) {
      var catOk = state.cat === 'all' || i.cat === state.cat;

      var yearOk;
      if (state.year === 'all') {
        yearOk = true;
      } else if (state.year === 'none') {
        yearOk = (i.y === null || i.y === undefined);
      } else {
        yearOk = String(i.y) === state.year;
      }

      var statusOk = !state.verifiedOnly || i.status === 'confirmed';

      /* All three joined with AND, so they narrow the result together rather
         than one winning. "Sport" + "year to confirm" + "verified only" asks
         for entries that are all three at once. */
      return catOk && yearOk && statusOk;
    }

    /* ---- where a scan lives ---------------------------------------------
       LESSON 31b — DERIVING A PATH INSTEAD OF STORING IT

       data.js stores only the BARE FILENAME: img: 'daryn-2026.jpg'. The two
       folders it can be found in are built here:

           images/thumbs/daryn-2026.jpg    400 px, drawn on the card
           images/full/daryn-2026.jpg     1200 px, opened in the lightbox

       Both files are produced from one original by tools/make-images.mjs.

       The alternative - writing the full path into data.js - would mean
       storing the same filename twice, once per size, and every card would
       have to be edited by hand if the folders were ever renamed. One fact,
       one place: the same "single source of truth" rule that keeps the card
       text out of the HTML.
    */
    function imgSrc(size, file) {
      return 'images/' + size + '/' + file;
    }

    /* ---- one card -------------------------------------------------------
       LESSON 32 — WHY THIS BUILDS NODES INSTEAD OF PASTING HTML STRINGS

       The prototype built each card with innerHTML and string concatenation.
       That is shorter, and it has a real bug waiting in it: the moment a title
       contains a < or an & - or an apostrophe in the wrong place - the browser
       parses it as markup and the card breaks. With text from an outside source
       it is worse than a broken card: text containing a <script> tag would RUN.
       That vulnerability is called XSS, cross-site scripting.

       createElement + textContent cannot have that problem, because textContent
       never parses anything as HTML. The output markup is identical.

       This card is a <button>, as in the prototype. Until the lightbox existed
       it was an <article>, because a button that does nothing is a promise the
       page does not keep. Now it opens the entry (section 5 below), and a real
       <button> brings keyboard support for free: Tab reaches it, Enter and
       Space press it, and a screen reader announces it as a button. A <div>
       with a click handler would have none of that.

       One honest caveat, now a smaller one. The title below is a <span
       class="card-title">, not an <h3>, because a heading inside a <button>
       is folded into the button's accessible name instead of being announced
       as a heading. With 35 cards that hid the whole awards grid from heading
       navigation, which is how a screen-reader user skims a page.

       What is still not right: .thumb and .card-body are <div> elements, and
       a <button> may only contain phrasing content, so the markup still does
       not fully validate. Every browser renders it correctly. Replacing those
       two wrappers is a separate step.
    */
    function renderCard(item) {
      var card = document.createElement('button');
      card.type = 'button';
      card.className = 'card';

      /* -- thumbnail -- */
      var thumb = document.createElement('div');
      thumb.className = 'thumb';

      var tag = document.createElement('span');
      tag.className = 'thumb-tag';
      tag.textContent = UI.cats[item.cat] || item.cat;
      thumb.appendChild(tag);

      /* res may be null - then no badge at all, rather than an empty orange
         rectangle sitting in the corner of the card. */
      if (item.res) {
        var place = document.createElement('span');
        place.className = 'place';
        place.textContent = item.res;
        thumb.appendChild(place);
      }

      if (item.img) {
        /* A real scan. .has-img switches off the CSS paper drawing in
           style.css; the 4/3 aspect-ratio on .thumb is what keeps this card
           exactly as tall as a placeholder one.

           The card gets the 400 px copy. The 1200 px one - imgSrc('full', ...)
           - is not downloaded until the lightbox opens this entry. */
        thumb.classList.add('has-img');
        var img = document.createElement('img');
        img.src = imgSrc('thumbs', item.img);
        img.alt = item.t;          /* the title describes the scan */
        img.loading = 'lazy';
        thumb.appendChild(img);
      } else {
        /* No scan yet: the prototype's CSS "paper" placeholder. The <i> draws
           the three ruled lines; the seal and the border come from ::before
           and ::after in style.css. */
        thumb.appendChild(document.createElement('i'));
      }

      card.appendChild(thumb);

      /* -- body -- */
      var body = document.createElement('div');
      body.className = 'card-body';

      var title = document.createElement('span');
      title.className = 'card-title';
      title.textContent = item.t;
      body.appendChild(title);

      var meta = document.createElement('div');
      meta.className = 'card-meta';

      var yr = document.createElement('span');
      yr.className = 'yr';
      yr.textContent = (item.y === null || item.y === undefined) ? UI.noYearShort : item.y;
      meta.appendChild(yr);

      /* org is null on 12 of the 14 entries. Skip the span entirely rather
         than rendering an empty one, which would still add a gap. */
      if (item.org) {
        var org = document.createElement('span');
        org.textContent = item.org;
        meta.appendChild(org);
      }

      /* -- status --------------------------------------------------------
         LESSON 34 — THE DEFAULT STATE GETS NO BADGE

         Three statuses, but only two of them draw anything:

           confirmed  nothing at all
           approx     a quiet label, "approximate"
           check      the same label, "to confirm", plus a dashed card border

         'confirmed' is silent on purpose. It is what every entry should
         eventually be, and a badge repeated on fifty cards stops being
         information and becomes wallpaper - the eye filters it out, and then it
         fails to register on the cards where it matters. Marking the exception
         rather than the rule is a general interface principle worth keeping.

         The dashed border is a SECOND channel for 'check', not a decoration.
         It is readable at a glance while scrolling, before you have read any
         label - which is what you want from "this one still needs a document".

         The label goes in the meta row, with the year and organiser, because
         that is what it is: a fact about the record. Putting it on the
         thumbnail would make it look like part of the certificate, and putting
         it in the title would make it part of the award's name. */
      if (item.status === 'approx' || item.status === 'check') {
        var flag = document.createElement('span');
        flag.className = 'flag';
        flag.textContent = item.status === 'approx' ? UI.statusApprox : UI.statusCheck;
        meta.appendChild(flag);
      }

      if (item.status === 'check') card.classList.add('is-check');

      body.appendChild(meta);
      card.appendChild(body);

      /* orig is NOT rendered on the card. It appears in the lightbox only,
         under the note - see fillLb() below. */

      return card;
    }

    /* ---- the grid ------------------------------------------------------- */

    /* The entries the grid is showing right now, in grid order. The lightbox
       arrows walk THIS list, never items - that is the whole mechanism that
       keeps them inside the active filter. Filter to Sport and this holds
       three entries, so the arrows can only ever reach those three. */
    var shownList = [];

    function render() {
      var list = items.filter(matches);
      shownList = list;

      grid.textContent = '';   /* clear; faster and safer than innerHTML = '' */

      if (!list.length) {
        var e = document.createElement('div');
        e.className = 'empty';
        e.textContent = UI.empty;
        grid.appendChild(e);
      } else {
        list.forEach(function (item, idx) {
          var card = renderCard(item);
          /* The card passes ITSELF along, so the lightbox knows where to send
             focus back on close. Reading document.activeElement instead would
             fail in Safari, which does not focus a button when it is clicked. */
          card.addEventListener('click', function () { openLb(idx, card); });
          grid.appendChild(card);
        });
      }

      setText(shownEl, UI.shown(list.length, items.length));
    }

    /* ==========================================================================
       5. THE LIGHTBOX

       The markup is one empty dialog at the end of index.html and ru.html -
       LESSON 35 there explains its three ARIA attributes. The code below fills
       it from an entry and makes it behave like a real modal window.
       ====================================================================== */
    var lb = document.getElementById('lb');
    var lbEl = lb ? {
      sheet:    document.getElementById('lbSheet'),
      title:    document.getElementById('lbTitle'),
      meta:     document.getElementById('lbMeta'),
      res:      document.getElementById('lbRes'),
      note:     document.getElementById('lbNote'),
      orig:     document.getElementById('lbOrig'),
      origText: document.getElementById('lbOrigText'),
      flag:     document.getElementById('lbFlag'),
      prev:     document.getElementById('lbPrev'),
      next:     document.getElementById('lbNext'),
      count:    document.getElementById('lbCount'),
      close:    document.getElementById('lbClose')
    } : null;

    var lbIndex = 0;       /* position of the open entry inside shownList */
    var lbOpener = null;   /* the card that opened the dialog               */
    var lbInert = [];      /* page regions switched off while it is open    */
    var lockedY = 0;       /* scroll position to put back on close          */

    /* ---- filling it ------------------------------------------------------
       Every optional field HIDES its slot when it is null, instead of leaving
       an empty element behind. The spacing in style.css is flex gap, and a
       hidden element takes no part in gap, so nothing leaves a hole. */
    function fillLb(item) {
      /* A fresh <img> per entry rather than swapping src on one element.
         Swapping can leave the PREVIOUS certificate on screen, under the new
         title, until the next file has finished downloading. */
      lbEl.sheet.textContent = '';
      lbEl.sheet.classList.toggle('has-img', !!item.img);
      if (item.img) {
        var img = document.createElement('img');
        img.src = imgSrc('full', item.img);
        img.alt = item.t;          /* the title describes the scan, as on the card */
        lbEl.sheet.appendChild(img);
      }

      lbEl.title.textContent = item.t;

      /* Category, year, organiser - but only the ones that exist. Joining the
         survivors means a missing year can never leave "Studies ·  · " with a
         separator standing next to nothing. */
      lbEl.meta.textContent = [UI.cats[item.cat] || item.cat, item.y, item.org]
        .filter(function (v) { return v !== null && v !== undefined && v !== ''; })
        .join(' · ');

      fillOrHide(lbEl.res, item.res);
      fillOrHide(lbEl.note, item.note);

      /* orig - the wording printed on the paper. This is the ONLY place it is
         ever rendered. The whole <figure> goes when orig is null, caption and
         all: a label announcing a quotation over no quotation would be a claim
         the page cannot back. */
      lbEl.origText.textContent = item.orig || '';
      lbEl.orig.hidden = !item.orig;

      /* Status flag: same words as the card, and the same rule - confirmed
         says nothing (LESSON 34). */
      var flag = item.status === 'approx' ? UI.statusApprox
               : item.status === 'check'  ? UI.statusCheck
               : null;
      fillOrHide(lbEl.flag, flag);
      lbEl.flag.classList.toggle('is-check', item.status === 'check');
    }

    function fillOrHide(el, value) {
      el.textContent = value || '';
      el.hidden = !value;
    }

    /* ---- moving between entries ------------------------------------------
       The arrows STOP at the ends instead of wrapping around. In a filtered
       set of three, wrapping makes it impossible to tell that you have seen
       them all; stopping makes it obvious twice over - the dead arrow dims,
       and the counter reads 3 / 3. A set of one disables both.

       Disabling a button that has focus throws that focus out to <body>,
       which is OUTSIDE the dialog. So note what was focused first, and if it
       has just been disabled, hand focus to the other arrow - or to Close,
       when both are dead. */
    function showLb(index) {
      lbIndex = Math.max(0, Math.min(index, shownList.length - 1));
      fillLb(shownList[lbIndex]);
      lbEl.count.textContent = (lbIndex + 1) + ' / ' + shownList.length;

      var focused = document.activeElement;
      lbEl.prev.disabled = lbIndex === 0;
      lbEl.next.disabled = lbIndex === shownList.length - 1;

      if ((focused === lbEl.prev || focused === lbEl.next) && focused.disabled) {
        var other = focused === lbEl.prev ? lbEl.next : lbEl.prev;
        (other.disabled ? lbEl.close : other).focus();
      }
    }

    /* ---- opening and closing ---------------------------------------------
       LESSON 36 — WHERE FOCUS GOES, AND WHY IT MUST COME BACK

       Keyboard and screen-reader users have exactly one position on the page:
       the focused element. Open a dialog without moving focus and they are
       still standing on the card, BEHIND the dialog, pressing Tab through a
       page they cannot see. So:

         on open    focus moves to the Close button, inside the dialog
         on close   focus returns to the card that opened it

       Skip the return and focus drops to <body>: the next Tab starts over at
       the logo, and someone halfway down the grid has lost their place.

       inert is the other half. An inert element cannot be focused, clicked or
       read by a screen reader. Setting it on everything outside the dialog is
       what makes aria-modal="true" actually true - some screen readers ignore
       aria-modal and would otherwise wander into the page behind.
    */
    function openLb(index, opener) {
      if (!lb || !shownList.length) return;
      lbOpener = opener;

      showLb(index);
      lockScroll();
      lb.classList.add('open');

      lbInert = [].slice.call(document.body.children).filter(function (el) {
        return el !== lb && el.tagName !== 'SCRIPT' && !el.inert;
      });
      lbInert.forEach(function (el) { el.inert = true; });

      lbEl.close.focus();
    }

    function closeLb() {
      if (!lb.classList.contains('open')) return;

      lb.classList.remove('open');
      lbInert.forEach(function (el) { el.inert = false; });
      lbInert = [];
      unlockScroll();

      /* preventScroll, because unlockScroll() has just put the page back
         exactly where it was, and focus() is otherwise allowed to scroll. */
      if (lbOpener && document.contains(lbOpener)) {
        lbOpener.focus({ preventScroll: true });
      }
      lbOpener = null;
    }

    /* ---- the scroll lock -------------------------------------------------
       LESSON 37 — WHY overflow:hidden IS NOT ENOUGH

       The obvious lock is body { overflow:hidden }. On a desktop it works. On
       iOS Safari a finger drag scrolls the page behind anyway, so the page
       slides around under the dialog - the classic phone lightbox bug.

       What works everywhere is taking the page out of scrolling altogether:
       make <body> position:fixed. A fixed body snaps to the top of the page,
       though, so it is ALSO shifted up by the current scroll offset
       (top: -scrollY) to stay visually where it was - and on close the window
       is scrolled back to that same offset.

       padding-right stands in for the scrollbar, which vanishes once nothing
       can scroll. Without it the whole page jumps sideways by the scrollbar's
       width - about 15px on Windows - every time the dialog opens.

       JavaScript only measures and flips the class; the body.lb-locked rule in
       style.css does the positioning (LESSON 23).
    */
    function lockScroll() {
      lockedY = window.scrollY;
      var gap = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.setProperty('--lock-top', -lockedY + 'px');
      document.body.style.setProperty('--lock-gap', gap + 'px');
      document.body.classList.add('lb-locked');
    }

    function unlockScroll() {
      document.body.classList.remove('lb-locked');
      document.body.style.removeProperty('--lock-top');
      document.body.style.removeProperty('--lock-gap');
      window.scrollTo(0, lockedY);
    }

    /* Keep Tab inside the dialog. Only the two EDGES need handling: Tab on the
       last control wraps to the first, Shift+Tab on the first wraps to the
       last. Everything in between is the browser's normal Tab order. The
       "not inside" case pulls focus back in if it has somehow got out. */
    function trapTab(e) {
      var stops = [].slice.call(lb.querySelectorAll(
        'button:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])'
      ));
      if (!stops.length) return;

      var first = stops[0];
      var last = stops[stops.length - 1];
      var active = document.activeElement;
      var inside = lb.contains(active);

      if (e.shiftKey && (active === first || !inside)) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && (active === last || !inside)) {
        e.preventDefault();
        first.focus();
      }
    }

    /* ---- wiring ----------------------------------------------------------
       LESSON 38 — A BACKDROP CLICK THAT IS REALLY A BACKDROP CLICK

       "Close when the backdrop is clicked" is e.target === lb: the click
       landed on the dark overlay itself, not on anything inside the card.

       That test has a trap in it. Press the mouse inside the card to select a
       sentence of the note, drag past the card's edge, let go over the
       backdrop - and the browser fires the click on the nearest element that
       contains BOTH ends, which is the overlay. The dialog would close in the
       middle of selecting text. So the press has to start on the backdrop
       too.
    */
    if (lb) {
      lbEl.close.addEventListener('click', closeLb);
      lbEl.prev.addEventListener('click', function () { showLb(lbIndex - 1); });
      lbEl.next.addEventListener('click', function () { showLb(lbIndex + 1); });

      var pressedOnBackdrop = false;
      lb.addEventListener('pointerdown', function (e) {
        pressedOnBackdrop = e.target === lb;
      });
      lb.addEventListener('click', function (e) {
        if (e.target === lb && pressedOnBackdrop) closeLb();
      });

      document.addEventListener('keydown', function (e) {
        if (!lb.classList.contains('open')) return;

        if (e.key === 'Escape') {
          e.preventDefault();
          closeLb();
        } else if (e.key === 'ArrowLeft') {
          e.preventDefault();
          if (lbIndex > 0) showLb(lbIndex - 1);
        } else if (e.key === 'ArrowRight') {
          e.preventDefault();
          if (lbIndex < shownList.length - 1) showLb(lbIndex + 1);
        } else if (e.key === 'Tab') {
          trapTab(e);
        }
      });
    }

    render();
  }

  /* ==========================================================================
     6. EXPERIENCE

     LESSON 40 — LET THE PAGE SAY WHAT IS ALREADY SHOWN

     EXPERIENCE in data.js includes Deliox and QozGal, and both already have a
     card in #projects. Listing them here too would show the same thing twice,
     once as a project and once as experience.

     The obvious fix is a hardcoded skip list: ['Deliox', 'QozGal']. It works
     today, and it quietly goes wrong the day a fourth project card is added
     to the HTML and nobody remembers that the list exists.

     So the skip list is READ FROM THE PAGE instead. The <h3> titles of the
     project cards ARE the list of what #projects already shows. An EXPERIENCE
     entry is skipped when the part of its title before " — " matches one:

       'Deliox — founder'                    -> 'Deliox'    in #projects, skip
       'QozGal — a transit service for ...'  -> 'QozGal'    in #projects, skip
       'Football'                            -> 'Football'  not there, show

     One fact - "this is shown as a project" - lives in one place, the HTML,
     and this list follows it.
     ====================================================================== */
  var expList = document.getElementById('expList');

  if (expList && typeof EXPERIENCE !== 'undefined') {
    initExperience(EXPERIENCE);
  }

  function initExperience(entries) {
    var shownAsProjects = [].map.call(
      document.querySelectorAll('#projects .proj h3'),
      function (h) { return h.textContent.trim(); }
    );

    var list = entries.filter(function (e) {
      return shownAsProjects.indexOf(e.t.split(' — ')[0].trim()) === -1;
    });

    list.forEach(function (e) {
      var li = document.createElement('li');
      li.className = 'exp';

      var h3 = document.createElement('h3');
      h3.textContent = e.t;
      li.appendChild(h3);

      /* Same null rule as the award cards: a missing field adds no element. */
      if (e.period) {
        var period = document.createElement('span');
        period.className = 'period';
        period.textContent = e.period;
        li.appendChild(period);
      }

      if (e.note) {
        var p = document.createElement('p');
        p.textContent = e.note;
        li.appendChild(p);
      }

      expList.appendChild(li);
    });

    setText(document.getElementById('expCount'), list.length);
  }

  /* Small helper: write text into an element only if the element exists, so a
     missing id in one of the two HTML files cannot throw. */
  function setText(el, value) {
    if (el) el.textContent = value;
  }
})();
