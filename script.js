/* ============================================================
   Pipeline de Datos de Redes Sociales — landing
   Eduardo Guerrero · 2026
   ============================================================ */

(function () {
  'use strict';

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Reveal-on-scroll with optional delay ---------- */
  const revealEls = document.querySelectorAll('.reveal');

  if (prefersReduced || !('IntersectionObserver' in window)) {
    revealEls.forEach(el => el.classList.add('is-visible'));
  } else {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const delay = parseInt(el.dataset.delay || '0', 10);
        if (delay > 0) {
          setTimeout(() => el.classList.add('is-visible'), delay);
        } else {
          el.classList.add('is-visible');
        }
        io.unobserve(el);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    revealEls.forEach(el => io.observe(el));
  }

  /* ---------- Sticky-nav shadow on scroll ---------- */
  const nav = document.querySelector('.nav');
  if (nav) {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        nav.classList.toggle('is-scrolled', window.scrollY > 8);
        ticking = false;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---------- Animated counters ---------- */
  const counters = document.querySelectorAll('.counter');
  if (counters.length && !prefersReduced && 'IntersectionObserver' in window) {
    const animateCount = (el) => {
      const target = parseInt(el.dataset.target || '0', 10);
      if (!target) { el.textContent = '0'; return; }
      const duration = 1100;
      const start = performance.now();
      const tick = (now) => {
        const t = Math.min(1, (now - start) / duration);
        // easeOutCubic
        const eased = 1 - Math.pow(1 - t, 3);
        el.textContent = Math.round(target * eased).toString();
        if (t < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };

    const cIO = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        animateCount(entry.target);
        cIO.unobserve(entry.target);
      });
    }, { threshold: 0.5 });

    counters.forEach(c => cIO.observe(c));
  } else {
    counters.forEach(c => { c.textContent = c.dataset.target || '0'; });
  }

  /* ---------- Smooth-scroll offset for sticky header ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const id = link.getAttribute('href');
      if (!id || id === '#' || id.length < 2) return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const navH = nav ? nav.getBoundingClientRect().height : 0;
      const top = target.getBoundingClientRect().top + window.scrollY - navH - 12;
      window.scrollTo({ top, behavior: prefersReduced ? 'auto' : 'smooth' });
    });
  });

  /* ---------- "Back to top" button ---------- */
  const toTop = document.getElementById('toTop');
  if (toTop) {
    const toggle = () => {
      const visible = window.scrollY > 600;
      toTop.hidden = false;
      toTop.classList.toggle('is-visible', visible);
    };
    window.addEventListener('scroll', toggle, { passive: true });
    toTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: prefersReduced ? 'auto' : 'smooth' });
    });
    toggle();
  }

  /* ---------- Subtle parallax on hero orbs ---------- */
  if (!prefersReduced) {
    const orbs = document.querySelectorAll('.hero__orb');
    if (orbs.length) {
      let raf = null;
      const onMove = (e) => {
        if (raf) return;
        raf = requestAnimationFrame(() => {
          const x = (e.clientX / window.innerWidth - 0.5) * 18;
          const y = (e.clientY / window.innerHeight - 0.5) * 18;
          orbs[0].style.transform = `translate(${x}px, ${y}px)`;
          if (orbs[1]) orbs[1].style.transform = `translate(${-x}px, ${-y}px)`;
          raf = null;
        });
      };
      const hero = document.querySelector('.hero');
      if (hero) hero.addEventListener('pointermove', onMove);
    }
  }

  /* ---------- Active section highlight in nav ---------- */
  const sections = document.querySelectorAll('main section[id]');
  const navLinks = document.querySelectorAll('.nav__links a');
  if (sections.length && navLinks.length && 'IntersectionObserver' in window) {
    const map = new Map();
    navLinks.forEach(a => {
      const id = a.getAttribute('href');
      if (id && id.startsWith('#')) map.set(id.slice(1), a);
    });
    const sIO = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const link = map.get(entry.target.id);
        if (!link) return;
        if (entry.isIntersecting && entry.intersectionRatio > 0.4) {
          navLinks.forEach(a => a.style.color = '');
          link.style.color = '#fff';
        }
      });
    }, { threshold: [0.4, 0.6] });
    sections.forEach(s => sIO.observe(s));
  }

})();
