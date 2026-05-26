// ===== KABYA KISHAN PORTFOLIO - script.js =====

// ---- DOM READY ----
document.addEventListener('DOMContentLoaded', () => {
  initLoader();
  initNavbar();
  initHamburger();
  initTyping();
  initScrollReveal();
  initSkillBars();
  initParticles();
  initConverter();
  initContactForm();
  initScrollTop();
  initDarkToggle();
  initProfileImage();
});

// ---- LOADER ----
function initLoader() {
  const loader = document.getElementById('loader');
  window.addEventListener('load', () => {
    setTimeout(() => {
      loader.classList.add('hidden');
    }, 900);
  });
  // Fallback: hide after 2s regardless
  setTimeout(() => loader.classList.add('hidden'), 2000);
}

// ---- NAVBAR SCROLL ----
function initNavbar() {
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }, { passive: true });

  // Smooth active link highlight
  const links = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
      if (window.scrollY >= section.offsetTop - 120) {
        current = section.getAttribute('id');
      }
    });
    links.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  }, { passive: true });
}

// ---- HAMBURGER ----
function initHamburger() {
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');

  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    const bars = hamburger.querySelectorAll('span');
    if (navLinks.classList.contains('open')) {
      bars[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
      bars[1].style.opacity = '0';
      bars[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
    } else {
      bars[0].style.transform = '';
      bars[1].style.opacity = '';
      bars[2].style.transform = '';
    }
  });

  // Close on nav link click (mobile)
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      const bars = hamburger.querySelectorAll('span');
      bars[0].style.transform = '';
      bars[1].style.opacity = '';
      bars[2].style.transform = '';
    });
  });
}

// ---- TYPING ANIMATION ----
function initTyping() {
  const phrases = [
    'Web Developer',
    'Creative Learner',
    'Tech Enthusiast',
    'Frontend Builder',
    'UI/UX Explorer'
  ];
  const el = document.getElementById('typed-text');
  if (!el) return;

  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let isPaused = false;

  function type() {
    const current = phrases[phraseIndex];
    if (isDeleting) {
      el.textContent = current.substring(0, charIndex - 1);
      charIndex--;
    } else {
      el.textContent = current.substring(0, charIndex + 1);
      charIndex++;
    }

    let delay = isDeleting ? 60 : 95;

    if (!isDeleting && charIndex === current.length) {
      isPaused = true;
      delay = 1800;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      delay = 400;
    }

    setTimeout(type, delay);
  }
  type();
}

// ---- SCROLL REVEAL ----
function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Stagger children in a group
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, 80);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  reveals.forEach(el => observer.observe(el));
}

// ---- SKILL BARS ----
function initSkillBars() {
  const fills = document.querySelectorAll('.skill-fill');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const fill = entry.target;
        const width = fill.getAttribute('data-width');
        setTimeout(() => {
          fill.style.width = width;
        }, 200);
        observer.unobserve(fill);
      }
    });
  }, { threshold: 0.4 });
  fills.forEach(fill => observer.observe(fill));
}

// ---- PARTICLES ----
function initParticles() {
  const container = document.getElementById('particles');
  if (!container) return;

  const count = window.innerWidth < 600 ? 18 : 36;

  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    const size = Math.random() * 3 + 1;
    const x = Math.random() * 100;
    const delay = Math.random() * 8;
    const duration = Math.random() * 8 + 6;
    const opacity = Math.random() * 0.5 + 0.1;

    p.style.cssText = `
      position: absolute;
      left: ${x}%;
      bottom: -10px;
      width: ${size}px;
      height: ${size}px;
      background: ${Math.random() > 0.5 ? '#6effd2' : '#00c9ff'};
      border-radius: 50%;
      animation: particleFloat ${duration}s ${delay}s infinite;
      opacity: ${opacity};
    `;
    container.appendChild(p);
  }
}

// ---- TEMPERATURE CONVERTER ----
function initConverter() {
  const input = document.getElementById('tempInput');
  const fromUnit = document.getElementById('fromUnit');
  const toUnit = document.getElementById('toUnit');
  const convertBtn = document.getElementById('convertBtn');
  const resetBtn = document.getElementById('resetBtn');
  const result = document.getElementById('convResult');
  const resultValue = document.getElementById('resultValue');
  const resultFormula = document.getElementById('resultFormula');
  const error = document.getElementById('convError');
  const errorMsg = document.getElementById('errorMsg');

  function convert() {
    const raw = input.value.trim();
    const from = fromUnit.value;
    const to = toUnit.value;

    // Hide both panels first
    result.classList.add('hidden');
    error.classList.add('hidden');

    // Validation
    if (raw === '') {
      showError('Please enter a temperature value.');
      return;
    }
    const temp = parseFloat(raw);
    if (isNaN(temp)) {
      showError('Invalid input. Please enter a valid number.');
      return;
    }

    // Kelvin validation
    if (from === 'kelvin' && temp < 0) {
      showError('Kelvin cannot be negative (absolute zero = 0 K).');
      return;
    }
    if (from === 'celsius') {
      const kelvin = temp + 273.15;
      if (kelvin < 0) {
        showError(`Temperature below absolute zero! (${temp}°C = ${kelvin.toFixed(2)} K)`);
        return;
      }
    }
    if (from === 'fahrenheit') {
      const celsius = (temp - 32) * 5 / 9;
      const kelvin = celsius + 273.15;
      if (kelvin < 0) {
        showError(`Temperature below absolute zero! (${temp}°F = ${kelvin.toFixed(2)} K)`);
        return;
      }
    }

    // Same unit
    if (from === to) {
      showResult(temp, to, `No conversion needed (same unit)`);
      return;
    }

    let converted;
    let formula;

    // Convert to Celsius first as base
    let celsius;
    switch (from) {
      case 'celsius':    celsius = temp; break;
      case 'fahrenheit': celsius = (temp - 32) * 5 / 9; break;
      case 'kelvin':     celsius = temp - 273.15; break;
    }

    // Convert from Celsius to target
    switch (to) {
      case 'celsius':
        converted = celsius;
        formula = from === 'fahrenheit'
          ? `°C = (${temp}°F − 32) × 5/9 = ${converted.toFixed(4)}°C`
          : `°C = ${temp}K − 273.15 = ${converted.toFixed(4)}°C`;
        break;
      case 'fahrenheit':
        converted = celsius * 9 / 5 + 32;
        formula = from === 'celsius'
          ? `°F = (${temp}°C × 9/5) + 32 = ${converted.toFixed(4)}°F`
          : `°F = ((${temp}K − 273.15) × 9/5) + 32 = ${converted.toFixed(4)}°F`;
        break;
      case 'kelvin':
        converted = celsius + 273.15;
        formula = from === 'celsius'
          ? `K = ${temp}°C + 273.15 = ${converted.toFixed(4)} K`
          : `K = ((${temp}°F − 32) × 5/9) + 273.15 = ${converted.toFixed(4)} K`;
        break;
    }

    const unitSymbols = { celsius: '°C', fahrenheit: '°F', kelvin: 'K' };
    showResult(`${converted.toFixed(2)} ${unitSymbols[to]}`, to, formula);
  }

  function showResult(val, unit, formula) {
    resultValue.textContent = val;
    resultFormula.textContent = formula;
    result.classList.remove('hidden');
    error.classList.add('hidden');
  }

  function showError(msg) {
    errorMsg.textContent = msg;
    error.classList.remove('hidden');
    result.classList.add('hidden');
  }

  function reset() {
    input.value = '';
    fromUnit.value = 'celsius';
    toUnit.value = 'fahrenheit';
    result.classList.add('hidden');
    error.classList.add('hidden');
    input.focus();
  }

  convertBtn.addEventListener('click', convert);
  resetBtn.addEventListener('click', reset);

  // Real-time on Enter key
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') convert();
  });

  // Prevent same unit showing trivially
  fromUnit.addEventListener('change', () => {
    result.classList.add('hidden');
    error.classList.add('hidden');
  });
  toUnit.addEventListener('change', () => {
    result.classList.add('hidden');
    error.classList.add('hidden');
  });
}

// ---- CONTACT FORM ----
function initContactForm() {
  const form = document.getElementById('contactForm');
  const success = document.getElementById('formSuccess');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const message = form.message.value.trim();

    if (!name || !email || !message) return;

    // Simulate sending (no real backend needed for GitHub Pages)
    const btn = form.querySelector('button[type="submit"]');
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';

    setTimeout(() => {
      success.classList.remove('hidden');
      form.reset();
      btn.disabled = false;
      btn.innerHTML = '<span>Send Message</span> <i class="fas fa-paper-plane"></i>';
      setTimeout(() => success.classList.add('hidden'), 5000);
    }, 1400);
  });
}

// ---- SCROLL TO TOP ----
function initScrollTop() {
  const btn = document.getElementById('scrollTop');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  }, { passive: true });
  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// ---- DARK/LIGHT TOGGLE ----
function initDarkToggle() {
  const btn = document.getElementById('darkToggle');
  const icon = btn.querySelector('i');
  let isLight = false;

  // Check saved preference
  if (localStorage.getItem('theme') === 'light') {
    isLight = true;
    document.body.classList.add('light-mode');
    icon.className = 'fas fa-sun';
  }

  btn.addEventListener('click', () => {
    isLight = !isLight;
    document.body.classList.toggle('light-mode', isLight);
    icon.className = isLight ? 'fas fa-sun' : 'fas fa-moon';
    localStorage.setItem('theme', isLight ? 'light' : 'dark');
  });
}

// ---- PROFILE IMAGE (embed base64 if external fails) ----
function initProfileImage() {
  const img = document.getElementById('profileImg');
  if (!img) return;
  img.onerror = () => {
    // Fallback: show initials avatar
    const container = img.parentElement;
    img.style.display = 'none';
    const fallback = document.createElement('div');
    fallback.style.cssText = `
      width:100%;height:100%;
      display:flex;align-items:center;justify-content:center;
      background:linear-gradient(135deg,#6effd2,#00c9ff);
      font-family:'Orbitron',monospace;
      font-size:4rem;font-weight:900;
      color:#0d0f14;
    `;
    fallback.textContent = 'KK';
    container.appendChild(fallback);
  };
}
