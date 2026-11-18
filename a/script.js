/* Fleur de Racine, direction A « La Carte » : GSAP + ScrollTrigger, transform / opacity / clip-path uniquement. */
(function () {
  'use strict';
  var root = document.documentElement;

  /* Compte à rebours vrai : jours restants avant le 12 décembre 2026 (fin de journée) */
  var daysEl = document.getElementById('days');
  var days = 0;
  if (daysEl) {
    var target = new Date(2026, 11, 12, 23, 59, 59);
    days = Math.max(0, Math.ceil((target - new Date()) / 86400000));
    daysEl.textContent = String(days);
  }

  /* Formulaire : date minimale = aujourd'hui + 3 jours, confirmation locale (maquette) */
  var dateEl = document.getElementById('date');
  if (dateEl) {
    var d = new Date(); d.setDate(d.getDate() + 3);
    dateEl.min = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  }
  var form = document.getElementById('form-commande');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!form.checkValidity()) { form.reportValidity(); return; }
      var hp = document.getElementById('site');
      if (hp && hp.value) return;
      document.getElementById('form-ok').classList.add('show');
      form.reset();
    });
  }

  if (!window.gsap || !window.ScrollTrigger) { root.classList.remove('js'); return; }
  root.classList.add('js');
  gsap.registerPlugin(ScrollTrigger);
  var EXPO = 'expo.out';
  var mm = gsap.matchMedia();

  mm.add('(prefers-reduced-motion: no-preference)', function () {
    /* ---------- Hero : typographie cinétique puis ouverture de la grille ---------- */
    var tl = gsap.timeline({ defaults: { ease: EXPO } });
    tl.to('.hero-lines', { clipPath: 'inset(0 0% 0 0)', duration: 0.9 }, 0)
      .to('.h1-a .w > span', { y: 0, yPercent: 0, duration: 0.9, stagger: 0.07 }, 0.1)
      .to('.h1-b .w > span', { y: 0, yPercent: 0, duration: 0.8, stagger: 0.05 }, 0.45)
      .to('.hero-rv', { opacity: 1, y: 0, duration: 0.8, stagger: 0.1 }, 0.7)
      .to('.hero .cell', { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.7, stagger: 0.18 }, 1.0)
      .fromTo('.hero .cell img', { scale: 1.18 }, { scale: 1, duration: 1.1, stagger: 0.18, immediateRender: false }, 1.0);


    /* ---------- Transformation du hero au scroll normal (sans épinglage) ---------- */
    var heroEl = document.querySelector('.hero');
    var bigCell = document.querySelector('.hero .cell.big');
    var wide = window.matchMedia('(min-width: 64rem)').matches;
    var out = gsap.timeline({ defaults: { ease: 'none' }, scrollTrigger: { trigger: heroEl, start: 'top top', end: 'bottom 15%', scrub: 0.5 } });
    /* Le texte et les boutons restent lisibles la première moitié du défilement : ils ne s'estompent qu'en fin de course,
       quand le hero sort déjà de l'écran (sinon ils disparaissent dès qu'on touche la molette). */
    /* fromTo avec un départ explicite « visible » : en remontant, tout revient toujours visible,
       même si la page a été rechargée au milieu (l'état de départ n'est plus lu au hasard du chargement). */
    out.fromTo('.hero-copy', { opacity: 1, y: 0 }, { opacity: 0, y: -60, duration: 0.4, immediateRender: false }, 0.6)
       .fromTo('.hero .collage .cell.sm', { opacity: 1, y: 0 }, { opacity: 0, y: -40, duration: 0.4, immediateRender: false }, 0.5)
       .fromTo('.hero-lines', { opacity: 1 }, { opacity: 0, duration: 0.4, immediateRender: false }, 0.6);
    if (wide && bigCell) {
      out.to(bigCell, { scale: 1.45, xPercent: -12, transformOrigin: '50% 40%', duration: 0.65 }, 0.35);
    }
    /* La photo s'ouvre ensuite en plein cadre : clip-path de la forme de la cellule vers tout l'écran */
    ScrollTrigger.create({ trigger: '.opening', start: 'top 92%', end: 'top 8%', scrub: 0.5,
      animation: gsap.fromTo('.opening .frame-img', { clipPath: 'inset(10% 36% 10% 36%)' }, { clipPath: 'inset(0% 0% 0% 0%)', ease: 'none' }) });
    gsap.fromTo('.opening .frame-img img', { scale: 1.2 }, { scale: 1, ease: 'none', immediateRender: false, scrollTrigger: { trigger: '.opening', start: 'top 92%', end: 'bottom 40%', scrub: 0.5 } });
    var showCap = function () { gsap.to('.opening .cap', { opacity: 1, y: 0, duration: 0.7, ease: EXPO }); };
    ScrollTrigger.create({ trigger: '.opening', start: 'top 35%', once: true, onEnter: showCap, onLeave: showCap });

    /* Parallaxe de souris, 6 px, ordinateur seulement */
    var fine = window.matchMedia('(hover: hover) and (pointer: fine) and (min-width: 64rem)');
    var onMove = null;
    if (fine.matches) {
      var cells = gsap.utils.toArray('.hero .collage .cell');
      var setters = cells.map(function (c, i) {
        var k = i === 0 ? 0.6 : (i % 2 ? 1 : -1);
        return { x: gsap.quickTo(c, 'x', { duration: 0.6, ease: 'power3.out' }), y: gsap.quickTo(c, 'y', { duration: 0.6, ease: 'power3.out' }), k: k };
      });
      onMove = function (e) {
        var nx = e.clientX / window.innerWidth - 0.5, ny = e.clientY / window.innerHeight - 0.5;
        setters.forEach(function (s) { s.x(nx * 12 * s.k); s.y(ny * 12 * s.k); });
      };
      window.addEventListener('pointermove', onMove, { passive: true });
    }

    /* ---------- Révélations en cascade (signature : masque bas vers haut, 700 ms, expo) ---------- */
    gsap.utils.toArray('.hr').forEach(function (hr) {
      var drawHr = function () { gsap.to(hr, { scaleX: 1, duration: 0.9, ease: EXPO }); };
      ScrollTrigger.create({ trigger: hr, start: 'top 92%', once: true, onEnter: drawHr, onLeave: drawHr });
    });
    /* Révélation à sens unique et garantie : un élément révélé ne se recache jamais
       (l'ancien clearProps rendait la main au CSS qui masque, d'où les blancs et les blocs cachés en remontant),
       et un élément dépassé par un scroll rapide est révélé quand même (onLeave / onEnterBack). */
    function fresh(els) { return els.filter(function (e) { if (e.dataset.shown) return false; e.dataset.shown = '1'; return true; }); }
    function showRv(els) {
      els = fresh(els); if (!els.length) return;
      gsap.to(els, { opacity: 1, y: 0, clipPath: 'inset(0% 0% 0% 0%)', duration: 0.6, stagger: 0.07, ease: EXPO,
        onComplete: function () { gsap.set(els, { clipPath: 'none' }); } });
    }
    function showCells(els) {
      els = fresh(els); if (!els.length) return;
      gsap.to(els, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.6, stagger: 0.1, ease: EXPO });
      els.forEach(function (el) { gsap.fromTo(el.querySelectorAll('img'), { scale: 1.15 }, { scale: 1, duration: 1, ease: EXPO }); });
    }
    ScrollTrigger.batch('.rv', { start: 'top 92%', onEnter: showRv, onLeave: showRv, onEnterBack: showRv });
    ScrollTrigger.batch('.rv-cell', { start: 'top 92%', onEnter: showCells, onLeave: showCells, onEnterBack: showCells });

    /* Compteur de jours (number ticker) */
    if (daysEl) {
      var o = { v: 0 };
      var tick = function () {
        if (daysEl.dataset.shown) return; daysEl.dataset.shown = '1';
        daysEl.textContent = '0';
        gsap.to(o, { v: days, duration: 1.4, ease: 'power3.out', onUpdate: function () { daysEl.textContent = String(Math.round(o.v)); } });
      };
      ScrollTrigger.create({ trigger: daysEl, start: 'top 88%', once: true, onEnter: tick, onLeave: tick });
    }

    /* ---------- Règle des 72 h ---------- */
    var steps = gsap.utils.toArray('.step');
    var opened = [];
    function open(i) {
      if (opened[i]) return; opened[i] = true;
      var st = steps[i];
      st.classList.add('on');
      var n = st.querySelector('.n'), to = +n.dataset.to, o2 = { v: 0 };
      n.textContent = '0';
      gsap.to(o2, { v: to, duration: 0.9, ease: 'power3.out', onUpdate: function () { n.textContent = String(Math.round(o2.v)); } });
      gsap.to(st.querySelector('.cell'), { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.7, ease: EXPO });
      gsap.fromTo(st.querySelector('.cell img'), { scale: 1.15 }, { scale: 1, duration: 1.1, ease: EXPO });
      gsap.to(st.querySelectorAll('.step-in'), { opacity: 1, y: 0, duration: 0.7, stagger: 0.1, delay: 0.25, ease: EXPO });
    }
    var track = document.getElementById('track');

    var mq = gsap.matchMedia();
    mq.add('(min-width: 768px)', function () {
      var thr = [0, 0.25, 0.5, 0.75];
      gsap.to('.rule-h path', { strokeDashoffset: 0, ease: 'none', scrollTrigger: {
        trigger: track, start: 'top 68%', end: 'bottom 62%', scrub: 0.4,
        onUpdate: function (self) { thr.forEach(function (t, i) { if (self.progress >= t) open(i); }); }
      } });
      ScrollTrigger.create({ trigger: track, start: 'top 68%', once: true, onEnter: function () { open(0); },
        onLeave: function () { steps.forEach(function (s, i) { open(i); }); } });
    });
    mq.add('(max-width: 767px)', function () {
      gsap.to('.rule-v path', { strokeDashoffset: 0, ease: 'none', scrollTrigger: { trigger: track, start: 'top 78%', end: 'bottom 78%', scrub: 0.4 } });
      steps.forEach(function (st, i) {
        ScrollTrigger.create({ trigger: st, start: 'top 78%', once: true, onEnter: function () { open(i); }, onLeave: function () { open(i); } });
      });
    });

    return function () { if (onMove) window.removeEventListener('pointermove', onMove); };
  });
})();
