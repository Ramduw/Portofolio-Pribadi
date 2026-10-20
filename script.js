/* JavaScript murni untuk progress scroll, animasi masuk, dan foto profil. */
(function () {
  'use strict';

  function setupScrollProgress() {
    const progressBar = document.getElementById('progress-bar');
    if (!progressBar) return;

    let ticking = false;
    function updateProgress() {
      const root = document.documentElement;
      const scrollableHeight = root.scrollHeight - window.innerHeight;
      const progress = scrollableHeight > 0 ? (window.scrollY / scrollableHeight) * 100 : 0;
      progressBar.style.width = Math.min(100, Math.max(0, progress)) + '%';
      ticking = false;
    }

    window.addEventListener('scroll', function () {
      if (!ticking) {
        window.requestAnimationFrame(updateProgress);
        ticking = true;
      }
    }, { passive: true });

    window.addEventListener('resize', updateProgress, { passive: true });
    updateProgress();
  }

  function showAllRevealElements(elements) {
    elements.forEach(function (element) {
      element.classList.add('visible');
    });
  }

  function setupScrollAnimations() {
    const revealElements = Array.from(document.querySelectorAll('.reveal'));
    if (!revealElements.length) return;

    const reducedMotion = typeof window.matchMedia === 'function'
      && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!('IntersectionObserver' in window) || reducedMotion) {
      showAllRevealElements(revealElements);
      return;
    }

    const revealObserver = new IntersectionObserver(function (entries, observer) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08 });

    revealElements.forEach(function (element) {
      revealObserver.observe(element);
    });
  }

  function setupImageFallback() {
    const profileFigure = document.querySelector('.profile-figure');
    const profileImage = document.querySelector('.profile-photo');
    if (!profileFigure || !profileImage) return;

    function setFallbackIfMissing() {
      if (profileImage.naturalWidth === 0) {
        profileFigure.classList.add('image-missing');
      } else {
        profileFigure.classList.remove('image-missing');
      }
    }

    profileImage.addEventListener('error', setFallbackIfMissing);
    profileImage.addEventListener('load', setFallbackIfMissing);
    if (profileImage.complete) setFallbackIfMissing();
  }

  document.addEventListener('DOMContentLoaded', function () {
    setupScrollProgress();
    setupScrollAnimations();
    setupImageFallback();
  });
})();
