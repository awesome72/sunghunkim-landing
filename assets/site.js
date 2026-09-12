(function () {
  var STORAGE_KEY = 'sunghunkim-landing:lang';
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('.nav-links a'));
  var langLinks = Array.prototype.slice.call(document.querySelectorAll('a[data-lang]'));
  var sections = Array.prototype.slice.call(document.querySelectorAll('main > section[id]'));

  // Language links carry the section in view, so switching language keeps the reader's place.
  function setCurrent(id) {
    navLinks.forEach(function (a) { a.classList.toggle('is-active', a.hash === '#' + id); });
    langLinks.forEach(function (a) {
      a.setAttribute('href', a.dataset.base + (id && id !== 'top' ? '#' + id : ''));
    });
  }

  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) setCurrent(entry.target.id);
      });
    }, { rootMargin: '-35% 0px -60% 0px' });
    sections.forEach(function (section) { observer.observe(section); });
  }
  if (location.hash) setCurrent(location.hash.slice(1));

  langLinks.forEach(function (a) {
    a.addEventListener('click', function () {
      try { localStorage.setItem(STORAGE_KEY, a.dataset.lang); } catch (e) {}
    });
  });

  var menu = document.querySelector('details.lang');
  if (menu) {
    document.addEventListener('click', function (e) {
      if (menu.open && !menu.contains(e.target)) menu.open = false;
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && menu.open) {
        menu.open = false;
        menu.querySelector('summary').focus();
      }
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
