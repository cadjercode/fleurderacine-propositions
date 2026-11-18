(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Révélations : IntersectionObserver + filet de sécurité au scroll
     (en scroll rapide l'IO peut rater des éléments qui traversent le viewport entre deux frames) */
  var pops = document.querySelectorAll('.pop');
  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.05 });
    pops.forEach(function (p) { io.observe(p); });
    var catchTimer;
    function catchMissed() {
      clearTimeout(catchTimer);
      catchTimer = setTimeout(function () {
        var fold = window.scrollY + window.innerHeight;
        pops.forEach(function (p) {
          if (p.classList.contains('in')) return;
          var top = p.getBoundingClientRect().top + window.scrollY;
          if (top < fold) { p.classList.add('in'); io.unobserve(p); }
        });
      }, 150);
    }
    window.addEventListener('scroll', catchMissed, { passive: true });
  } else { pops.forEach(function (p) { p.classList.add('in'); }); }

  /* Formulaire (maquette : pas d'envoi) */
  var form = document.getElementById('form');
  if (form) form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!form.checkValidity()) { form.reportValidity(); return; }
    if (form.site && form.site.value) return;
    document.getElementById('ok').classList.add('show');
  });

  if (!window.gsap || !window.ScrollTrigger || reduce) {
    document.querySelectorAll('.root path').forEach(function (p) { p.style.strokeDashoffset = 0; });
    var lv = document.getElementById('leaves'); if (lv) lv.classList.add('open');
    return;
  }
  gsap.registerPlugin(ScrollTrigger);

  var svg = document.getElementById('root');
  var story = document.getElementById('story');
  var leavesEl = document.getElementById('leaves');
  var NS = 'http://www.w3.org/2000/svg';
  var tweens = [];

  function pt(el) {
    var r = el.getBoundingClientRect(), s = story.getBoundingClientRect();
    if (el.id === 'leaves-base') { var l = leavesEl.getBoundingClientRect(); return { x: l.left - s.left + l.width / 2, y: l.bottom - s.top }; }
    if (el.id === 'noel-end') { var n = document.getElementById('noel').getBoundingClientRect(); return { x: r.left - s.left, y: n.bottom - s.top + 2 }; }
    return { x: r.left - s.left + r.width / 2, y: r.top - s.top + r.height / 2 };
  }
  function build() {
    tweens.forEach(function (t) { if (t.scrollTrigger) t.scrollTrigger.kill(); t.kill(); });
    tweens = [];
    svg.innerHTML = '';
    var w = story.offsetWidth, h = story.offsetHeight;
    svg.setAttribute('viewBox', '0 0 ' + w + ' ' + h);
    var els = Array.prototype.slice.call(story.querySelectorAll('[data-pt]'));
    var pts = els.map(pt);
    if (!pts.length) return;
    var d = 'M' + pts[0].x + ' 0 L' + pts[0].x + ' ' + pts[0].y;
    for (var i = 1; i < pts.length; i++) {
      var a = pts[i - 1], b = pts[i], m = (a.y + b.y) / 2;
      d += ' C' + a.x + ' ' + m + ' ' + b.x + ' ' + m + ' ' + b.x + ' ' + b.y;
    }
    var main = document.createElementNS(NS, 'path');
    main.setAttribute('class', 'main'); main.setAttribute('d', d); main.setAttribute('pathLength', '1');
    svg.appendChild(main);
    tweens.push(gsap.fromTo(main, { strokeDashoffset: 1 }, { strokeDashoffset: 0, ease: 'none',
      scrollTrigger: { trigger: story, start: 'top 60%', endTrigger: leavesEl, end: 'top 70%', scrub: 0.6 } }));
    /* ramifications : une radicelle par nœud */
    var wide = window.innerWidth >= 1024, L = wide ? 90 : 46, n = 0;
    els.forEach(function (el, i) {
      if (!el.classList.contains('node-dot')) return;
      var p = pts[i], dir = (n++ % 2) ? -1 : 1;
      if (!wide) dir = 1;
      var rl = document.createElementNS(NS, 'path');
      rl.setAttribute('class', 'rootlet'); rl.setAttribute('pathLength', '1');
      rl.setAttribute('d', 'M' + p.x + ' ' + p.y + ' c' + (dir * L * 0.1) + ' ' + (L * 0.5) + ' ' + (dir * L * 0.7) + ' ' + (L * 0.4) + ' ' + (dir * L) + ' ' + (L * 0.95));
      svg.appendChild(rl);
      tweens.push(gsap.fromTo(rl, { strokeDashoffset: 1 }, { strokeDashoffset: 0, ease: 'none',
        scrollTrigger: { trigger: el, start: 'top 70%', end: 'top 35%', scrub: 0.6 } }));
    });
  }
  build();
  var rebuilding = false;
  window.addEventListener('resize', function () {
    if (rebuilding) return; rebuilding = true;
    setTimeout(function () { build(); ScrollTrigger.refresh(); rebuilding = false; }, 250);
  });
  window.addEventListener('load', function () { build(); ScrollTrigger.refresh(); });

  /* trois feuilles qui s'ouvrent */
  ScrollTrigger.create({ trigger: leavesEl, start: 'top 72%', onEnter: function () { leavesEl.classList.add('open'); } });

  /* Hero : le galet grandit jusqu'au plein cadre, sans épinglage */
  var pebble = document.getElementById('pebble');
  var header = document.querySelector('.site-header');
  var fade = document.querySelectorAll('.hero-stage > h1, .hero-copy, .reassure');
  var mm = gsap.matchMedia();
  mm.add('(prefers-reduced-motion: no-preference)', function () {
    var dist = function () { return window.innerHeight * 0.55; };
    var cx = function () { return pebble.offsetLeft + pebble.offsetWidth / 2; };
    var cy = function () { return pebble.offsetTop + pebble.offsetHeight / 2; };
    var tl = gsap.timeline({ defaults: { ease: 'none' },
      scrollTrigger: { trigger: '.hero', start: 0, end: function () { return dist(); }, scrub: 0.5, invalidateOnRefresh: true } });
    tl.to(pebble, {
      scale: function () { return window.innerWidth >= 768 ? 2.6 : 2.5; },
      x: function () { return window.innerWidth / 2 - cx(); },
      y: function () { return dist() + (window.innerHeight - header.offsetHeight) / 2 - cy(); },
      transformOrigin: '50% 50%'
    }, 0);
    tl.to(fade, { y: -70, opacity: 0, stagger: 0.04, duration: 0.45 }, 0);
  });
})();
