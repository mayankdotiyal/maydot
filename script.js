// SHARED SITE SCRIPT — theme persistence + thermal stage telemetry controller
// Light mode = Semiconducting (Monoclinic) phase, default
// Dark mode  = Metallic (Rutile) phase
document.addEventListener('DOMContentLoaded', function () {
  const body = document.body;
  const slider = document.getElementById('tempSlider');
  const readout = document.getElementById('tempReadout');
  const phaseLabel = document.getElementById('phaseLabel');
  const bandgap = document.getElementById('metricBandgap');
  const irTrans = document.getElementById('metricIR');
  const toggle = document.getElementById('themeToggle');

  const STORAGE_KEY = 'siteThemeMode'; // 'light' | 'dark'

  function applyPhase(phase, opts) {
    // phase: 'semiconductor' (light) or 'metal' (dark)
    opts = opts || {};
    const isMetal = phase === 'metal';
    body.setAttribute('data-phase', phase);

    if (slider && !opts.skipSlider) {
      slider.value = isMetal ? 80 : 25;
    }

    if (readout) {
      const temp = isMetal ? 80 : 25;
      readout.innerHTML = isMetal
        ? `${temp}&deg;C <span>/ Metallic State</span>`
        : `${temp}&deg;C <span>/ Semiconducting State</span>`;
    }
    if (phaseLabel) {
      phaseLabel.innerHTML = isMetal ? 'Tetragonal Rutile (R)' : 'Monoclinic (M&#8321;)';
    }
    if (bandgap) {
      bandgap.innerHTML = isMetal ? '0.00 eV (Conductor)' : '~0.60 eV';
    }
    if (irTrans) {
      irTrans.innerHTML = isMetal ? 'Reflected (&lt; 10%)' : 'High (85%)';
    }
  }

  function saveTheme(isDark) {
    try {
      localStorage.setItem(STORAGE_KEY, isDark ? 'dark' : 'light');
    } catch (e) { /* localStorage unavailable — theme just won't persist */ }
  }

  function loadTheme() {
    try {
      return localStorage.getItem(STORAGE_KEY);
    } catch (e) {
      return null;
    }
  }

  // Initialize from saved preference (defaults to light/semiconductor if never set)
  const saved = loadTheme();
  const startIsDark = saved === 'dark';
  applyPhase(startIsDark ? 'metal' : 'semiconductor');

  // Toggle button — flips + persists the theme site-wide
  if (toggle) {
    toggle.addEventListener('click', function () {
      const isCurrentlyDark = body.getAttribute('data-phase') === 'metal';
      const nextIsDark = !isCurrentlyDark;
      applyPhase(nextIsDark ? 'metal' : 'semiconductor');
      saveTheme(nextIsDark);
    });
  }

  // Slider — dragging it also updates + persists the site-wide theme,
  // so both controls always stay in sync with each other and across pages
  if (slider) {
    slider.addEventListener('input', function () {
      const temp = parseInt(slider.value, 10);
      const isMetal = temp >= 68;
      applyPhase(isMetal ? 'metal' : 'semiconductor', { skipSlider: true });
      saveTheme(isMetal);
    });
  }
});
