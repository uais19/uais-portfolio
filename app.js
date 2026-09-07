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
})();
