/* InfoXteK demo helper: any link that leaves this site opens in a new tab, so the visitor never loses the demo or InfoXteK. */
(function () {
  function fix(a) {
    try {
      var u = new URL(a.href, location.href);
      if ((u.protocol === 'http:' || u.protocol === 'https:') && u.host !== location.host) { a.target = '_blank'; a.rel = 'noopener noreferrer'; }
    } catch (e) { /* ignore malformed links */ }
  }
  document.addEventListener('click', function (e) {
    var a = e.target && e.target.closest ? e.target.closest('a[href]') : null;
    if (a && !a.target) fix(a);
  }, true);
})();
