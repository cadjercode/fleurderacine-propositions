/* Fleur de Racine — proposition E « L'Atelier » */
(function () {
  'use strict';
  var d = document;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var conn = navigator.connection || {};
  var noVideo = reduce || conn.saveData === true;

  /* Révélations à sens unique et garanties (rideaux, masques de ligne) */
  var rvs = [].slice.call(d.querySelectorAll('.rv, .step'));
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
    }, { rootMargin: '0px 0px -20% 0px' });
    rvs.forEach(function (el) { io.observe(el); });
    var timer;
    var catchUp = function () {
      var fold = window.innerHeight;
      rvs.forEach(function (el) {
        if (!el.dataset.shown && el.getBoundingClientRect().top < fold * 0.8) { show(el); io.unobserve(el); }
      });
    };
    window.addEventListener('scroll', function () { clearTimeout(timer); timer = setTimeout(catchUp, 120); }, { passive: true });
    catchUp();
  }

  /* Quatre vidéos de l'atelier : chargées à l'approche, lues seulement si visibles à 40 % */
  var vids = [].slice.call(d.querySelectorAll('.frame video'));
  var toggle = d.querySelector('.vidtoggle');
  if (!noVideo && vids.length && 'IntersectionObserver' in window) {
    var mq = window.matchMedia('(min-width: 768px)');
    var userPaused = false;
    var src = function (v) { return mq.matches ? v.getAttribute('data-src') : v.getAttribute('data-src-m'); };
    var play = function (v) { if (userPaused || !v.dataset.visible) return; var p = v.play(); if (p && p.catch) p.catch(function () {}); };
    vids.forEach(function (v) { v.addEventListener('playing', function () { v.classList.add('on'); }); });
    var near = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return;
        var v = e.target.querySelector('video');
        if (!v.src) { v.src = src(v); v.load(); }
        near.unobserve(e.target);
      });
    }, { rootMargin: '100% 0px' });
    // au plus deux vidéos en lecture : les deux cadres les plus visibles (≥ 40 %)
    var ratios = new Map();
    var seen = new IntersectionObserver(function (es) {
      es.forEach(function (e) { ratios.set(e.target.querySelector('video'), e.intersectionRatio); });
      var top2 = vids.filter(function (v) { return (ratios.get(v) || 0) >= 0.4; })
        .sort(function (a, b) { return ratios.get(b) - ratios.get(a); }).slice(0, 2);
      vids.forEach(function (v) {
        if (top2.indexOf(v) > -1) { v.dataset.visible = '1'; play(v); }
        else { delete v.dataset.visible; v.pause(); }
      });
    }, { threshold: [0, 0.2, 0.4, 0.6, 0.8, 1] });
    vids.forEach(function (v) { near.observe(v.parentNode); seen.observe(v.parentNode); });
    if (toggle) {
      toggle.classList.add('ready');
      toggle.addEventListener('click', function () {
        userPaused = !userPaused;
        vids.forEach(function (v) { if (userPaused) v.pause(); else play(v); });
        toggle.setAttribute('aria-pressed', userPaused ? 'true' : 'false');
        toggle.querySelector('span').textContent = userPaused ? 'Relancer les vidéos' : 'Mettre les vidéos en pause';
      });
    }
  }

  /* Parallaxe douce de la photo d'accueil (ordinateur seulement, sans épinglage) */
  function motion() {
    if (reduce || !window.gsap || !window.ScrollTrigger) return;
    gsap.registerPlugin(ScrollTrigger);
    gsap.matchMedia().add('(min-width: 1024px)', function () {
      gsap.fromTo('.hero-photo picture', { yPercent: 0 }, {
        yPercent: 15, ease: 'none',
        scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true }
      });
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
