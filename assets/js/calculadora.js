/* ============================================================
   Calculadora de Ahorro — Soy+
   ============================================================ */
(function () {
  'use strict';

  const MEMBERSHIP_COST = 480;

  const CONFIG = {
    pharma: { discount: 0.25, step: 100,  max: 5000,  freq: 'monthly' },
    entret: { discount: 0.40, step: 100,  max: 3000,  freq: 'monthly' },
    educ:   { discount: 0.10, step: 1000, max: 50000, freq: 'annual'  }
  };

  function getMonthlySaving(pharma, entret, educ) {
    return (pharma * 0.25) + (entret * 0.40) + ((educ * 0.10) / 12);
  }

  function fmt(n) {
    return '$' + Math.round(n).toLocaleString('es-MX') + ' MXN';
  }

  function updateFill(inputEl) {
    const pct = ((inputEl.value - inputEl.min) / (inputEl.max - inputEl.min)) * 100;
    inputEl.style.setProperty('--fill', pct + '%');
  }

  function updateUI() {
    const pharmaEl = document.getElementById('calc-pharma');
    const entretEl = document.getElementById('calc-entret');
    const educEl   = document.getElementById('calc-educ');
    if (!pharmaEl) return;

    const pharma = +pharmaEl.value;
    const entret = +entretEl.value;
    const educ   = +educEl.value;

    // Valores mostrados en los sliders
    document.getElementById('calc-pharma-val').textContent = fmt(pharma);
    document.getElementById('calc-entret-val').textContent = fmt(entret);
    document.getElementById('calc-educ-val').textContent   = fmt(educ);

    // Fills de color
    [pharmaEl, entretEl, educEl].forEach(updateFill);

    // Cálculo
    const monthly = getMonthlySaving(pharma, entret, educ);
    const annual  = monthly * 12;

    document.getElementById('calc-res-monthly').textContent = fmt(monthly);
    document.getElementById('calc-res-annual').textContent  = fmt(annual);

    // Barra de progreso ROI
    const barEl  = document.getElementById('calc-roi-bar-fill');
    const roiEl  = document.getElementById('calc-roi-msg');
    const ctaEl  = document.getElementById('calc-cta-wrap');

    if (monthly === 0) {
      roiEl.textContent = 'Mueve los deslizadores para ver cuánto puedes ahorrar.';
      roiEl.className   = 'calc-roi-msg';
      if (barEl) barEl.style.width = '0%';
      if (ctaEl) ctaEl.style.opacity = '0.5';
    } else {
      const months = MEMBERSHIP_COST / monthly;
      const pctBar = Math.min(100, (monthly / MEMBERSHIP_COST) * 100);
      if (barEl) barEl.style.width = pctBar + '%';
      if (ctaEl) ctaEl.style.opacity = '1';

      if (monthly >= MEMBERSHIP_COST) {
        roiEl.textContent = '🎉 ¡Tu membresía se paga sola en tu primer mes!';
        roiEl.className   = 'calc-roi-msg calc-roi-great';
      } else {
        const m = Math.ceil(months);
        roiEl.textContent = `Tu membresía de $480 se paga sola en ${m} ${m === 1 ? 'mes' : 'meses'}.`;
        roiEl.className   = m <= 3 ? 'calc-roi-msg calc-roi-great' : 'calc-roi-msg calc-roi-good';
      }
    }
  }

  function initSteppers() {
    document.querySelectorAll('.calc-stepper').forEach(function (btn) {
      btn.addEventListener('click', function () {
        const input = document.getElementById('calc-' + this.dataset.target);
        if (!input) return;
        const dir  = +this.dataset.dir;
        const step = +input.step;
        const val  = Math.min(+input.max, Math.max(+input.min, +input.value + dir * step));
        input.value = val;
        updateUI();
      });
    });
  }

  function init() {
    ['calc-pharma', 'calc-entret', 'calc-educ'].forEach(function (id) {
      const el = document.getElementById(id);
      if (el) { el.addEventListener('input', updateUI); updateFill(el); }
    });
    initSteppers();
    updateUI();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
