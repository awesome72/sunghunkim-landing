(function () {
  var links = Array.prototype.slice.call(document.querySelectorAll('.nav-links a'));
  if ('IntersectionObserver' in window && links.length) {
    var byId = {};
    links.forEach(function (a) { byId[a.getAttribute('href').slice(1)] = a; });
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        links.forEach(function (a) { a.classList.remove('is-active'); });
        var link = byId[entry.target.id];
        if (link) link.classList.add('is-active');
      });
    }, { rootMargin: '-35% 0px -60% 0px' });
    Object.keys(byId).forEach(function (id) {
      var el = document.getElementById(id);
      if (el) observer.observe(el);
    });
  }

  var copyBtn = document.querySelector('.copy-btn');
  if (!copyBtn) return;
  if (!navigator.clipboard) { copyBtn.hidden = true; return; }
  var idleLabel = copyBtn.textContent;
  copyBtn.addEventListener('click', function () {
    navigator.clipboard.writeText(copyBtn.dataset.copy).then(function () {
      copyBtn.textContent = copyBtn.dataset.done;
    }, function () {
      copyBtn.textContent = copyBtn.dataset.fail;
    });
    setTimeout(function () { copyBtn.textContent = idleLabel; }, 1800);
  });
})();
