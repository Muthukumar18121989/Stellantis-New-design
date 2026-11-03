/* App shell behaviour for the CXO menu bar (layout/SidebarShell):
   - the menu bar is collapsed (72px) by default; hovering it opens it over the page (240px) without moving the content
   - the pin button keeps it open on every page (localStorage "promotool-nav-pinned"); pressing it again collapses it
   - below 900px the menu bar is a drawer: the menu button opens it, the scrim, Escape or a nav click closes it
   Presentation only: navigation targets are the page's own links. */
(function () {
  var root = document.documentElement;
  var sidebar = document.getElementById('app-sidebar');
  if (!sidebar) return;
  var toggle = sidebar.querySelector('[data-nav-toggle]');
  var scrim = document.querySelector('[data-nav-close]');
  var openBtn = document.querySelector('[data-nav-open]');
  var phone = window.matchMedia('(max-width: 899px)');
  var pinned = false;
  try { pinned = localStorage.getItem('promotool-nav-pinned') === '1'; } catch (e) { /* private mode */ }
  var enterTimer, leaveTimer;

  function label() {
    if (!toggle) return;
    var open = pinned;
    toggle.setAttribute('aria-expanded', String(open || root.classList.contains('is-nav-peek')));
    toggle.setAttribute('aria-label', open ? 'Collapse menu' : 'Keep menu open');
    toggle.title = open ? 'Collapse' : 'Keep open';
  }
  function setPinned(on) {
    pinned = on;
    root.classList.remove('is-nav-peek');
    root.classList.toggle('is-nav-collapsed', !on);
    try { localStorage.setItem('promotool-nav-pinned', on ? '1' : '0'); } catch (e) { /* private mode */ }
    label();
  }
  function peek(open) {
    if (pinned || phone.matches) return;
    root.classList.toggle('is-nav-peek', open);
    root.classList.toggle('is-nav-collapsed', !open);
    label();
  }
  function setDrawer(open) {
    root.classList.toggle('is-nav-open', open);
    if (scrim) scrim.hidden = !open;
    if (openBtn) openBtn.setAttribute('aria-expanded', String(open));
    if (open) { var first = sidebar.querySelector('.nav-item'); if (first) first.focus(); }
    else if (openBtn && phone.matches) openBtn.focus();
  }

  root.classList.toggle('is-nav-collapsed', !pinned);
  label();

  sidebar.addEventListener('mouseenter', function () {
    clearTimeout(leaveTimer);
    enterTimer = setTimeout(function () { peek(true); }, 80);
  });
  sidebar.addEventListener('mouseleave', function () {
    clearTimeout(enterTimer);
    leaveTimer = setTimeout(function () { peek(false); }, 180);
  });
  // keyboard users: focus inside the collapsed menu opens it, leaving it closes it
  sidebar.addEventListener('focusin', function () { clearTimeout(leaveTimer); peek(true); });
  sidebar.addEventListener('focusout', function (e) { if (!sidebar.contains(e.relatedTarget)) peek(false); });

  if (toggle) toggle.addEventListener('click', function () {
    if (phone.matches) { setDrawer(false); return; }
    setPinned(!pinned);
  });
  if (openBtn) openBtn.addEventListener('click', function () { setDrawer(true); });
  if (scrim) scrim.addEventListener('click', function () { setDrawer(false); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && root.classList.contains('is-nav-open')) setDrawer(false); });
  phone.addEventListener('change', function () { setDrawer(false); root.classList.remove('is-nav-peek'); });
})();
