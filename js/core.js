/* ==========================================================================
   ВЯЗАЙКА — core.js
   Общая логика анимаций. Использует глобальные gsap/ScrollTrigger,
   подключённые как обычные <script> (без сборщика, без npm).
   ========================================================================== */

window.VYAZAIKA = (function () {
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function initReveal() {
    if (reduceMotion || !window.gsap || !window.ScrollTrigger) {
      document.querySelectorAll('[data-reveal], [data-reveal-group] > *').forEach(function (el) {
        el.style.opacity = '1';
        el.style.transform = 'none';
      });
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    document.querySelectorAll('[data-reveal]').forEach(function (el) {
      gsap.from(el, {
        opacity: 0,
        y: 44,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 84%', once: true }
      });
    });

    document.querySelectorAll('[data-reveal-group]').forEach(function (group) {
      var items = group.querySelectorAll(':scope > *');
      gsap.from(items, {
        opacity: 0,
        y: 36,
        scale: 0.96,
        duration: 0.7,
        ease: 'power3.out',
        stagger: { each: 0.08, from: 'start' },
        scrollTrigger: { trigger: group, start: 'top 85%', once: true }
      });
    });
  }

  function initHowLine() {
    var fill = document.getElementById('howLineFill');
    if (!fill || reduceMotion || !window.gsap || !window.ScrollTrigger) return;

    gsap.to(fill, {
      scaleY: 1,
      ease: 'none',
      scrollTrigger: {
        trigger: '.how__timeline',
        start: 'top 60%',
        end: 'bottom 70%',
        scrub: true
      }
    });
  }

  function initAll() {
    initReveal();
    initHowLine();
  }

  return { initAll: initAll, reduceMotion: reduceMotion };
})();

document.addEventListener('DOMContentLoaded', function () {
  window.VYAZAIKA.initAll();
});
