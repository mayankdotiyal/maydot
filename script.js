// SHARED SITE SCRIPT — theme persistence + thermal stage telemetry controller
document.addEventListener('DOMContentLoaded', function () {
  const body = document.body;
  const slider = document.getElementById('tempSlider');
  const readout = document.getElementById('tempReadout');
  const phaseLabel = document.getElementById('phaseLabel');
  const bandgap = document.getElementById('metricBandgap');
  const irTrans = document.getElementById('metricIR');
  const toggle = document.getElementById('themeToggle');

  const STORAGE_KEY = 'siteThemeMode'; // 'dark' | 'light'

  function applyPhase(isLight, opts) {
    opts = opts || {};
    body.setAttribute('data-phase', isLight ? 'metal' : 'semiconductor');

    if (slider && !opts.skipSlider) {
      slider.value = isLight ? 80 : 25;
    }

    if (readout) {
      const temp = isLight ? 80 : 25;
      readout.innerHTML = isLight
        ? `${temp}&deg;C <span>/ Metallic State</span>`
        : `${temp}&deg;C <span>/ Semiconducting State</span>`;
    }
    if (phaseLabel) {
      phaseLabel.innerHTML = isLight ? 'Tetragonal Rutile (R)' : 'Monoclinic (M&#8321;)';
    }
    if (bandgap) {
      bandgap.innerHTML = isLight ? '0.00 eV (Conductor)' : '~0.60 eV';
    }
    if (irTrans) {
      irTrans.innerHTML = isLight ? 'Reflected (&lt; 10%)' : 'High (85%)';
    }
  }

  function saveTheme(isLight) {
    try {
      localStorage.setItem(STORAGE_KEY, isLight ? 'light' : 'dark');
    } catch (e) { /* localStorage unavailable — theme just won't persist */ }
  }

  function loadTheme() {
    try {
      return localStorage.getItem(STORAGE_KEY);
    } catch (e) {
      return null;
    }
  }

  // Initialize from saved preference (defaults to dark if never set)
  const saved = loadTheme();
  const startIsLight = saved === 'light';
  applyPhase(startIsLight);

  // Toggle button — flips + persists the theme site-wide
  if (toggle) {
    toggle.addEventListener('click', function () {
      const isCurrentlyLight = body.getAttribute('data-phase') === 'metal';
      const next = !isCurrentlyLight;
      applyPhase(next);
      saveTheme(next);
    });
  }

  // Slider — dragging it also updates + persists the site-wide theme,
  // so both controls always stay in sync with each other and across pages
  if (slider) {
    slider.addEventListener('input', function () {
      const temp = parseInt(slider.value, 10);
      const isLight = temp >= 68;
      applyPhase(isLight, { skipSlider: true });
      saveTheme(isLight);
    });
  }
});
