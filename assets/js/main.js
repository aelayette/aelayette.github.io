/* main.js – Portfolio site interactive behaviour */
(function () {
  'use strict';

  /* ── Mobile nav toggle ── */
  const toggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (toggle && navLinks) {
    toggle.addEventListener('click', function () {
      const isOpen = navLinks.classList.toggle('open');
      toggle.setAttribute('aria-expanded', isOpen);
    });

    /* Close on outside click */
    document.addEventListener('click', function (e) {
      if (!toggle.contains(e.target) && !navLinks.contains(e.target)) {
        navLinks.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });

    /* Close on nav-link click (mobile) */
    navLinks.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        navLinks.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ── Mark active nav link by current path ── */
  (function markActiveLink() {
    const path = window.location.pathname.replace(/\/$/, '') || '/';
    document.querySelectorAll('.nav-links a').forEach(function (a) {
      const href = a.getAttribute('href');
      if (!href) return;
      const linkPath = href.replace(/\/$/, '') || '/';
      /* Exact match, or the current path starts with linkPath (sub-pages) */
      const exact = path === linkPath;
      const sub   = linkPath !== '/' && linkPath !== '' && path.startsWith(linkPath);
      if (exact || sub) {
        a.setAttribute('aria-current', 'page');
      }
    });
  })();

  /* ── Projects filter ── */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectItems = document.querySelectorAll('[data-category]');

  if (filterBtns.length && projectItems.length) {
    filterBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        filterBtns.forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');

        const cat = btn.dataset.filter;
        projectItems.forEach(function (item) {
          if (cat === 'all' || item.dataset.category.split(' ').includes(cat)) {
            item.style.display = '';
          } else {
            item.style.display = 'none';
          }
        });
      });
    });
  }
})();
