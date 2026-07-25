/* ==========================================================================
   ВЯЗАЙКА — main.js
   Страничная логика: хедер, мобильное меню, фильтры галереи.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', function () {

  // ── Header: фон при скролле ──
  var header = document.getElementById('siteHeader');
  if (header) {
    var onScroll = function () { header.classList.toggle('is-scrolled', window.scrollY > 20); };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  // ── Мобильное меню ──
  var burgerBtn = document.getElementById('burgerBtn');
  var mobileMenu = document.getElementById('mobileMenu');
  var mobileMenuClose = document.getElementById('mobileMenuClose');

  function openMobileMenu() {
    mobileMenu.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }
  function closeMobileMenu() {
    mobileMenu.classList.remove('is-open');
    document.body.style.overflow = '';
  }

  if (burgerBtn && mobileMenu) {
    burgerBtn.addEventListener('click', openMobileMenu);
    mobileMenuClose.addEventListener('click', closeMobileMenu);
    mobileMenu.querySelectorAll('.mobile-menu__link').forEach(function (link) {
      link.addEventListener('click', closeMobileMenu);
    });
  }

  // ── Видео в карточках галереи: играет при наведении ──
  document.querySelectorAll('.gallery-card--video').forEach(function (card) {
    var video = card.querySelector('.gallery-card__video');
    if (!video) return;

    card.addEventListener('mouseenter', function () {
      card.classList.add('is-playing');
      video.currentTime = 0;
      video.play().catch(function () {});
    });

    card.addEventListener('mouseleave', function () {
      card.classList.remove('is-playing');
      video.pause();
    });
  });

  // ── Атмосферное видео: играет только когда секция видна ──
  var atmosphereVideo = document.querySelector('.atmosphere__video');
  if (atmosphereVideo && window.IntersectionObserver) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          atmosphereVideo.play().catch(function () {});
        } else {
          atmosphereVideo.pause();
        }
      });
    }, { threshold: 0.25 });
    io.observe(atmosphereVideo);
  }

  // ── Разворачивание длинных историй ──
  document.querySelectorAll('.story__toggle').forEach(function (btn) {
    var text = btn.previousElementSibling;
    var label = btn.querySelector('.story__toggle-label');
    if (!text || !label) return;

    btn.addEventListener('click', function () {
      var expanded = text.classList.toggle('is-expanded');
      label.textContent = expanded ? 'Свернуть' : 'Читать дальше';
    });
  });

  // ── Фильтры галереи ──
  var galleryFilters = document.getElementById('galleryFilters');
  var galleryGrid = document.getElementById('galleryGrid');

  if (galleryFilters && galleryGrid) {
    var cards = galleryGrid.querySelectorAll('.gallery-card');
    var reduceMotion = window.VYAZAIKA ? window.VYAZAIKA.reduceMotion : false;

    galleryFilters.addEventListener('click', function (e) {
      var btn = e.target.closest('.gallery__filter');
      if (!btn) return;

      galleryFilters.querySelectorAll('.gallery__filter').forEach(function (f) { f.classList.remove('is-active'); });
      btn.classList.add('is-active');

      var filter = btn.dataset.filter;
      var toShow = [];
      var toHide = [];

      cards.forEach(function (card) {
        var show = filter === 'all' || card.dataset.category === filter;
        (show ? toShow : toHide).push(card);
      });

      if (reduceMotion || !window.gsap) {
        toHide.forEach(function (c) { c.classList.add('is-hidden'); });
        toShow.forEach(function (c) { c.classList.remove('is-hidden'); });
        return;
      }

      gsap.to(toHide, {
        opacity: 0, scale: 0.92, duration: 0.25, ease: 'power2.in',
        onComplete: function () { toHide.forEach(function (c) { c.classList.add('is-hidden'); }); }
      });

      toShow.forEach(function (c) { c.classList.remove('is-hidden'); });
      gsap.fromTo(toShow,
        { opacity: 0, scale: 0.92 },
        { opacity: 1, scale: 1, duration: 0.4, ease: 'power2.out', stagger: 0.03, delay: 0.15 }
      );
    });
  }

});
