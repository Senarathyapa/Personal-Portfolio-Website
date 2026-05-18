'use strict';

/* ── LOADER ─────────────────────────────────────────────── */
window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('loader').classList.add('hidden');
  }, 1900);
});

/* ── YEAR ────────────────────────────────────────────────── */
document.getElementById('year').textContent = new Date().getFullYear();

/* ── THEME TOGGLE ────────────────────────────────────────── */
const html = document.documentElement;
const themeBtn = document.getElementById('themeToggle');
const themeIcon = document.getElementById('themeIcon');

let currentTheme = localStorage.getItem('qa-theme') || 'dark';
applyTheme(currentTheme);

themeBtn.addEventListener('click', () => {
  currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
  applyTheme(currentTheme);
  localStorage.setItem('qa-theme', currentTheme);
});

function applyTheme(theme) {
  html.setAttribute('data-theme', theme);
  themeIcon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
}

/* ── NAVBAR ─────────────────────────────────────────────── */
const navbar = document.getElementById('navbar');
const navLinkEls = document.querySelectorAll('.nav-links a, .mobile-nav a');
const sections = document.querySelectorAll('section[id]');

window.addEventListener('scroll', () => {
  // Sticky shadow
  navbar.classList.toggle('scrolled', window.scrollY > 20);

  // Active link highlighting
  let current = '';
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 100) current = sec.id;
  });
  navLinkEls.forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === '#' + current);
  });

  // Scroll to top visibility
  scrollTopBtn.classList.toggle('visible', window.scrollY > 400);
});

/* ── HAMBURGER ───────────────────────────────────────────── */
const hamburger = document.getElementById('hamburger');
const mobileNav = document.getElementById('mobileNav');

hamburger.addEventListener('click', () => {
  const open = hamburger.classList.toggle('open');
  mobileNav.classList.toggle('open', open);
  hamburger.setAttribute('aria-expanded', open);
});

// Close mobile nav on link click
mobileNav.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    hamburger.classList.remove('open');
    mobileNav.classList.remove('open');
    hamburger.setAttribute('aria-expanded', false);
  });
});

/* ── SCROLL TO TOP ───────────────────────────────────────── */
const scrollTopBtn = document.getElementById('scrollTop');
scrollTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

/* ── TYPING EFFECT ───────────────────────────────────────── */
const typingEl = document.getElementById('typingText');
const phrases = [
  'Manual Testing',
  'Bug Reporting',
  'Test Case Writing',
  'Automation Testing',
  'API Testing',
  'Agile QA'
];
let phraseIdx = 0, charIdx = 0, deleting = false;

function type() {
  const phrase = phrases[phraseIdx];
  if (!deleting) {
    typingEl.textContent = phrase.substring(0, charIdx + 1);
    charIdx++;
    if (charIdx === phrase.length) { deleting = true; setTimeout(type, 1600); return; }
  } else {
    typingEl.textContent = phrase.substring(0, charIdx - 1);
    charIdx--;
    if (charIdx === 0) { deleting = false; phraseIdx = (phraseIdx + 1) % phrases.length; }
  }
  setTimeout(type, deleting ? 60 : 95);
}
setTimeout(type, 1000);

/* ── REVEAL ON SCROLL ────────────────────────────────────── */
const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      // Trigger skill bars when skills section is visible
      if (entry.target.id === 'skillsGrid' || entry.target.closest('#skills')) {
        triggerSkillBars();
      }
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

revealEls.forEach(el => observer.observe(el));

/* ── COUNTER ANIMATION ───────────────────────────────────── */
const counters = document.querySelectorAll('[data-count]');
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const target = parseInt(el.dataset.count);
      animateCounter(el, target);
      counterObserver.unobserve(el);
    }
  });
}, { threshold: 0.5 });
counters.forEach(c => counterObserver.observe(c));

function animateCounter(el, target) {
  let start = 0;
  const duration = 1800;
  const step = (timestamp) => {
    if (!start) start = timestamp;
    const progress = Math.min((timestamp - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(eased * target) + (target >= 50 ? '+' : '');
    if (progress < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

/* ── SKILLS DATA & RENDER ────────────────────────────────── */
const skillsData = [
  { name: 'Manual Testing',        pct: 85, icon: 'fa-vial' },
  { name: 'SDLC & STLC',           pct: 80, icon: 'fa-rotate' },
  { name: 'Test Case Design',       pct: 82, icon: 'fa-file-lines' },
  { name: 'Bug Reporting',          pct: 88, icon: 'fa-bug' },
  { name: 'API Testing Basics',     pct: 65, icon: 'fa-plug' },
  { name: 'Basic Automation',       pct: 55, icon: 'fa-robot' },
  { name: 'HTML & CSS',             pct: 70, icon: 'fa-code' },
  { name: 'JavaScript Basics',      pct: 60, icon: 'fa-square-js' },
  { name: 'SQL Basics',             pct: 63, icon: 'fa-database' },
];

const skillsGrid = document.getElementById('skillsGrid');
skillsData.forEach((s, i) => {
  const card = document.createElement('div');
  card.className = 'card skill-card reveal';
  card.style.transitionDelay = `${(i % 3) * 0.1}s`;
  card.innerHTML = `
    <div class="skill-header">
      <div class="skill-info">
        <div class="skill-icon"><i class="fas ${s.icon}"></i></div>
        <span class="skill-name">${s.name}</span>
      </div>
      <span class="skill-pct">${s.pct}%</span>
    </div>
    <div class="skill-bar">
      <div class="skill-bar-fill" data-width="${s.pct}"></div>
    </div>
  `;
  skillsGrid.appendChild(card);
  observer.observe(card);
});

let skillBarsTriggered = false;
function triggerSkillBars() {
  if (skillBarsTriggered) return;
  skillBarsTriggered = true;
  document.querySelectorAll('.skill-bar-fill').forEach(bar => {
    bar.style.width = bar.dataset.width + '%';
  });
}

// Also trigger when skills section scrolled into view
const skillsSection = document.getElementById('skills');
const skillsObs = new IntersectionObserver((entries) => {
  if (entries[0].isIntersecting) { triggerSkillBars(); skillsObs.disconnect(); }
}, { threshold: 0.15 });
skillsObs.observe(skillsSection);

/* ── PROJECTS DATA & RENDER ──────────────────────────────── */
const projectsData = [
  {
    image: 'calculator.png',
    tags: ['HTML','CSS','JavaScript'],
    title: 'Simple Calculator',
    desc: ' Designed and developed a responsive Calculator Web App as a front-end project using    HTML, CSS, and JavaScript. Demonstrated skills in UI design, event handling, and core programming logic.',
    github: 'https://github.com/Senarathyapa/Simple-Calculator.git',
    
  },
  {
    image: 'litecinema.png',
    tags: ['HTML', 'CSS','JavaScript','PHP','MySQL'],
    title: 'Cinema Seat Reservation System',
    desc: 'A web-based system developed using HTML, CSS, JavaScript, PHP, and MySQL that allows users to view movies, select seats, and book tickets online.',
    github: 'https://github.com/Senarathyapa/Cinema-Seat-Reservation-System.git',
    
  },
  {
    image: 'portfolio.png',
    tags: ['HTML', 'CSS', 'JavaScript'],
    title: 'My Personal Portfolio Website',
    desc: 'Designed and developed a personal QA Engineer portfolio website to showcase skills, projects, and experience built using HTML, CSS, and JavaScript. ',
    github: 'https://github.com/Senarathyapa',
    
  },
 
  {
    image: 'tutor.png',
    tags: ['HTML','CSS','JavaScript','PHP','MYSQL'],
    title: 'FCT -TUTOR',
    desc: 'The Faculty Tutoring Center Management System is a web-based platform designed to simplify and automate tutoring center operations. It allows students to register for tutoring services online, manage courses, view announcements, and track performance while helping the faculty efficiently manage tutoring sessions and student support with reduced paperwork.',
    github: 'https://github.com/Senarathyapa/FCT-TUTOR.git',
    
  },
];

const projectsGrid = document.getElementById('projectsGrid');
projectsData.forEach((p, i) => {
  const card = document.createElement('div');
  card.className = 'card project-card reveal';
  card.style.transitionDelay = `${(i % 3) * 0.1}s`;
  card.innerHTML = `
    <div class="project-thumb">
       <img src="${p.image}" alt="${p.title}" class="project-thumb-img" />
      <div class="project-thumb-overlay">
        
      </div>
    </div>
    <div class="project-body">
      <div class="project-tags">
        ${p.tags.map(t => `<span class="project-tag">${t}</span>`).join('')}
      </div>
      <h3 class="project-title">${p.title}</h3>
      <p class="project-desc">${p.desc}</p>
      <div class="project-footer">
        <a href="${p.github}" target="_blank" class="btn btn-outline btn-sm">
          <i class="fab fa-github"></i> GitHub
        </a>
        
      </div>
    </div>
  `;
  projectsGrid.appendChild(card);
  observer.observe(card);
});


/* ── CERTIFICATES DATA & RENDER ──────────────────────────── */
const certsData = [
  {
    icon: 'fa-file-lines',
    platform: 'University of Moratuwa',
    title: 'Introduction to Software Quality Assurance',
    link: 'image1.png'
  },
  {
    icon: 'fa-file-lines',
    platform: 'University of Moratuwa',
    title: 'Python for Beginner',
    link: 'image2.png'
  },
  {
    icon: 'fa-file-lines',
    platform: 'Great Learning',
    title: 'Jira Project Management',
    link: 'image3.png'
  },
  {
    icon: 'fa-file-lines',
    platform: 'Simplilearn',
    title: 'Introduction to Software Testing',
    link: 'image4.png'
  },
  {
    icon: 'fa-file-lines',
    platform: 'Great Learning',
    title: 'Selenium Basics',
    link: 'image5.png'
  },
  {
    icon: 'fa-file-lines',
    platform: 'Alison',
    title: 'Agile Project Management',
    link: 'image6.png'
  }
];

const certsGrid = document.getElementById('certsGrid');

certsData.forEach((c, i) => {
  const card = document.createElement('div');

  card.className = 'card cert-card reveal';
  card.style.transitionDelay = `${(i % 3) * 0.1}s`;

  card.innerHTML = `
    <div class="cert-icon">
      <i class="fas ${c.icon}"></i>
    </div>

    <div class="cert-platform">${c.platform}</div>

    <div class="cert-title">${c.title}</div>


    <a href="${c.link}" target="_blank" class="cert-btn">
      View Certificate <i class="fas fa-arrow-right"></i>
    </a>
  `;

  certsGrid.appendChild(card);

  observer.observe(card);
});

/* ── EDUCATION DATA & RENDER ─────────────────────────────── */
const educationData = [
  {
    period: '2023 – 2027',
    degree: 'Bachelor of Information and Communication Technology (Honours)',
    university: 'University of Kelaniya , Faculty Of Computing and Technology',
    courses: [
      'Software Engineering', 'Database Systems', 'Web Development',
      'Software Quality Assurance', 'Operating Systems', 'Computer Networks',
      'Object-Oriented Programming'
    ]
  },
  {
    period: '2019 – 2021',
    degree: ' G.C.E Advanced Level Examination (Technology Stream - BST) - (Private)',
    university: 'Telijjawila Central College',
    courses: ['Science For Technology', 'Bio System For Technology', 'Information and Communication Technology']
  }
];

const timeline = document.getElementById('educationTimeline');
educationData.forEach((e, i) => {
  const item = document.createElement('div');
  item.className = 'timeline-item reveal';
  item.style.transitionDelay = `${i * 0.15}s`;
  item.innerHTML = `
    <div class="timeline-dot"></div>
    <div class="timeline-period">${e.period}</div>
    <div class="card timeline-card">
      <div class="timeline-degree">${e.degree}</div>
      <div class="timeline-university">
        <i class="fas fa-building-columns"></i> ${e.university}
      </div>
      <div class="coursework-list">
        ${e.courses.map(c => `<span class="coursework-tag">${c}</span>`).join('')}
      </div>
    </div>
  `;
  timeline.appendChild(item);
  observer.observe(item);
});

/* ── TOOLS DATA & RENDER ─────────────────────────────────── */
const toolsData = [
  { name: 'Jira',            icon: 'fa-brands fa-jira' },
  { name: 'Postman',         icon: 'fa-paper-plane' },
  { name: 'Selenium',        icon: 'fa-robot' },
  { name: 'GitHub',          icon: 'fa-brands fa-github' },
  { name: 'VS Code',         icon: 'fa-regular fa-file-code' },
  { name: 'MySQL',           icon: 'fa-database' },

];

const toolsGrid = document.getElementById('toolsGrid');
toolsData.forEach((t, i) => {
  const card = document.createElement('div');
  card.className = 'card tool-card reveal';
  card.style.transitionDelay = `${(i % 4) * 0.08}s`;
  card.innerHTML = `
    <div class="tool-icon-wrap"><i class="${t.icon.includes('fa-brands') || t.icon.includes('fa-regular') ? t.icon : 'fas ' + t.icon}"></i></div>
    <span class="tool-name">${t.name}</span>
  `;
  toolsGrid.appendChild(card);
  observer.observe(card);
});

/*

/* ── CONTACT FORM VALIDATION ─────────────────────────────── */
const contactForm = document.getElementById('contactForm');

contactForm.addEventListener('submit', (e) => {
  e.preventDefault();
  let valid = true;

  // Name
  const nameVal = document.getElementById('name').value.trim();
  setError('name', 'nameError', nameVal.length < 2);
  if (nameVal.length < 2) valid = false;

  // Email
  const emailVal = document.getElementById('email').value.trim();
  const emailRx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  setError('email', 'emailError', !emailRx.test(emailVal));
  if (!emailRx.test(emailVal)) valid = false;

  // Subject
  const subjectVal = document.getElementById('subject').value.trim();
  setError('subject', 'subjectError', subjectVal.length < 2);
  if (subjectVal.length < 2) valid = false;

  // Message
  const msgVal = document.getElementById('message').value.trim();
  setError('message', 'messageError', msgVal.length < 20);
  if (msgVal.length < 20) valid = false;

  if (valid) {
    contactForm.querySelector('.form-submit').innerHTML =
      '<i class="fas fa-spinner fa-spin"></i> Sending...';
    setTimeout(() => {
      contactForm.reset();
      document.getElementById('formSuccess').classList.add('show');
      contactForm.querySelector('.form-submit').innerHTML =
        '<i class="fas fa-paper-plane"></i> Send Message';
      setTimeout(() => {
        document.getElementById('formSuccess').classList.remove('show');
      }, 5000);
    }, 1500);
  }
});

function setError(inputId, errorId, hasError) {
  const input = document.getElementById(inputId);
  const error = document.getElementById(errorId);
  input.classList.toggle('error', hasError);
  error.classList.toggle('show', hasError);
}

// Clear errors on input
['name', 'email', 'subject', 'message'].forEach(id => {
  document.getElementById(id).addEventListener('input', () => {
    setError(id, id + 'Error', false);
  });
});


