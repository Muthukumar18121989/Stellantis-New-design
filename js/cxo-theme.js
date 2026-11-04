/* Colour theme picker in the menu bar (CXO tokens/themes.js THEMES).
   The palette lives in cxo/tokens.css per theme; picking one sets data-cxo-theme on <html> (no reload)
   and keeps the choice per browser in localStorage "promotool-theme". The <head> of every page applies
   the saved theme before first paint. */
(function () {
  var THEMES = [
    { key: 'wallStreet', name: 'Wall Street Executive', desc: 'Cream, deep navy, champagne gold', swatch: ['#FAF8F3', '#0A1628', '#B89B5E'] },
    { key: 'onyx', name: 'Onyx Midnight', desc: 'Black onyx, warm champagne accents', swatch: ['#0E0F12', '#16181D', '#D4B574'] },
    { key: 'porcelain', name: 'Porcelain', desc: 'Pure white minimalism, graphite & ochre', swatch: ['#FCFCFC', '#1A1A1A', '#B07D2A'] },
    { key: 'bordeaux', name: 'Bordeaux Estate', desc: 'Wine, parchment, antique brass', swatch: ['#F6F1EB', '#3E1218', '#B08552'] },
    { key: 'upsBrand', name: 'UPS Shield', desc: 'Pullman brown, gold, warm tan', swatch: ['#FBF6EF', '#351C15', '#FFB500'] }
  ];
  var root = document.documentElement;
  var btn = document.querySelector('[data-theme-open]');
  if (!btn) return;

  function current() { return root.getAttribute('data-cxo-theme') || 'wallStreet'; }
  function apply(key) {
    root.setAttribute('data-cxo-theme', key);
    try { localStorage.setItem('promotool-theme', key); } catch (e) { /* private mode */ }
    var items = menu.querySelectorAll('[role="menuitemradio"]');
    for (var i = 0; i < items.length; i++) items[i].setAttribute('aria-checked', String(items[i].dataset.theme === key));
  }

  var menu = document.createElement('div');
  menu.className = 'theme-menu';
  menu.setAttribute('role', 'menu');
  menu.setAttribute('aria-label', 'Colour theme');
  menu.hidden = true;
  menu.innerHTML = '<p class="theme-menu__title">Colour theme</p>' + THEMES.map(function (t) {
    return '<button type="button" class="theme-menu__item" role="menuitemradio" aria-checked="false" data-theme="' + t.key + '">' +
      '<span class="theme-menu__swatch" aria-hidden="true">' + t.swatch.map(function (c) { return '<i style="background:' + c + '"></i>'; }).join('') + '</span>' +
      '<span class="theme-menu__text"><b>' + t.name + '</b><small>' + t.desc + '</small></span>' +
      '<svg class="theme-menu__check" viewBox="0 0 24 24" width="14" height="14" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg></button>';
  }).join('');
  document.body.appendChild(menu);
  apply(current());

  function place() {
    var r = btn.getBoundingClientRect();
    var bar = document.getElementById('app-sidebar');
    var edge = bar && getComputedStyle(bar).position !== 'fixed' ? bar.getBoundingClientRect().right : r.right;
    var w = menu.offsetWidth, h = menu.offsetHeight;
    var left = edge + 10, top = r.bottom - h;
    if (left + w > window.innerWidth - 8) { left = Math.max(8, r.left); top = r.top - h - 8; }
    menu.style.left = Math.round(left) + 'px';
    menu.style.top = Math.round(Math.max(8, top)) + 'px';
  }
  function open() {
    menu.hidden = false; place(); btn.setAttribute('aria-expanded', 'true');
    root.classList.add('is-theme-menu-open');
    var on = menu.querySelector('[aria-checked="true"]') || menu.querySelector('[role="menuitemradio"]'); if (on) on.focus();
  }
  function close(focusBtn) {
    if (menu.hidden) return;
    menu.hidden = true; btn.setAttribute('aria-expanded', 'false'); root.classList.remove('is-theme-menu-open');
    var bar = document.getElementById('app-sidebar');
    if (bar && !bar.matches(':hover') && !focusBtn) bar.dispatchEvent(new Event('mouseleave'));
    if (focusBtn) btn.focus();
  }
  btn.addEventListener('click', function (e) { e.stopPropagation(); if (menu.hidden) open(); else close(); });
  menu.addEventListener('click', function (e) {
    var item = e.target.closest('[data-theme]');
    if (!item) return;
    apply(item.dataset.theme);
    close(true);
  });
  menu.addEventListener('keydown', function (e) {
    var items = Array.prototype.slice.call(menu.querySelectorAll('[role="menuitemradio"]'));
    var i = items.indexOf(document.activeElement);
    if (e.key === 'ArrowDown') { e.preventDefault(); items[(i + 1) % items.length].focus(); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); items[(i - 1 + items.length) % items.length].focus(); }
    else if (e.key === 'Escape') { e.preventDefault(); close(true); }
    else if (e.key === 'Tab') close(false);
  });
  document.addEventListener('click', function (e) { if (!menu.contains(e.target) && e.target !== btn) close(false); });
  window.addEventListener('resize', function () { if (!menu.hidden) place(); });
})();
