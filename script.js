(function(){
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var lenis = null;
  if (!reduce && window.Lenis) {
    lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
    var raf = function(t){ lenis.raf(t); requestAnimationFrame(raf); };
    requestAnimationFrame(raf);
  }
  document.querySelectorAll('a[href^="#"]').forEach(function(a){
    a.addEventListener('click', function(e){
      var id = a.getAttribute('href');
      if (id.length < 2) return;
      var el = document.querySelector(id);
      if (!el) return;
      e.preventDefault();
      if (lenis) lenis.scrollTo(el, { offset: -92 });
      else el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
    });
  });
  var io = new IntersectionObserver(function(es){
    es.forEach(function(en){ if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('.rv').forEach(function(el){ io.observe(el); });
  document.getElementById('yr').textContent = new Date().getFullYear();
  var mb = document.getElementById('menuBtn'), mm = document.getElementById('mMenu');
  mb.addEventListener('click', function(){ var o = mm.classList.toggle('open'); mb.textContent = o ? '✕' : '☰'; });
  mm.querySelectorAll('a').forEach(function(a){ a.addEventListener('click', function(){ mm.classList.remove('open'); mb.textContent = '☰'; }); });
  document.querySelectorAll('.faq details').forEach(function(d){
    d.querySelector('summary').addEventListener('click', function(){
      document.querySelectorAll('.faq details[open]').forEach(function(o){ if (o !== d) o.removeAttribute('open'); });
    });
  });
  var spy = new IntersectionObserver(function(es){
    es.forEach(function(en){
      if (en.isIntersecting) {
        document.querySelectorAll('.links a').forEach(function(a){
          a.classList.toggle('active', a.getAttribute('href') === '#' + en.target.id);
        });
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });
  ['demo','free','faq'].forEach(function(id){ var s = document.getElementById(id); if (s) spy.observe(s); });
  var head = document.querySelector('header');
  var stage = document.getElementById('zoomStage'), frame = document.getElementById('zoomFrame');
  var ticking = false;
  var mqM = window.matchMedia('(max-width: 760px)');
  var zoom = function(){
    ticking = false;
    if (!stage || !frame || reduce || !mqM.matches) { if (frame) { frame.style.transform = ''; frame.style.borderRadius = ''; } return; }
    var r = stage.getBoundingClientRect();
    var vh = window.innerHeight;
    var total = stage.offsetHeight - vh;
    var p = total > 0 ? Math.min(1, Math.max(0, -r.top / total)) : 1;
    var e = p < .5 ? 2*p*p : 1 - Math.pow(-2*p+2, 2)/2;
    var full = Math.min(window.innerWidth / frame.offsetWidth, window.innerHeight / frame.offsetHeight, 1.12);
    var s = 0.82 + (full - 0.82) * e;
    frame.style.transform = 'scale(' + s.toFixed(4) + ')';
    frame.style.borderRadius = Math.round(32 * (1 - e)) + 'px';
  };
  var onZoomScroll = function(){ if (!ticking) { ticking = true; requestAnimationFrame(fx); } };
  var band = document.querySelector('.band');
  var zoomBand = function(){
    if (!band || reduce) return;
    var r = band.getBoundingClientRect();
    var vh = window.innerHeight;
    var p = Math.min(1, Math.max(0, (vh - r.top) / (vh * 0.75)));
    var e = p < .5 ? 2*p*p : 1 - Math.pow(-2*p+2, 2)/2;
    band.style.transform = 'scale(' + (0.9 + 0.1 * e).toFixed(4) + ')';
  };
  var fx = function(){
    ticking = false;
    zoom();
    zoomBand();
    bounceIcons();
  };
  var track = document.getElementById('iconTrack');
  if (track) track.innerHTML += track.innerHTML;
  var icons = track ? track.children : [];
  var bounceIcons = function(){
    if (!icons.length || reduce) return;
    var r = track.getBoundingClientRect();
    if (r.bottom < 0 || r.top > window.innerHeight) return;
    var y = window.scrollY;
    for (var i = 0; i < icons.length; i++) {
      icons[i].style.transform = 'translateY(' + Math.round(Math.sin(y * 0.008 + i * 0.7) * 14) + 'px)';
    }
  };
  var rotWords = ['helps','plans','reminds','cleans','sorts'];
  var rotEl = document.getElementById('rotWord'), ri = 0;
  if (rotEl && !reduce) {
    setInterval(function(){
      rotEl.style.transform = 'translateY(-110%)';
      rotEl.style.opacity = '0';
      setTimeout(function(){
        ri = (ri + 1) % rotWords.length;
        rotEl.textContent = rotWords[ri];
        rotEl.style.transition = 'none';
        rotEl.style.transform = 'translateY(110%)';
        void rotEl.offsetHeight;
        rotEl.style.transition = '';
        rotEl.style.transform = 'translateY(0)';
        rotEl.style.opacity = '1';
      }, 700);
    }, 3000);
  }
  var typedEl = document.getElementById('typedOut');
  var typedTxt = 'Sanat helps you every day — reminders, plans, replies and more, just by speaking.';
  var typedDone = false;
  var typeIt = function(){
    if (typedDone || !typedEl) return;
    typedDone = true;
    var i = 0;
    var iv = setInterval(function(){
      typedEl.textContent = typedTxt.slice(0, ++i);
      if (i >= typedTxt.length) clearInterval(iv);
    }, 22);
  };
  if (typedEl) {
    var tio = new IntersectionObserver(function(es){
      es.forEach(function(en){ if (en.isIntersecting) { typeIt(); tio.disconnect(); } });
    }, { threshold: 0.3 });
    tio.observe(typedEl);
  }
  window.addEventListener('scroll', onZoomScroll, { passive: true });
  window.addEventListener('resize', onZoomScroll);
  zoom();
  var onScroll = function(){ head.classList.toggle('scrolled', window.scrollY > 8); };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();
