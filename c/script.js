/* Fleur de Racine — direction c : tout se « pose » (GSAP + ScrollTrigger, transform/opacity uniquement) */
(function () {
  var root = document.documentElement;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Formulaire (démo : pas d'envoi réel) */
  var form = document.getElementById('order');
  if (form) {
    var d = document.getElementById('date');
    if (d) { var t = new Date(); t.setDate(t.getDate() + 3); d.min = t.toISOString().slice(0, 10); }
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (form.site && form.site.value) return;
      if (!form.checkValidity()) { form.reportValidity(); return; }
      document.getElementById('ok').hidden = false;
    });
  }

  if (!window.gsap || !window.ScrollTrigger) { root.classList.remove('js'); return; }
  gsap.registerPlugin(ScrollTrigger);
  var mm = gsap.matchMedia();

  mm.add('(prefers-reduced-motion: no-preference)', function () {
    /* ---- Hero : l'étiquette se colle, la machine à écrire, les polaroids tombent ---- */
    var tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    tl.fromTo('.label', { opacity: 0, y: -24, scale: .94 }, { opacity: 1, y: 0, scale: 1, duration: .5, ease: 'back.out(1.2)' }, 0)
      .to('.sub', { opacity: 1, duration: .01 }, .35)
      .to('.sub', { clipPath: 'inset(0 0% 0 0)', duration: 60 * 0.04, ease: 'steps(60)' }, .35)
      .to('.cta-row', { opacity: 1, duration: .5 }, .5)
      .to('.reassure', { opacity: 1, duration: .5 }, .8);
    var pols = gsap.utils.toArray('.field .pol-in');
    pols.forEach(function (el, i) {
      var r = (i % 2 ? 1 : -1) * (10 + (i * 3) % 9);
      tl.fromTo(el, { opacity: 0, y: -190, rotation: r, scale: 1.14 },
        { opacity: 1, y: 0, rotation: 0, scale: 1, duration: .75, ease: 'back.out(1.1)', clearProps: 'transform' }, .5 + i * .27);
    });
    tl.add(function () {
      if (window.VanillaTilt && window.matchMedia('(hover:hover) and (min-width:1024px)').matches) {
        VanillaTilt.init(document.querySelectorAll('.field .pol .pol-in'), { max: 5, speed: 400, scale: 1, glare: false });
      }
    });

    /* ---- Révélations « pop in » avec rotation finale, jamais alignées ---- */
    ScrollTrigger.batch('.reveal', {
      once: true, start: 'top 90%',
      onEnter: function (els) {
        els.forEach(function (el, i) {
          var rot = gsap.getProperty(el, 'rotation');
          gsap.fromTo(el, { opacity: 0, y: 36, rotation: (i % 2 ? 2.5 : -2.5), scale: .96 },
            { opacity: 1, y: 0, rotation: 0, scale: 1, duration: .8, delay: i * .1, ease: 'back.out(1.1)', clearProps: 'transform' });
        });
      }
    });

    /* ---- Moment waouh : trame halftone -> photo, au scroll normal, sans épinglage ---- */
    var cards = gsap.utils.toArray('.ncard');
    var mobile = window.matchMedia('(max-width: 767px)').matches;
    cards.forEach(function (c, i) {
      var st = { trigger: c, start: mobile ? 'top 92%' : 'top 95%', end: mobile ? 'top 45%' : 'top 35%', scrub: .3 + i * .12 };
      gsap.fromTo(c.querySelector('.ht'), { opacity: 1 }, { opacity: 0, ease: 'none', scrollTrigger: st });
      gsap.fromTo(c.querySelector('.tape'), { rotation: 6 }, { rotation: 2, ease: 'none', scrollTrigger: st });
    });

    /* ---- Compteur tapé à la machine sur l'étiquette tampon ---- */
    var cnt = document.querySelector('#counter span');
    if (cnt) {
      var full = cnt.getAttribute('data-type'), o = { n: 0 };
      ScrollTrigger.create({
        trigger: '#counter', start: 'top 92%', once: true,
        onEnter: function () {
          cnt.textContent = '';
          gsap.to(o, { n: full.length, duration: full.length * .06, ease: 'none', delay: .25,
            onUpdate: function () { cnt.textContent = full.slice(0, Math.round(o.n)); },
            onComplete: function () { cnt.textContent = full; } });
        }
      });
    }
  });
})();
