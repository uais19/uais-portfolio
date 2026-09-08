/* ============================================================================
   app.js — behaviour shared by index.html and ru.html

   Ported from design-preview.html. Only three pieces are here so far:
     1. the burger toggle
     2. closing the drawer when a link inside it is clicked
     3. the scrollspy that highlights the tab for the section you are looking at

   The lightbox, the category filters and the scroll-reveal animations live in
   the prototype and arrive in later steps.
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
  var secs = ['about', 'awards', 'projects', 'contact']
    .map(function (id) { return document.getElementById(id); })
    .filter(Boolean);

  function spy() {
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

    links.forEach(function (a) {
      a.classList.toggle('is-active', a.getAttribute('href') === '#' + cur);
    });
  }

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

       This card is an <article>, not a <button> as in the prototype. Nothing
       happens when you click it yet; a button that does nothing is a promise
       the page does not keep. It becomes interactive in the lightbox step.
    */
    function renderCard(item) {
      var card = document.createElement('article');
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
           exactly as tall as a placeholder one. */
        thumb.classList.add('has-img');
        var img = document.createElement('img');
        img.src = item.img;
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

      var h3 = document.createElement('h3');
      h3.textContent = item.t;
      body.appendChild(h3);

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

      /* orig is still NOT rendered here - it belongs in the lightbox, next to
         the scan it lets you verify. */

      return card;
    }

    /* ---- the grid ------------------------------------------------------- */
    function render() {
      var list = items.filter(matches);

      grid.textContent = '';   /* clear; faster and safer than innerHTML = '' */

      if (!list.length) {
        var e = document.createElement('div');
        e.className = 'empty';
        e.textContent = UI.empty;
        grid.appendChild(e);
      } else {
        list.forEach(function (item) { grid.appendChild(renderCard(item)); });
      }

      setText(shownEl, UI.shown(list.length, items.length));
    }

    render();
  }

  /* Small helper: write text into an element only if the element exists, so a
     missing id in one of the two HTML files cannot throw. */
  function setText(el, value) {
    if (el) el.textContent = value;
  }
})();
