/* Table header alignment (Muthu, 2026-11-04). Presentation only.
   - a header cell with a column line on either side (its own border, an inset line, or its neighbour's) is centred
   - a header cell without column lines takes its column's content alignment (left for text, right for figures)
   Runs on load and again whenever a table is added or redrawn (dialogs, drill-downs, tabs). */
(function () {
  function hasLine(cell, side) {
    if (!cell) return false;
    var c = getComputedStyle(cell);
    var w = parseFloat(c['border' + side + 'Width']), st = c['border' + side + 'Style'], col = c['border' + side + 'Color'];
    if (w > 0 && st !== 'none' && st !== 'hidden' && !/rgba\(\d+, \d+, \d+, 0\)|transparent/.test(col)) return true;
    // inset line drawn with box-shadow, e.g. "inset -1px 0 0 0 color" or "inset 1px 0 color"
    var sh = c.boxShadow || '';
    var re = side === 'Right' ? /(^|[\s)])-1px 0px[^,]*inset/ : /(^|[\s)])1px 0px[^,]*inset/;
    return sh.indexOf('inset') >= 0 && re.test(sh);
  }
  function separated(th) {
    return hasLine(th, 'Left') || hasLine(th, 'Right') ||
      hasLine(th.previousElementSibling, 'Right') || hasLine(th.nextElementSibling, 'Left');
  }
  function columnAlign(th) {
    var table = th.closest('table'); if (!table || th.colSpan > 1) return 'left';
    var idx = 0, el = th; while ((el = el.previousElementSibling)) idx += el.colSpan || 1;
    var body = table.tBodies[0]; if (!body) return 'left';
    for (var r = 0; r < Math.min(body.rows.length, 3); r++) {
      var x = 0;
      for (var i = 0; i < body.rows[r].cells.length; i++) {
        var td = body.rows[r].cells[i];
        if (x === idx && (td.colSpan || 1) === 1) {
          var a = getComputedStyle(td).textAlign;
          return /right|end/.test(a) ? 'right' : /center/.test(a) ? 'center' : 'left';
        }
        x += td.colSpan || 1;
      }
    }
    return 'left';
  }
  function mark(root) {
    var ths = (root || document).querySelectorAll('table th');
    for (var i = 0; i < ths.length; i++) {
      var th = ths[i];
      if (!th.offsetParent && !th.closest('dialog,template')) continue;
      th.setAttribute('data-align', separated(th) ? 'center' : columnAlign(th));
    }
  }
  var timer;
  function schedule() { clearTimeout(timer); timer = setTimeout(function () { mark(document); }, 60); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', schedule); else schedule();
  new MutationObserver(function (list) {
    for (var i = 0; i < list.length; i++) {
      var m = list[i];
      if (m.type === 'childList' && m.addedNodes.length) return schedule();
      if (m.type === 'attributes' && m.target.nodeType === 1 && !m.target.hasAttribute('data-align')) return schedule();
    }
  }).observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['open', 'hidden', 'data-tab', 'class'] });
  window.addEventListener('resize', schedule);
})();
