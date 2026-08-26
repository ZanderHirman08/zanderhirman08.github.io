const navToggle = document.getElementById('navToggle');
const siteNav = document.getElementById('siteNav');

// Assemble the email link at runtime so a plain mailto: string is never
// sitting in the page's HTML for scrapers to regex out.
document.querySelectorAll('.obfuscated-email').forEach((link) => {
  const user = link.dataset.user;
  const domain = link.dataset.domain;
  link.href = `mailto:${user}@${domain}`;
});

// Resume gate: the actual resume link never sits in the page's HTML,
// only assembled here and opened after a correct answer.
const RESUME_URL = 'https://drive.google.com/file/d/1jjr7TrBBrtlqQA_r4s2I8NMW0HpKP8O0/view?usp=sharing';
const resumeGate = document.getElementById('resumeGate');
const resumeGateMsg = document.getElementById('resumeGateMsg');
const resumeGateClose = document.getElementById('resumeGateClose');

function openResumeGate() {
  resumeGateMsg.textContent = '';
  resumeGate.hidden = false;
}
function closeResumeGate() {
  resumeGate.hidden = true;
}

function trackResumeDownload() {
  if (window.trackSiteEvent) {
    window.trackSiteEvent('download', { href: RESUME_URL, text: 'Resume', external: true });
  }
}

document.querySelectorAll('.resume-trigger').forEach((btn) => {
  btn.addEventListener('click', () => {
    if (localStorage.getItem('resumeVerified') === 'true') {
      window.open(RESUME_URL, '_blank', 'noopener');
      trackResumeDownload();
    } else {
      openResumeGate();
    }
  });
});

resumeGateClose.addEventListener('click', closeResumeGate);
resumeGate.addEventListener('click', (e) => {
  if (e.target === resumeGate) closeResumeGate();
});

document.querySelectorAll('.resume-gate-option').forEach((btn) => {
  btn.addEventListener('click', () => {
    if (btn.dataset.answer === 'correct') {
      localStorage.setItem('resumeVerified', 'true');
      closeResumeGate();
      window.open(RESUME_URL, '_blank', 'noopener');
      trackResumeDownload();
    } else {
      resumeGateMsg.textContent = btn.dataset.msg || 'Not quite — try again.';
    }
  });
});

navToggle.addEventListener('click', () => {
  const isOpen = siteNav.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', isOpen);
});

siteNav.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    siteNav.classList.remove('open');
    navToggle.setAttribute('aria-expanded', false);
  });
});

// Hero photo rotation
const heroPhotoFrame = document.getElementById('heroPhotoFrame');
if (heroPhotoFrame) {
  const pad = (n) => String(n).padStart(2, '0');
  const tanzania = Array.from({ length: 15 }, (_, i) => ({
    src: `assets/images/gallery/web/tanzania/tanzania-${pad(i + 1)}.jpg`,
    caption: 'Chipanga Village, Tanzania — 2026'
  }));
  const conps = Array.from({ length: 9 }, (_, i) => ({
    src: `assets/images/gallery/web/conps/conps-${pad(i + 1)}.jpg`,
    caption: 'Colorado, United States — 2025'
  }));

  // Interleave the two sets so the rotation alternates locations
  // rather than showing all of one place before the other.
  const slides = [];
  const maxLen = Math.max(tanzania.length, conps.length);
  for (let i = 0; i < maxLen; i++) {
    if (tanzania[i]) slides.push(tanzania[i]);
    if (conps[i]) slides.push(conps[i]);
  }

  const imgEls = heroPhotoFrame.querySelectorAll('.hero-photo-img');
  const captionEl = document.getElementById('heroPhotoCaption');
  const prevBtn = document.getElementById('heroPhotoPrev');
  const nextBtn = document.getElementById('heroPhotoNext');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let index = 0;
  let activeIdx = 0;
  let timer = null;

  function goTo(newIndex) {
    index = (newIndex + slides.length) % slides.length;
    const nextEl = imgEls[1 - activeIdx];
    const preload = new Image();
    preload.onload = () => {
      nextEl.src = slides[index].src;
      nextEl.classList.add('is-active');
      imgEls[activeIdx].classList.remove('is-active');
      captionEl.textContent = slides[index].caption;
      activeIdx = 1 - activeIdx;
    };
    preload.src = slides[index].src;
  }

  function startAutoRotate() {
    if (reduceMotion || slides.length <= 1) return;
    clearInterval(timer);
    timer = setInterval(() => goTo(index + 1), 20000);
  }

  if (slides.length > 1) {
    prevBtn.addEventListener('click', () => { goTo(index - 1); startAutoRotate(); });
    nextBtn.addEventListener('click', () => { goTo(index + 1); startAutoRotate(); });
    startAutoRotate();
  } else {
    prevBtn.style.display = 'none';
    nextBtn.style.display = 'none';
  }
}
