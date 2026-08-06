/* ── Zima Arena — base JS ── */
(function () {
  'use strict';

  // ── Cart drawer ──────────────────────────────────────
  const drawer   = document.getElementById('z-cart-drawer');
  const overlay  = document.getElementById('z-cart-overlay');
  const openBtns = document.querySelectorAll('[data-cart-open]');
  const closeBtns= document.querySelectorAll('[data-cart-close]');

  function openCart()  {
    if (!drawer) return;
    drawer.classList.add('is-open');
    overlay.classList.add('is-visible');
    document.body.style.overflow = 'hidden';
  }
  function closeCart() {
    if (!drawer) return;
    drawer.classList.remove('is-open');
    overlay.classList.remove('is-visible');
    document.body.style.overflow = '';
  }

  function openCart()  {
    if (!drawer) return;
    drawer.classList.add('is-open');
    overlay.classList.add('is-visible');
    document.body.style.overflow = 'hidden';
  }
  function closeCart() {
    if (!drawer) return;
    drawer.classList.remove('is-open');
    overlay.classList.remove('is-visible');
    document.body.style.overflow = '';
  }

  openBtns.forEach(b => b.addEventListener('click', openCart));
  closeBtns.forEach(b => b.addEventListener('click', closeCart));
  if (overlay) overlay.addEventListener('click', closeCart);

  // ── Mobile nav toggle ────────────────────────────────
  const navToggle = document.getElementById('z-nav-toggle');
  const mobileNav = document.getElementById('z-mobile-nav');
  if (navToggle && mobileNav) {
    navToggle.addEventListener('click', () => {
      const open = mobileNav.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', open);
    });
  }

  // ── Filter tabs ──────────────────────────────────────
  document.querySelectorAll('.z-tabs').forEach(group => {
    group.querySelectorAll('.z-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        group.querySelectorAll('.z-tab').forEach(t => t.classList.remove('is-active'));
        tab.classList.add('is-active');

        const target = tab.dataset.filter;
        if (!target) return;
        document.querySelectorAll('[data-filter-item]').forEach(item => {
          const match = target === 'all' || item.dataset.filterItem === target;
          item.style.display = match ? '' : 'none';
        });
      });
    });
  });

  // ── Steppers (qty / guests) ──────────────────────────
  document.querySelectorAll('.z-stepper').forEach(st => {
    const val = st.querySelector('.z-stepper-val');
    const min = parseInt(st.dataset.min ?? 1);
    const max = parseInt(st.dataset.max ?? 99);
    st.querySelector('[data-dec]')?.addEventListener('click', () => {
      const v = parseInt(val.textContent);
      if (v > min) val.textContent = v - 1;
    });
    st.querySelector('[data-inc]')?.addEventListener('click', () => {
      const v = parseInt(val.textContent);
      if (v < max) val.textContent = v + 1;
    });
  });
})();

// ── Price-type radio selector ────────────────────────────────────────────────
document.querySelectorAll('.zpd-price-type-tabs input[type="radio"]').forEach(function(radio) {
  radio.addEventListener('change', function() {
    var offerId    = this.dataset.offer;
    var typeId     = this.value;
    var lowest     = this.dataset.lowest;

    // Mostrar sólo el grupo seleccionado
    document.querySelectorAll('.zpd-price-group[data-offer="' + offerId + '"]').forEach(function(ul) {
      ul.style.display = String(ul.dataset.typeId) === typeId ? '' : 'none';
    });

    // Actualizar label activo
    document.querySelectorAll('.zpd-price-type-tab').forEach(function(lbl) {
      var inp = lbl.querySelector('input');
      if (inp && inp.dataset.offer === offerId) {
        lbl.classList.toggle('is-active', inp.value === typeId);
      }
    });

    // Actualizar precio "desde"
    var priceEl = document.querySelector('.zpd-offer-price-val[data-offer="' + offerId + '"]');
    if (priceEl) priceEl.textContent = '$' + lowest;

    // Actualizar data-request-data del botón añadir al carrito
    var btn = document.querySelector('.zpd-add-btn[data-offer="' + offerId + '"]');
    if (btn) {
      var df = btn.dataset.dateFrom;
      var dt = btn.dataset.dateTo;
      var a  = btn.dataset.adults;
      var c  = btn.dataset.children;
      btn.setAttribute('data-request-data',
        'offer_id: ' + offerId +
        ', date_from: \'' + df + '\'' +
        ', date_to: \'' + dt + '\'' +
        ', adults: ' + a +
        ', children: ' + c +
        ', price_type_id: \'' + typeId + '\''
      );
    }
  });
});

// ── Cart helpers (globales) ──────────────────────────────────────────────────
function zCartUpdateBadge(count) {
  var badge = document.getElementById('z-cart-count');
  if (!badge) return;
  badge.textContent = count;
  badge.style.display = count > 0 ? '' : 'none';
  badge.classList.remove('pop');
  void badge.offsetWidth; // reflow para reiniciar animación
  badge.classList.add('pop');
}

function zCartOnAdd(data) {
  if (data.cartCount !== undefined) zCartUpdateBadge(data.cartCount);
  var btn = document.getElementById('z-cart-load-btn');
  if (btn) btn.click();
}

function zCartOnUpdate(data) {
  var count = data.cartCount;
  if (count !== undefined) {
    zCartUpdateBadge(count);
  }
}
