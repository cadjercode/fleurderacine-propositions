/* Fleur de Racine — proposition D « Le Film » */
(function () {
  'use strict';
  var d = document;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var conn = navigator.connection || {};
  var noVideo = reduce || conn.saveData === true;

  /* En-tête : transparent sur le film, chocolat dès qu'on défile */
  var head = d.querySelector('.site-header');
  function onScroll() { head.classList.toggle('solid', window.scrollY > 40); }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* Révélations à sens unique et garanties */
  var rvs = [].slice.call(d.querySelectorAll('.rv, .rule-v'));
  function count(el) {
    var n = +el.getAttribute('data-count'), i = 1;
    if (reduce || !n) return;
    el.textContent = '1';
    var t = setInterval(function () { i++; el.textContent = String(i); if (i >= n) clearInterval(t); }, 55);
  }
  function show(el) {
    if (el.dataset.shown) return;
    el.dataset.shown = '1';
    el.classList.add('in');
    var c = el.querySelector('[data-count]');
    if (c) count(c);
  }
  if (!('IntersectionObserver' in window) || reduce) {
    rvs.forEach(show);
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { show(e.target); io.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -8% 0px' });
    rvs.forEach(function (el) { io.observe(el); });
    // filet de sécurité : tout ce qui est au-dessus du bas de l'écran est révélé (défilement rapide, ancre)
    var timer;
    var catchUp = function () {
      var fold = window.innerHeight;
      rvs.forEach(function (el) {
        if (!el.dataset.shown && el.getBoundingClientRect().top < fold) { show(el); io.unobserve(el); }
      });
    };
    window.addEventListener('scroll', function () { clearTimeout(timer); timer = setTimeout(catchUp, 120); }, { passive: true });
    catchUp();
  }

  /* Vidéos : chargées après la page, jamais si mouvement réduit ou économie de données */
  function setupVideo(v, eager) {
    if (!v || noVideo) return null;
    var mq = window.matchMedia(v.getAttribute('data-mq'));
    var userPaused = false, visible = true, loaded = false;
    function pick() { return mq.matches ? v.getAttribute('data-src') : v.getAttribute('data-src-m'); }
    function load() {
      loaded = true;
      v.src = pick();
      v.load();
      tryPlay();
    }
    function tryPlay() {
      if (userPaused || !visible || !loaded) return;
      var p = v.play();
      if (p && p.catch) p.catch(function () {});
    }
    v.addEventListener('playing', function () { v.classList.add('on'); });
    if (mq.addEventListener) mq.addEventListener('change', function () { if (loaded) { v.classList.remove('on'); load(); } });

    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (es) {
        es.forEach(function (e) {
          visible = e.isIntersecting;
          if (visible && !loaded && !eager) load();
          if (visible) tryPlay(); else v.pause();
        });
      }, { rootMargin: eager ? '0px' : '50% 0px' }).observe(v.parentNode);
    }
    if (eager) {
      if (d.readyState === 'complete') load();
      else window.addEventListener('load', load);
    }
    return {
      toggle: function () {
        userPaused = !userPaused;
        if (userPaused) v.pause(); else tryPlay();
        return userPaused;
      }
    };
  }

  var film = setupVideo(d.getElementById('film'), true);
  setupVideo(d.getElementById('sou'), false);

  var pp = d.querySelector('.playpause');
  if (film && pp) {
    pp.classList.add('ready');
    pp.addEventListener('click', function () {
      var paused = film.toggle();
      pp.setAttribute('aria-pressed', paused ? 'true' : 'false');
      pp.setAttribute('aria-label', paused ? 'Relancer le film' : 'Mettre le film en pause');
    });
  }

  /* Effets liés au défilement (sans épinglage) */
  function motion() {
    if (reduce || !window.gsap || !window.ScrollTrigger) return;
    gsap.registerPlugin(ScrollTrigger);
    var mm = gsap.matchMedia();
    mm.add('(min-width: 768px)', function () {
      gsap.fromTo('.film-in', { yPercent: 0 }, {
        yPercent: 12, ease: 'none',
        scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true }
      });
      gsap.fromTo('.word-mask img, .word-mask video', { yPercent: -8 }, {
        yPercent: 0, ease: 'none',
        scrollTrigger: { trigger: '.word', start: 'top bottom', end: 'bottom top', scrub: true }
      });
    });
    gsap.fromTo('.word', { scale: 1.35 }, {
      scale: 1, ease: 'none',
      scrollTrigger: { trigger: '.word', start: 'top bottom', end: 'bottom 55%', scrub: true }
    });
  }
  if (window.gsap) motion(); else window.addEventListener('load', motion);

  /* Formulaire (maquette : pas d'envoi réel) */
  var form = d.getElementById('form');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (form.site && form.site.value) return;
      if (!form.checkValidity()) { form.reportValidity(); return; }
      d.getElementById('ok').classList.add('show');
      form.reset();
    });
  }
})();
