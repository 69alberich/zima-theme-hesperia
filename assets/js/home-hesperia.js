(function () {
  'use strict';

  /* ── Reveal on scroll ──────────────────────────────── */
  function reveal(el) {
    if (el.dataset.revealed) return;
    el.dataset.revealed = '1';
    var count = el.dataset.count;
    if (count) countUp(el, parseInt(count, 10));
  }

  function scanReveals() {
    var vh = window.innerHeight;
    document.querySelectorAll('[data-reveal]').forEach(function (el) {
      var r = el.getBoundingClientRect();
      if (r.top < vh * 0.92 && r.bottom > -vh * 1.5) {
        reveal(el);
      } else if (!el.dataset.observed) {
        el.dataset.observed = '1';
        io.observe(el);
      }
    });
  }

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { reveal(e.target); io.unobserve(e.target); }
    });
  }, { threshold: 0.12 });

  /* ── Count-up animation ────────────────────────────── */
  function countUp(el, target) {
    var suffix = el.querySelector('[data-sup]');
    var start  = performance.now();
    var dur    = 1100;
    var tick   = function (t) {
      var p = Math.min(1, (t - start) / dur);
      var v = Math.round(target * (1 - Math.pow(1 - p, 3)));
      el.textContent = v;
      if (suffix) el.appendChild(suffix);
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  /* ── Tilt on hover ─────────────────────────────────── */
  function initTilt() {
    document.querySelectorAll('[data-tilt]').forEach(function (el) {
      if (el.dataset.tiltInit) return;
      el.dataset.tiltInit = '1';
      el.style.transition = 'transform .7s cubic-bezier(.2,.8,.2,1), box-shadow .7s';
      el.addEventListener('mouseenter', function () {
        el.style.transform  = 'translateY(-8px) scale(1.012)';
        el.style.boxShadow  = '0 30px 60px -30px rgba(5,28,44,.45)';
        var a = el.querySelector('[data-arrow]');
        if (a) a.style.transform = 'translateX(8px)';
      });
      el.addEventListener('mouseleave', function () {
        el.style.transform = 'none';
        el.style.boxShadow = 'none';
        var a = el.querySelector('[data-arrow]');
        if (a) a.style.transform = 'none';
      });
    });
  }

  /* ── Offer filter chips ────────────────────────────── */
  function initOfferFilter(containerId) {
    var wrap  = document.getElementById(containerId);
    if (!wrap) return;
    var chips = wrap.querySelectorAll('[data-chip]');
    var cards = wrap.querySelectorAll('[data-offer-kind]');

    chips.forEach(function (chip) {
      chip.addEventListener('click', function () {
        chips.forEach(function (c) { c.classList.remove('is-active'); });
        chip.classList.add('is-active');
        var filter = chip.dataset.chip;
        cards.forEach(function (card) {
          card.style.display = (filter === 'all' || card.dataset.offerKind === filter) ? '' : 'none';
        });
      });
    });
  }

  /* ── Init ──────────────────────────────────────────── */
  function init() {
    document.documentElement.setAttribute('data-hsp-reveal', '1');

    var run = function () { scanReveals(); initTilt(); };
    requestAnimationFrame(function () { requestAnimationFrame(run); });
    window.addEventListener('scroll', run, { passive: true });
    window.addEventListener('resize', run);

    // Fallback reveal after 2.5s for elements below fold
    setTimeout(function () {
      document.querySelectorAll('[data-reveal]').forEach(reveal);
    }, 2500);

    // Init offer filter if present
    initOfferFilter('hsp-offers-section');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
