(function () {
  var isMobile = window.innerWidth < 680;
  var root     = document.getElementById('zsb-home');
  var searchUrl = root ? root.dataset.searchUrl : '/buscar';

  // ── Tabs ──────────────────────────────────────────────────────────────────
  document.querySelectorAll('.zsb2-tab[data-hzsb]').forEach(function (tab) {
    tab.addEventListener('click', function () {
      document.querySelectorAll('.zsb2-tab[data-hzsb]').forEach(function (t) {
        t.classList.remove('is-active');
      });
      tab.classList.add('is-active');
      var target = tab.dataset.tab;
      document.getElementById('zsb-home-panel-booking').style.display = target === 'booking' ? '' : 'none';
      document.getElementById('zsb-home-panel-store').style.display   = target === 'store'   ? '' : 'none';
    });
  });

  // ── Operator dropdown ──────────────────────────────────────────────────────
  var opBtn = document.getElementById('zsb-home-op-btn');
  var opDd  = document.getElementById('zsb-home-op-dd');
  var opCod = document.getElementById('zsb-home-op-code');
  var opVal = document.getElementById('zsb-home-op-val');

  if (opBtn && opDd) {
    opBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      var open = opDd.classList.toggle('is-open');
      opBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    opDd.querySelectorAll('.zsb2-op-option').forEach(function (opt) {
      opt.addEventListener('click', function () {
        if (opCod) opCod.value = opt.dataset.val;
        if (opVal) opVal.textContent = opt.dataset.label;
        opDd.querySelectorAll('.zsb2-op-option').forEach(function (o) { o.classList.remove('is-selected'); });
        opt.classList.add('is-selected');
        opDd.classList.remove('is-open');
        opBtn.setAttribute('aria-expanded', 'false');
      });
    });
    document.addEventListener('click', function () {
      if (opDd) { opDd.classList.remove('is-open'); opBtn.setAttribute('aria-expanded', 'false'); }
    });
  }

  // ── Litepicker ────────────────────────────────────────────────────────────
  var fmt = { weekday: 'short', day: 'numeric', month: 'short' };
  function initPicker() {
    if (typeof Litepicker === 'undefined') { setTimeout(initPicker, 100); return; }
    new Litepicker({
      element:         document.getElementById('zsb-home-lp'),
      singleMode:      false,
      numberOfMonths:  isMobile ? 1 : 2,
      numberOfColumns: isMobile ? 1 : 2,
      minDate:         new Date(),
      lang:            'es-VE',
      format:          'YYYY-MM-DD',
      autoApply:       true,
      mobileFriendly:  true,
      setup: function (picker) {
        picker.on('selected', function (start, end) {
          var s = start.toJSDate(), e = end.toJSDate();
          document.getElementById('zsb-home-df').value = start.format('YYYY-MM-DD');
          document.getElementById('zsb-home-dt').value = end.format('YYYY-MM-DD');
          var ci = document.getElementById('zsb-home-ci');
          var co = document.getElementById('zsb-home-co');
          ci.textContent = s.toLocaleDateString('es-VE', fmt); ci.classList.remove('zsb2-field-val--dim');
          co.textContent = e.toLocaleDateString('es-VE', fmt); co.classList.remove('zsb2-field-val--dim');
          var nights = Math.round((e - s) / 86400000);
          var ni = document.getElementById('zsb-home-ni');
          ni.textContent = nights + (nights === 1 ? ' noche' : ' noches');
          ni.classList.remove('zsb2-field-val--dim');
        });
      }
    });
  }
  initPicker();

  // ── Steppers ──────────────────────────────────────────────────────────────
  [['zsb-home-av', 'zsb-home-a'], ['zsb-home-cv', 'zsb-home-c']].forEach(function (pair) {
    var valEl = document.getElementById(pair[0]);
    var hidEl = document.getElementById(pair[1]);
    if (!valEl) return;
    var stepper = valEl.closest('.zsb2-stepper');
    var min = parseInt(stepper.dataset.min || 0);
    var max = parseInt(stepper.dataset.max || 99);
    stepper.querySelector('[data-dec]').addEventListener('click', function () {
      var v = Math.max(min, parseInt(valEl.textContent) - 1);
      valEl.textContent = v; if (hidEl) hidEl.value = v;
    });
    stepper.querySelector('[data-inc]').addEventListener('click', function () {
      var v = Math.min(max, parseInt(valEl.textContent) + 1);
      valEl.textContent = v; if (hidEl) hidEl.value = v;
    });
  });

  // ── Navegación ────────────────────────────────────────────────────────────
  window.zsbHomeSearch = function () {
    var from   = document.getElementById('zsb-home-df').value;
    var to     = document.getElementById('zsb-home-dt').value;
    var adults = document.getElementById('zsb-home-a').value;
    var child  = document.getElementById('zsb-home-c').value;
    var allOcc = document.getElementById('zsb-home-allocc').checked ? '1' : '0';
    var opCode = (document.getElementById('zsb-home-op-code') || {}).value || '';

    var params = new URLSearchParams({
      date_from: from, date_to: to,
      adults: adults, children: child,
      all_occupancies: allOcc,
    });
    if (opCode) params.set('operator_code', opCode);
    window.location.href = searchUrl + '?' + params.toString();
  };

  window.zsbHomeSearchStore = function () {
    var q      = (document.getElementById('zsb-home-q') || {}).value || '';
    var opCode = (document.getElementById('zsb-home-op-code') || {}).value || '';
    var params = new URLSearchParams({ search_type: 'store' });
    if (q)      params.set('q', q);
    if (opCode) params.set('operator_code', opCode);
    window.location.href = searchUrl + '?' + params.toString();
  };

})();
