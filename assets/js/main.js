document.addEventListener('DOMContentLoaded', () => {
  AOS.init({ duration: 700, once: true, offset: 60 });

  initNavbar();
  initMobileMenu();
  initLanguageSwitcher();
  initHeroCanvas();
  initSmoothScroll();
  initScrollProgress();
  initTabs();
});

// ===== NAVBAR =====
function initNavbar() {
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });
}

// ===== MOBILE MENU =====
function initMobileMenu() {
  const btn = document.getElementById('mobileMenuBtn');
  const menu = document.getElementById('mobileMenu');
  const close = document.getElementById('mobileClose');

  const open = () => {
    menu.classList.add('active');
    document.body.style.overflow = 'hidden';
  };
  const closeMenu = () => {
    menu.classList.remove('active');
    document.body.style.overflow = '';
  };

  btn.addEventListener('click', open);
  close.addEventListener('click', closeMenu);

  menu.querySelectorAll('.mobile-link').forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  document.getElementById('mobileLangBtn').addEventListener('click', () => {
    const curr = localStorage.getItem('lang') || 'cs';
    const next = curr === 'cs' ? 'en' : 'cs';
    setLanguage(next);
    closeMenu();
  });
}

// ===== LANGUAGE SWITCHER =====
let currentLang = localStorage.getItem('lang') || 'cs';

function setLanguage(lang) {
  currentLang = lang;
  localStorage.setItem('lang', lang);
  document.documentElement.lang = lang;

  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    const t = translations[lang];
    if (t && t[key] !== undefined) {
      el.textContent = t[key];
    }
  });

  const langBtn = document.getElementById('langBtn');
  const mobileLangBtn = document.getElementById('mobileLangBtn');
  const label = lang === 'cs' ? 'EN' : 'CS';
  if (langBtn) langBtn.textContent = label;
  if (mobileLangBtn) mobileLangBtn.textContent = label;
}

function initLanguageSwitcher() {
  const langBtn = document.getElementById('langBtn');
  langBtn.addEventListener('click', () => {
    const next = currentLang === 'cs' ? 'en' : 'cs';
    setLanguage(next);
  });
  setLanguage(currentLang);
}

// ===== SMOOTH SCROLL =====
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href').slice(1);
      const target = document.getElementById(id);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
}

// ===== SCROLL PROGRESS =====
function initScrollProgress() {
  const bar = document.getElementById('scrollProgress');
  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    const total = document.documentElement.scrollHeight - window.innerHeight;
    const pct = total > 0 ? (scrolled / total) * 100 : 0;
    bar.style.width = pct + '%';
  }, { passive: true });
}

// ===== TABS =====
function initTabs() {
  const tabs = document.querySelectorAll('.tab-btn');
  tabs.forEach(btn => {
    btn.addEventListener('click', () => {
      const tab = btn.getAttribute('data-tab');

      tabs.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      document.querySelectorAll('.tab-panel').forEach(panel => {
        panel.classList.remove('active');
      });
      const panel = document.getElementById('tab-' + tab);
      if (panel) panel.classList.add('active');
    });
  });
}

// ===== HERO CANVAS PARTICLES =====
function initHeroCanvas() {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H, particles = [];
  let mouse = { x: null, y: null };

  const PARTICLE_COUNT = 80;
  const MAX_DIST = 120;

  function resize() {
    W = canvas.width = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }

  function createParticle() {
    return {
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      r: Math.random() * 1.5 + 0.5,
      alpha: Math.random() * 0.4 + 0.15,
    };
  }

  function init() {
    resize();
    particles = Array.from({ length: PARTICLE_COUNT }, createParticle);
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0) p.x = W;
      if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H;
      if (p.y > H) p.y = 0;

      if (mouse.x !== null) {
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100) {
          p.x -= dx * 0.015;
          p.y -= dy * 0.015;
        }
      }

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(107, 189, 227, ${p.alpha})`;
      ctx.fill();
    });

    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < MAX_DIST) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          const alpha = (1 - dist / MAX_DIST) * 0.12;
          ctx.strokeStyle = `rgba(107, 189, 227, ${alpha})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(draw);
  }

  const heroSection = document.getElementById('hero');
  if (heroSection) {
    heroSection.addEventListener('mousemove', e => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    });
    heroSection.addEventListener('mouseleave', () => {
      mouse.x = null;
      mouse.y = null;
    });
  }

  window.addEventListener('resize', () => {
    resize();
    particles = Array.from({ length: PARTICLE_COUNT }, createParticle);
  });

  init();
  draw();
}
