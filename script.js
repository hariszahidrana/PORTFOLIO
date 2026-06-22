// ===== Custom Cursor - Enhanced =====
(function () {
    const dot = document.querySelector('.cursor-dot');
    const trail = document.querySelector('.cursor-trail');
    if (!dot || window.matchMedia('(pointer: coarse)').matches) return;
  
    let tx = 0, ty = 0, x = 0, y = 0;
    let trailX = 0, trailY = 0;
    let isHovering = false;
    let vx = 0, vy = 0;
  
    document.addEventListener('mousemove', (e) => { tx = e.clientX; ty = e.clientY; });
  
    document.addEventListener('mouseover', (e) => {
      const t = e.target.closest('a, button, input, textarea, [data-hover], .service-card');
      isHovering = !!t;
      if (isHovering) dot.classList.add('hover');
      else dot.classList.remove('hover');
    });
  
    document.addEventListener('mousedown', () => dot.classList.add('click'));
    document.addEventListener('mouseup', () => dot.classList.remove('click'));
  
    function tick() {
      const ease = isHovering ? 0.18 : 0.22;
      const trailEase = 0.1;
  
      vx = (tx - x) * ease;
      vy = (ty - y) * ease;
      x += vx;
      y += vy;
  
      trailX += (tx - trailX) * trailEase;
      trailY += (ty - trailY) * trailEase;
  
      const speed = Math.hypot(vx, vy);
      const stretch = Math.min(speed * 0.12, 0.5);
      const angle = Math.atan2(vy, vx) * (180 / Math.PI);
  
      dot.style.transform = `translate(${x}px, ${y}px) translate(-50%,-50%) rotate(${angle}deg) scaleX(${1 + stretch}) scaleY(${1 - stretch * 0.5})`;
  
      if (trail) {
        trail.style.transform = `translate(${trailX}px, ${trailY}px) translate(-50%,-50%)`;
        trail.style.opacity = Math.min(speed * 0.04, 0.35);
      }
  
      requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  })();
  
  // ===== Scroll Reveal - Enhanced =====
  (function () {
    const els = document.querySelectorAll('.reveal');
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      }),
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    els.forEach((el) => io.observe(el));
  
    // Stagger child reveals
    document.querySelectorAll('.reveal-group').forEach(group => {
      group.querySelectorAll('.reveal').forEach((el, i) => {
        el.style.transitionDelay = `${i * 80}ms`;
      });
    });
  })();
  
  // ===== Smooth Scroll with Momentum =====
  (function () {
    let currentY = 0, targetY = 0, rafId = null;
    const ease = 0.09;
  
    function smoothScroll() {
      currentY += (targetY - currentY) * ease;
      const diff = Math.abs(targetY - currentY);
      if (diff < 0.5) {
        currentY = targetY;
        rafId = null;
        return;
      }
      window.scrollTo(0, currentY);
      rafId = requestAnimationFrame(smoothScroll);
    }
  
    // Only on desktop — don't override mobile scroll
    if (window.matchMedia('(pointer: fine)').matches) {
      currentY = window.scrollY;
      targetY = window.scrollY;
  
      window.addEventListener('wheel', (e) => {
        e.preventDefault();
        targetY = Math.max(0, Math.min(targetY + e.deltaY * 1.2, document.body.scrollHeight - window.innerHeight));
        if (!rafId) rafId = requestAnimationFrame(smoothScroll);
      }, { passive: false });
  
      window.addEventListener('scroll', () => {
        if (!rafId) currentY = targetY = window.scrollY;
      }, { passive: true });
    }
  })();
  
  // ===== Nav Hide on Scroll =====
  (function () {
    let lastY = 0;
    const header = document.querySelector('header');
    if (!header) return;
    window.addEventListener('scroll', () => {
      const y = window.scrollY;
      if (y > lastY && y > 80) header.style.transform = 'translateY(-100%)';
      else header.style.transform = 'translateY(0)';
      lastY = y;
    }, { passive: true });
  })();
  
  // ===== Mobile Menu =====
  (function () {
    const menuBtn = document.getElementById('menu-btn');
    const closeBtn = document.getElementById('menu-close');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileLinks = mobileMenu?.querySelectorAll('a');
  
    if (!menuBtn || !closeBtn || !mobileMenu) return;
  
    menuBtn.addEventListener('click', () => mobileMenu.classList.remove('hidden'));
    closeBtn.addEventListener('click', () => mobileMenu.classList.add('hidden'));
    mobileLinks?.forEach((a) => a.addEventListener('click', () => mobileMenu.classList.add('hidden')));
  })();
  
  // ===== Eye Tracking =====
  (function () {
    function setupFace(faceEl, size) {
      const eyes = faceEl.querySelectorAll('.eye');
      const maxMove = size * 0.05;
  
      function move(mx, my) {
        eyes.forEach((eye) => {
          const pupil = eye.querySelector('.pupil');
          if (!pupil) return;
          const r = eye.getBoundingClientRect();
          const cx = r.left + r.width / 2;
          const cy = r.top + r.height / 2;
          const dx = mx - cx;
          const dy = my - cy;
          const dist = Math.hypot(dx, dy);
          const clamped = Math.min(dist, maxMove * 6) / (maxMove * 6);
          const angle = Math.atan2(dy, dx);
          const px = Math.cos(angle) * maxMove * (0.4 + clamped * 0.6);
          const py = Math.sin(angle) * maxMove * (0.4 + clamped * 0.6);
          pupil.style.transform = `translate(${px}px, ${py}px)`;
        });
      }
  
      let raf = 0;
      window.addEventListener('mousemove', (e) => {
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(() => move(e.clientX, e.clientY));
      });
    }
  
    const faceDesktop = document.getElementById('face-desktop');
    const faceMobile = document.getElementById('face-mobile');
    if (faceDesktop) setupFace(faceDesktop, 220);
    if (faceMobile) setupFace(faceMobile, 160);
  })();
  
  // ===== Service Card Hover Smile =====
  (function () {
    const mouths = document.querySelectorAll('.mouth-path');
    const cards = document.querySelectorAll('.service-card');
  
    cards.forEach((card) => {
      card.addEventListener('mouseenter', () => {
        mouths.forEach((m) => {
          m.setAttribute('d', 'M 8 6 Q 40 42 72 6');
          m.setAttribute('stroke-width', '5');
          m.setAttribute('fill', 'rgba(26,26,26,0.9)');
        });
      });
      card.addEventListener('mouseleave', () => {
        mouths.forEach((m) => {
          m.setAttribute('d', 'M 22 18 Q 40 22 58 18');
          m.setAttribute('stroke-width', '4');
          m.setAttribute('fill', 'none');
        });
      });
    });
  })();
  
  // ===== Service Cards — Ambient Floating =====
  (function () {
    const cards = document.querySelectorAll('.service-card');
    cards.forEach((card, i) => {
      const delay = i * 0.6;
      const duration = 3 + (i % 3) * 0.8;
      card.style.animation = `cardFloat ${duration}s ease-in-out ${delay}s infinite`;
    });
  })();
  
  // ===== Parallax Sections =====
  (function () {
    const bgText = document.querySelector('.bg-portfolio');
    if (!bgText) return;
    window.addEventListener('scroll', () => {
      const y = window.scrollY;
      bgText.style.transform = `translateY(${y * 0.15}px)`;
    }, { passive: true });
  })();