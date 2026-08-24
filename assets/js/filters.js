function zFiltersOpen() {
  document.getElementById('z-filters').classList.add('is-open');
  document.getElementById('z-filters-overlay').classList.add('is-open');
  document.body.style.overflow = 'hidden';
}

function zFiltersClose() {
  document.getElementById('z-filters').classList.remove('is-open');
  document.getElementById('z-filters-overlay').classList.remove('is-open');
  document.body.style.overflow = '';
}
