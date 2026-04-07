/* main.js – Portfolio site interactive behaviour */

/* ── Theme: apply stored preference before render (also done inline in <head>) ── */
(function () {
  var stored = localStorage.getItem('theme');
  if (stored === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
  }
}());

(function () {
  'use strict';

  /* ── Mobile nav toggle ── */
  var toggle = document.querySelector('.nav-toggle');
  var navLinks = document.querySelector('.nav-links');

  if (toggle && navLinks) {
    toggle.addEventListener('click', function () {
      var isOpen = navLinks.classList.toggle('open');
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
    var path = window.location.pathname.replace(/\/$/, '') || '/';
    document.querySelectorAll('.nav-links a').forEach(function (a) {
      var href = a.getAttribute('href');
      if (!href) return;
      var linkPath = href.replace(/\/$/, '') || '/';
      var exact = path === linkPath;
      var sub   = linkPath !== '/' && linkPath !== '' && path.startsWith(linkPath);
      if (exact || sub) {
        a.setAttribute('aria-current', 'page');
      }
    });
  }());

  /* ── Theme toggle ── */
  (function initThemeToggle() {
    var btn = document.getElementById('theme-toggle');
    if (!btn) return;

    function updateLabel() {
      var isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      btn.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
    }
    updateLabel();

    btn.addEventListener('click', function () {
      var isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      if (isDark) {
        document.documentElement.removeAttribute('data-theme');
        localStorage.setItem('theme', 'light');
      } else {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
      }
      updateLabel();
    });
  }());

  /* ── Projects filter ── */
  var filterBtns = document.querySelectorAll('.filter-btn');
  var projectItems = document.querySelectorAll('[data-category]');

  if (filterBtns.length && projectItems.length) {
    filterBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        filterBtns.forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');

        var cat = btn.dataset.filter;
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

  /* ── Image Modal / Lightbox ── */
  (function initModal() {
    /* Create modal element */
    var backdrop = document.createElement('div');
    backdrop.className = 'img-modal-backdrop';
    backdrop.setAttribute('role', 'dialog');
    backdrop.setAttribute('aria-modal', 'true');
    backdrop.setAttribute('aria-label', 'Image preview');
    backdrop.innerHTML =
      '<div class="img-modal-inner">' +
        '<button class="img-modal-close" aria-label="Close image preview">&times;</button>' +
        '<img class="img-modal-img" src="" alt="" />' +
        '<p class="img-modal-caption"></p>' +
      '</div>';
    document.body.appendChild(backdrop);

    var modalImg     = backdrop.querySelector('.img-modal-img');
    var modalCaption = backdrop.querySelector('.img-modal-caption');
    var closeBtn     = backdrop.querySelector('.img-modal-close');
    var lastFocus    = null;

    function openModal(src, alt, caption) {
      lastFocus = document.activeElement;
      modalImg.src = src;
      modalImg.alt = alt || '';
      modalCaption.textContent = caption || '';
      backdrop.classList.add('open');
      document.body.style.overflow = 'hidden';
      closeBtn.focus();
    }

    function closeModal() {
      backdrop.classList.remove('open');
      document.body.style.overflow = '';
      modalImg.src = '';
      if (lastFocus) { lastFocus.focus(); }
    }

    /* Close on backdrop click */
    backdrop.addEventListener('click', function (e) {
      if (e.target === backdrop) { closeModal(); }
    });

    /* Close button */
    closeBtn.addEventListener('click', closeModal);

    /* Esc key */
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && backdrop.classList.contains('open')) {
        closeModal();
      }
    });

    /* Wire up all images that should open in the modal */
    function wireImage(img, captionText) {
      var wrapper = img.parentElement;
      wrapper.classList.add('modal-trigger');
      wrapper.setAttribute('tabindex', '0');
      wrapper.setAttribute('role', 'button');
      wrapper.setAttribute('aria-label', 'View full-size image');

      function trigger() { openModal(img.src, img.alt, captionText || img.alt); }
      wrapper.addEventListener('click', trigger);
      wrapper.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); trigger(); }
      });
    }

    /* Evidence gallery images */
    document.querySelectorAll('.evidence-img img').forEach(function (img) {
      var card = img.closest('.evidence-card');
      var captionEl = card ? card.querySelector('.evidence-caption strong') : null;
      wireImage(img, captionEl ? captionEl.textContent : '');
    });

    /* Project card thumbnails */
    document.querySelectorAll('.card-img-wrap img').forEach(function (img) {
      wireImage(img, img.alt);
    });

    /* Flagship media image */
    document.querySelectorAll('.flagship-media img').forEach(function (img) {
      wireImage(img, img.alt);
    });
  }());

}());
