// THE THERMAL STAGE TELEMETRY CONTROLLER — shared across every page
document.addEventListener('DOMContentLoaded', function () {
  const slider = document.getElementById('tempSlider');
  const readout = document.getElementById('tempReadout');
  const phaseLabel = document.getElementById('phaseLabel');
  const bandgap = document.getElementById('metricBandgap');
  const irTrans = document.getElementById('metricIR');
  const body = document.body;

  if (!slider) return;

  function updateStage() {
    const temp = parseInt(slider.value, 10);
    const isMetal = temp >= 68;

    body.setAttribute('data-phase', isMetal ? 'metal' : 'semiconductor');

    if (isMetal) {
      readout.innerHTML = `${temp}&deg;C <span>/ Metallic State</span>`;
      phaseLabel.innerHTML = 'Tetragonal Rutile (R)';
      bandgap.innerHTML = '0.00 eV (Conductor)';
      irTrans.innerHTML = 'Reflected (&lt; 10%)';
    } else {
      readout.innerHTML = `${temp}&deg;C <span>/ Semiconducting State</span>`;
      phaseLabel.innerHTML = 'Monoclinic (M&#8321;)';
      bandgap.innerHTML = '~0.60 eV';
      irTrans.innerHTML = 'High (85%)';
    }
  }

  slider.addEventListener('input', updateStage);
});
