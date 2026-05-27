// ===== LOCK PAGE JS =====
const PASSWORD = "23082024"; // Ganti dengan tanggal lahir format DDMMYYYY, contoh: "14022000"
let attempts = 0;
const MAX_ATTEMPTS = 5;

// Generate particles
function createParticles() {
  const container = document.getElementById('particles');
  const colors = ['#e8a0bf', '#d4a853', '#c9547a', '#fff', '#fce4ec'];
  for (let i = 0; i < 60; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    p.style.left = Math.random() * 100 + 'vw';
    p.style.width = (Math.random() * 4 + 1) + 'px';
    p.style.height = p.style.width;
    p.style.background = colors[Math.floor(Math.random() * colors.length)];
    p.style.animationDuration = (Math.random() * 10 + 6) + 's';
    p.style.animationDelay = (Math.random() * 10) + 's';
    container.appendChild(p);
  }
}

// Generate floating hearts
function createHearts() {
  const container = document.getElementById('hearts-bg');
  const emojis = ['💕', '💗', '🌸', '✨', '💫', '🌺', '💝', '⭐'];
  for (let i = 0; i < 20; i++) {
    const h = document.createElement('div');
    h.className = 'heart-float';
    h.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    h.style.left = Math.random() * 100 + 'vw';
    h.style.fontSize = (Math.random() * 16 + 12) + 'px';
    h.style.animationDuration = (Math.random() * 8 + 8) + 's';
    h.style.animationDelay = (Math.random() * 12) + 's';
    container.appendChild(h);
  }
}

function checkPassword() {
  const input = document.getElementById('passwordInput').value.trim();
  const errorMsg = document.getElementById('errorMsg');
  const attemptsInfo = document.getElementById('attemptsInfo');
  const lockIcon = document.getElementById('lockIcon');
  const card = document.querySelector('.lock-card');

  if (input === PASSWORD) {
    // SUCCESS!
    lockIcon.classList.add('unlocked');
    errorMsg.classList.remove('show');

    // 🎵 Putar musik saat password benar
    const music = document.getElementById('bgMusic');
    music.volume = 0.5;
    music.play().catch(e => console.log('Audio error:', e));

    setTimeout(() => {
      const overlay = document.getElementById('successOverlay');
      overlay.classList.add('show');
      // Burst confetti
      burstConfetti();
    }, 600);

    setTimeout(() => {
      window.location.href = 'birthday.html';
    }, 2800);

  } else {
    // WRONG PASSWORD
    attempts++;
    card.classList.remove('shake');
    void card.offsetWidth; // reflow
    card.classList.add('shake');

    errorMsg.classList.add('show');

    const remaining = MAX_ATTEMPTS - attempts;
    if (remaining > 0) {
      attemptsInfo.textContent = `Sisa percobaan: ${remaining} kali lagi 🥺`;
    } else {
      attemptsInfo.textContent = `Hmm, minta petunjuk ya sayang? 🥹`;
      attempts = 0;
    }

    // Clear input
    document.getElementById('passwordInput').value = '';

    // Hide error after 3s
    setTimeout(() => {
      errorMsg.classList.remove('show');
    }, 3000);
  }
}

function burstConfetti() {
  const emojis = ['🎊', '🎉', '💕', '✨', '🌸', '💫', '🎈', '🌺'];
  for (let i = 0; i < 30; i++) {
    setTimeout(() => {
      const el = document.createElement('div');
      el.textContent = emojis[Math.floor(Math.random() * emojis.length)];
      el.style.cssText = `
        position: fixed;
        font-size: ${Math.random() * 20 + 16}px;
        left: ${Math.random() * 100}vw;
        top: -30px;
        z-index: 200;
        pointer-events: none;
        animation: confettiFall ${Math.random() * 1.5 + 1}s ease-in forwards;
      `;
      document.body.appendChild(el);
      setTimeout(() => el.remove(), 2500);
    }, i * 60);
  }

  const style = document.createElement('style');
  style.textContent = `
    @keyframes confettiFall {
      0% { transform: translateY(0) rotate(0deg) scale(0); opacity: 1; }
      100% { transform: translateY(100vh) rotate(720deg) scale(1.2); opacity: 0; }
    }
  `;
  document.head.appendChild(style);
}

// Enter key support
document.getElementById('passwordInput').addEventListener('keydown', (e) => {
  if (e.key === 'Enter') checkPassword();
});

// Initialize
createParticles();
createHearts();
