// ===== BIRTHDAY PAGE JS =====

// ====== BACKGROUND SETUP ======
function createStars() {
  const container = document.getElementById('bgStars');
  for (let i = 0; i < 80; i++) {
    const s = document.createElement('div');
    s.className = 'star-dot';
    const size = Math.random() * 2.5 + 1;
    s.style.cssText = `
      width: ${size}px; height: ${size}px;
      left: ${Math.random() * 100}%; top: ${Math.random() * 100}%;
      animation-duration: ${Math.random() * 4 + 2}s;
      animation-delay: ${Math.random() * 4}s;
    `;
    container.appendChild(s);
  }
}

function createPetals() {
  const container = document.getElementById('bgPetals');
  const petals = ['🌸', '🌺', '💮', '🌷', '🌼'];
  for (let i = 0; i < 15; i++) {
    const p = document.createElement('div');
    p.className = 'petal';
    p.textContent = petals[Math.floor(Math.random() * petals.length)];
    p.style.cssText = `
      left: ${Math.random() * 100}vw;
      font-size: ${Math.random() * 12 + 8}px;
      animation-duration: ${Math.random() * 12 + 10}s;
      animation-delay: ${Math.random() * 15}s;
      opacity: 0.4;
    `;
    container.appendChild(p);
  }
}

// ====== CONFETTI ======
const canvas = document.getElementById('confettiCanvas');
const ctx = canvas.getContext('2d');
let confettiPieces = [];
let confettiRunning = false;

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

class ConfettiPiece {
  constructor() {
    this.reset();
  }
  reset() {
    this.x = Math.random() * canvas.width;
    this.y = -20;
    this.size = Math.random() * 8 + 4;
    this.color = ['#e8a0bf','#d4a853','#c9547a','#fce4ec','#fff','#f5e6c8'][Math.floor(Math.random()*6)];
    this.speed = Math.random() * 3 + 1.5;
    this.angle = Math.random() * 360;
    this.spin = (Math.random() - 0.5) * 8;
    this.swayX = (Math.random() - 0.5) * 2;
    this.shape = Math.random() > 0.5 ? 'rect' : 'circle';
    this.opacity = 1;
  }
  update() {
    this.y += this.speed;
    this.x += this.swayX;
    this.angle += this.spin;
    if (this.y > canvas.height + 20) this.reset();
  }
  draw() {
    ctx.save();
    ctx.globalAlpha = this.opacity;
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle * Math.PI / 180);
    ctx.fillStyle = this.color;
    if (this.shape === 'rect') {
      ctx.fillRect(-this.size/2, -this.size/4, this.size, this.size/2);
    } else {
      ctx.beginPath();
      ctx.arc(0, 0, this.size/2, 0, Math.PI*2);
      ctx.fill();
    }
    ctx.restore();
  }
}

function launchConfetti(count = 80) {
  for (let i = 0; i < count; i++) {
    const p = new ConfettiPiece();
    p.y = Math.random() * canvas.height;
    confettiPieces.push(p);
  }
  if (!confettiRunning) {
    confettiRunning = true;
    animateConfetti();
  }
  setTimeout(() => {
    confettiPieces = [];
    confettiRunning = false;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }, 6000);
}

function animateConfetti() {
  if (!confettiRunning) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  confettiPieces.forEach(p => { p.update(); p.draw(); });
  requestAnimationFrame(animateConfetti);
}

// Launch confetti on page load
setTimeout(() => launchConfetti(60), 500);

// ====== SCROLL ANIMATIONS ======
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      
      // Special triggers
      if (entry.target.id === 'final') {
        setTimeout(() => {
          document.getElementById('lmFill').style.width = '100%';
        }, 300);
        createFinalStars();
      }
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('.reason-card, #final, #message, #gallery, #cake, #countdown').forEach(el => {
  observer.observe(el);
});

// Reason cards stagger
document.querySelectorAll('.reason-card').forEach((card, i) => {
  card.style.transitionDelay = (i * 100) + 'ms';
});

// ====== GALLERY ANIMATIONS ======
const galleryObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.photo-card').forEach((card, i) => {
        setTimeout(() => {
          card.style.opacity = '1';
          card.style.transform = card.classList.contains('tall') ? 'translateY(0)' : 'translateY(0) scale(1)';
        }, i * 120);
      });
      entry.target.querySelectorAll('.polaroid').forEach((pol, i) => {
        const rotations = [-4, 3, -2, 5, -3];
        setTimeout(() => {
          pol.style.opacity = '1';
          pol.style.transform = `rotate(${rotations[i] || 0}deg) translateY(${i % 2 === 0 ? '-5px' : '8px'})`;
        }, i * 100);
      });
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.gallery-layout-1, .gallery-layout-3').forEach(el => {
  galleryObserver.observe(el);
  el.querySelectorAll('.photo-card, .polaroid').forEach(c => {
    c.style.opacity = '0';
    c.style.transform = 'translateY(20px) scale(0.95)';
    c.style.transition = 'all 0.6s cubic-bezier(0.34, 1.2, 0.64, 1)';
  });
});

// ====== SLIDESHOW ======
let currentSlide = 0;
const slides = document.querySelectorAll('.slide');
const dotsContainer = document.getElementById('slideDots');
let slideInterval;

slides.forEach((_, i) => {
  const dot = document.createElement('div');
  dot.className = 'slide-dot-item' + (i === 0 ? ' active' : '');
  dot.onclick = () => goToSlide(i);
  dotsContainer.appendChild(dot);
});

function goToSlide(n) {
  slides[currentSlide].classList.remove('active');
  document.querySelectorAll('.slide-dot-item')[currentSlide]?.classList.remove('active');
  currentSlide = (n + slides.length) % slides.length;
  slides[currentSlide].classList.add('active');
  document.querySelectorAll('.slide-dot-item')[currentSlide]?.classList.add('active');
}

function changeSlide(dir) {
  goToSlide(currentSlide + dir);
  clearInterval(slideInterval);
  slideInterval = setInterval(() => changeSlide(1), 5000);
}

slideInterval = setInterval(() => changeSlide(1), 5000);

// ====== ENVELOPE / LETTER ======
document.getElementById('letterEnvelope').addEventListener('click', function() {
  this.style.display = 'none';
  const letter = document.getElementById('letterContent');
  letter.style.display = 'block';
  launchConfetti(30);
});

// ====== CAKE CANDLES ======
let blownCount = 0;

function blowCandle(candle) {
  if (candle.dataset.lit === 'false') return;
  
  candle.dataset.lit = 'false';
  candle.classList.add('blown');
  
  // Smoke puff effect
  const smoke = document.createElement('div');
  smoke.textContent = '💨';
  smoke.style.cssText = `
    position: absolute;
    font-size: 1.2rem;
    animation: smokePuff 1s ease-out forwards;
    pointer-events: none;
    z-index: 10;
  `;
  candle.appendChild(smoke);
  setTimeout(() => smoke.remove(), 1000);

  blownCount++;
  const total = document.querySelectorAll('.candle').length;

  if (blownCount === total) {
    document.getElementById('candleHint').textContent = '🎉 Semua lilin berhasil ditiup!';
    setTimeout(() => {
      document.getElementById('wishReveal').style.display = 'block';
      launchConfetti(100);
      createStarBurst();
    }, 800);
  } else {
    document.getElementById('candleHint').textContent = `${total - blownCount} lilin tersisa... terus tiup! 💨`;
  }
}

function createStarBurst() {
  const container = document.getElementById('starBurst');
  const items = ['⭐','💫','✨','🌟','💥','🎊'];
  for (let i = 0; i < 12; i++) {
    const el = document.createElement('span');
    el.textContent = items[Math.floor(Math.random() * items.length)];
    const angle = (i / 12) * 360;
    const dist = 60 + Math.random() * 40;
    el.style.cssText = `
      position: absolute;
      font-size: 1.2rem;
      top: 50%; left: 50%;
      transform-origin: 0 0;
      animation: starBurstAnim 1.5s ease-out both;
      animation-delay: ${i * 0.08}s;
      --tx: ${Math.cos(angle * Math.PI/180) * dist}px;
      --ty: ${Math.sin(angle * Math.PI/180) * dist}px;
    `;
    container.appendChild(el);
  }
  
  const style = document.createElement('style');
  style.textContent = `
    @keyframes starBurstAnim {
      0% { transform: translate(-50%, -50%) scale(0); opacity: 1; }
      60% { opacity: 1; }
      100% { transform: translate(calc(-50% + var(--tx)), calc(-50% + var(--ty))) scale(1.2); opacity: 0; }
    }
    @keyframes smokePuff {
      0% { transform: translateY(0) scale(0.5); opacity: 1; }
      100% { transform: translateY(-30px) scale(1.5); opacity: 0; }
    }
  `;
  document.head.appendChild(style);
}

// ====== SCROLL TO MESSAGE ======
function scrollToMessage() {
  document.getElementById('message').scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// ====== FINAL SECTION STARS ======
function createFinalStars() {
  const container = document.getElementById('starsField');
  if (container.children.length > 0) return;
  for (let i = 0; i < 50; i++) {
    const s = document.createElement('div');
    s.textContent = ['✨','⭐','💫','🌟'][Math.floor(Math.random()*4)];
    s.style.cssText = `
      position: absolute;
      font-size: ${Math.random() * 14 + 8}px;
      left: ${Math.random() * 100}%;
      top: ${Math.random() * 100}%;
      animation: twinkle ${Math.random() * 3 + 2}s ease-in-out infinite;
      animation-delay: ${Math.random() * 3}s;
      opacity: 0.2;
    `;
    container.appendChild(s);
  }
}

// ====== DATE DISPLAY ======
function updateDateDisplay() {
  const now = new Date();
  const months = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'];
  const days = ['Minggu','Senin','Selasa','Rabu','Kamis','Jumat','Sabtu'];
  const dateEl = document.getElementById('heroDate');
  if (dateEl) {
    dateEl.textContent = `🎉 ${days[now.getDay()]}, ${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()} 🎉`;
  }
}

// ====== INIT ======
createStars();
createPetals();
updateDateDisplay();

// Scroll reveal for message section
const msgObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, { threshold: 0.2 });

document.querySelectorAll('.message-wrapper').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(30px)';
  el.style.transition = 'all 0.8s ease';
  msgObserver.observe(el);
});

// Add to head: smoke puff helper (prevent error if element removed)
window.addEventListener('DOMContentLoaded', () => {
  console.log('🎂 Happy Birthday! Website loaded successfully 💕');
});
