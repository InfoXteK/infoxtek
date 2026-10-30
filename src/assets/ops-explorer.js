/* PC Admin Tools operations explorer: search and category filter over the server-rendered list. */
(function () {
  'use strict';
  var box = document.querySelector('[data-opsx]');
  if (!box) return;
  var q = box.querySelector('input'), chips = box.querySelectorAll('[data-c]'), rows = box.querySelectorAll('li[data-cat]'), cnt = box.querySelector('[data-count]'), cat = 'all';
  function apply() {
    var t = q.value.trim().toLowerCase(), n = 0;
    rows.forEach(function (r) {
      var ok = (cat === 'all' || r.getAttribute('data-cat') === cat) && (!t || r.getAttribute('data-q').indexOf(t) > -1);
      r.hidden = !ok; if (ok) n++;
    });
    cnt.textContent = n + ' of ' + rows.length + ' operations shown';
  }
  chips.forEach(function (c) {
    c.addEventListener('click', function () {
      cat = c.getAttribute('data-c');
      chips.forEach(function (x) { x.classList.toggle('on', x === c); });
      apply();
    });
  });
  q.addEventListener('input', apply);
  apply();
})();
