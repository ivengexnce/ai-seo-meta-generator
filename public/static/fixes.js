/* ==========================================================================
   Rankora — fixes layer (load AFTER script.js, with `defer`)
   1. Hero counters (replaces the animation that printed "NaN%")
   2. FAQ accordion: click, Enter/Space, Unfold/Fold All, ARIA state
   ========================================================================== */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- 1. Counters ---------- */
  function initCounters() {
    document.querySelectorAll('[data-count-to]').forEach(function (el) {
      var target = parseFloat(el.getAttribute('data-count-to'));
      if (!isFinite(target)) return;

      var suffix = el.getAttribute('data-count-suffix') || '';
      var decimals = parseInt(el.getAttribute('data-count-decimals') || '0', 10);
      var format = function (v) { return v.toFixed(decimals) + suffix; };

      if (reduceMotion || target === 0) {
        el.textContent = format(target);
        return;
      }

      var duration = 1400;
      var start = performance.now();
      el.textContent = format(0);

      (function tick(now) {
        var p = Math.min((now - start) / duration, 1);
        var eased = 1 - Math.pow(1 - p, 3);
        el.textContent = format(target * eased);
        if (p < 1) requestAnimationFrame(tick);
      })(start);
    });
  }

  /* ---------- 2. FAQ accordion ---------- */
  function initFaq() {
    var root = document.getElementById('faq');
    if (!root) return;

    var facets = Array.prototype.slice.call(root.querySelectorAll('.origami-facet'));
    var toggleAllBtn = document.getElementById('origami-toggle-all-btn');
    var toggleText = toggleAllBtn && toggleAllBtn.querySelector('.toggle-text');

    function setOpen(facet, open) {
      var tab = facet.querySelector('.crease-tab');
      facet.classList.toggle('open', open);
      if (tab) tab.setAttribute('aria-expanded', open ? 'true' : 'false');
    }

    function syncMaster() {
      var allOpen = facets.length > 0 && facets.every(function (f) {
        return f.classList.contains('open');
      });
      root.classList.toggle('all-open', allOpen);
      if (toggleText) toggleText.textContent = allOpen ? 'Fold All' : 'Unfold All';
    }

    facets.forEach(function (f) { setOpen(f, false); });
    syncMaster();

    function activateTab(e, tab) {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      var facet = tab.closest('.origami-facet');
      if (!facet) return;
      setOpen(facet, !facet.classList.contains('open'));
      syncMaster();
    }

    function activateMaster(e) {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      var allOpen = facets.every(function (f) { return f.classList.contains('open'); });
      facets.forEach(function (f) { setOpen(f, !allOpen); });
      syncMaster();
    }

    /* Capture phase on window so this runs before any older handlers in
       script.js (prevents double-toggling that would leave panels shut). */
    window.addEventListener('click', function (e) {
      if (!e.target || !e.target.closest) return;
      var tab = e.target.closest('#faq .crease-tab');
      if (tab) return activateTab(e, tab);
      if (e.target.closest('#origami-toggle-all-btn')) return activateMaster(e);
    }, true);

    window.addEventListener('keydown', function (e) {
      if (e.key !== 'Enter' && e.key !== ' ') return;
      if (!e.target || !e.target.closest) return;
      var tab = e.target.closest('#faq .crease-tab');
      if (tab) activateTab(e, tab);
    }, true);
  }

  function boot() {
    initCounters();
    initFaq();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
