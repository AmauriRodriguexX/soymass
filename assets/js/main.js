/* ════════════════════════════════════════════════════════════
   SOYMAS — main.js
════════════════════════════════════════════════════════════ */

/* ────────────────────────────────────────────────────────────
   TOGGLE DARK / LIGHT
   Lee el CSS original: [data-theme=dark] / [data-theme=light]
   Aquí usamos clases html.dark / html.light
──────────────────────────────────────────────────────────── */
(function () {
  const html       = document.documentElement;
  const toggleBtn  = document.getElementById('theme-toggle');
  const toggleLbl  = document.getElementById('toggle-label');
  const STORAGE_KEY = 'soymas-theme';

  /* Leer preferencia guardada o usar oscuro por defecto */
  let isDark = localStorage.getItem(STORAGE_KEY) !== 'light';

  function applyTheme(dark) {
    if (dark) {
      html.classList.remove('light');
      html.classList.add('dark');
      if (toggleLbl) toggleLbl.textContent = 'Modo oscuro';
    } else {
      html.classList.remove('dark');
      html.classList.add('light');
      if (toggleLbl) toggleLbl.textContent = 'Modo claro';
    }
    localStorage.setItem(STORAGE_KEY, dark ? 'dark' : 'light');
  }

  /* Aplicar al cargar */
  applyTheme(isDark);

  /* Click en el toggle */
  if (toggleBtn) {
    toggleBtn.addEventListener('click', function () {
      isDark = !isDark;
      applyTheme(isDark);
    });
  }
})();


/* ────────────────────────────────────────────────────────────
   NAV RESPONSIVE
──────────────────────────────────────────────────────────── */
(function () {
  const navLinks   = document.getElementById('nav-links');
  const navLogin   = document.getElementById('nav-login');
  const navRegister= document.getElementById('nav-register');
  const menuBtn    = document.getElementById('menu-btn');

  function applyNav() {
    const desktop = window.innerWidth >= 768;
    if (navLinks)    navLinks.style.display    = desktop ? 'flex'        : 'none';
    if (navLogin)    navLogin.style.display    = desktop ? 'inline'      : 'none';
    if (navRegister) navRegister.style.display = desktop ? 'inline-flex' : 'none';
    if (menuBtn)     menuBtn.style.display     = desktop ? 'none'        : 'flex';
  }

  applyNav();
  window.addEventListener('resize', applyNav);
})();


/* ────────────────────────────────────────────────────────────
   CAROUSEL — scroll, dots activos y botones prev/next
──────────────────────────────────────────────────────────── */
(function () {
  const track   = document.querySelector('.carousel-track');
  const dots    = document.querySelectorAll('.dot');
  const btnPrev = document.getElementById('carousel-prev');
  const btnNext = document.getElementById('carousel-next');
  if (!track || !dots.length) return;

  const CARD_WIDTH = 336; /* ~card width + gap */

  function updateDots() {
    const index = Math.round(track.scrollLeft / CARD_WIDTH);
    dots.forEach(function (d, i) {
      d.classList.toggle('active', i === index % dots.length);
    });
  }

  track.addEventListener('scroll', updateDots);

  if (btnPrev) {
    btnPrev.addEventListener('click', function () {
      track.scrollBy({ left: -CARD_WIDTH, behavior: 'smooth' });
    });
  }

  if (btnNext) {
    btnNext.addEventListener('click', function () {
      track.scrollBy({ left: CARD_WIDTH, behavior: 'smooth' });
    });
  }
})();


/* ────────────────────────────────────────────────────────────
   HERO BENEFITS SLIDER + FILTERS
──────────────────────────────────────────────────────────── */
(function () {
  const cards       = Array.from(document.querySelectorAll('.hero-benefit-card'));
  const dots        = Array.from(document.querySelectorAll('.hero-dot'));
  const btnPrev     = document.getElementById('hero-prev');
  const btnNext     = document.getElementById('hero-next');
  const filterBtns  = document.querySelectorAll('.hero-filter-btn');
  
  if (!cards.length || !dots.length) return;

  let current  = 0;
  let interval;
  let activeIndices = cards.map((_, i) => i); // Todos visibles al inicio

  function goTo(indexInArray) {
    if (activeIndices.length === 0) return;
    
    // Ocultar todos los activos de UI
    cards.forEach(c => c.classList.remove('active'));
    dots.forEach(d => d.classList.remove('active'));

    // Asegurar que el índice esté en los límites
    current = (indexInArray + activeIndices.length) % activeIndices.length;
    
    const realIndex = activeIndices[current];
    cards[realIndex].classList.add('active');
    dots[realIndex].classList.add('active');
  }

  function startAuto() {
    clearInterval(interval);
    if (activeIndices.length > 1) {
      interval = setInterval(function () { goTo(current + 1); }, 3500);
    }
  }

  /* Filtros */
  if (filterBtns.length) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', function () {
        // Update tabs UX
        filterBtns.forEach(b => b.classList.remove('active'));
        this.classList.add('active');

        const filterVal = this.dataset.filter;
        
        // Determinar qué índices deben estar activos
        activeIndices = [];
        cards.forEach((card, i) => {
          const cat = card.dataset.category || '';
          if (filterVal === 'all' || cat === filterVal) {
            activeIndices.push(i);
            dots[i].style.display = 'block'; // Mostrar dot
          } else {
            dots[i].style.display = 'none'; // Ocultar dot
            card.classList.remove('active'); // Ocultar card
          }
        });

        // Reiniciar slider a la primera card visible
        goTo(0);
        startAuto();
      });
    });
  }

  /* Clicks en los dots */
  dots.forEach(function (dot, i) {
    dot.addEventListener('click', function () {
      const idxInActive = activeIndices.indexOf(i);
      if (idxInActive !== -1) {
        goTo(idxInActive);
        startAuto();
      }
    });
  });

  /* Botones prev / next */
  if (btnPrev) {
    btnPrev.addEventListener('click', function () {
      goTo(current - 1);
      startAuto();
    });
  }
  if (btnNext) {
    btnNext.addEventListener('click', function () {
      goTo(current + 1);
      startAuto();
    });
  }

  /* Iniciar auto-rotación */
  goTo(0);
  startAuto();
})();
