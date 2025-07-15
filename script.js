document.getElementById('add-appliance').addEventListener('click', () => {
  const applianceDiv = document.createElement('div');
  applianceDiv.classList.add('appliance');
  applianceDiv.innerHTML = `
    <label>Nom de l'appareil :</label>
    <input type="text" class="name" placeholder="ex: AC" required>
    <label>Puissance (Watts) :</label>
    <input type="number" class="power" required>
    <label>Heures par jour :</label>
    <input type="number" class="hours" step="0.1" required>
  `;
  document.getElementById('appliance-list').appendChild(applianceDiv);
});

let chart;

document.getElementById('calculation-method').addEventListener('change', (e) => {
  const method = e.target.value;
  document.getElementById('appliance-section').style.display = method === 'appliance' ? 'block' : 'none';
  document.getElementById('kwh-section').style.display = method === 'kwh' ? 'block' : 'none';
});

document.getElementById('energy-form').addEventListener('submit', function(e) {
  e.preventDefault();

  const method = document.getElementById('calculation-method').value;
  const rate = parseFloat(document.getElementById('rate').value);
  const currency = document.getElementById('currency').value;

  let totalEnergy = 0;
  let labels = [], data = [];

  if (method === 'appliance') {
    const names = document.querySelectorAll('.name');
    const powers = document.querySelectorAll('.power');
    const hours = document.querySelectorAll('.hours');
    const days = parseFloat(document.getElementById('days').value);

    for (let i = 0; i < powers.length; i++) {
      const name = names[i].value || `Appareil ${i+1}`;
      const power = parseFloat(powers[i].value);
      const hour = parseFloat(hours[i].value);
      const energy = (power * hour * days) / 1000;
      totalEnergy += energy;
      labels.push(name);
      data.push(energy);
    }
  } else {
    const kwhInput = parseFloat(document.getElementById('kwh-input').value);
    if (isNaN(kwhInput) || kwhInput <= 0) {
      alert("Veuillez entrer une valeur valide de kWh relevé.");
      return;
    }
    totalEnergy = kwhInput;
    labels = ["Relevé compteur"];
    data = [totalEnergy];
  }

  const totalCost = totalEnergy * rate;
  document.getElementById('result').textContent =
    `💰 Total: ${totalCost.toFixed(2)} ${currency}`;

  if (chart) chart.destroy();
  chart = new Chart(document.getElementById('energyChart').getContext('2d'), {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: 'Consommation (kWh)',
        data: data,
        backgroundColor: '#007bff'
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: { beginAtZero: true }
      }
    }
  });
});

document.getElementById('reset-btn').addEventListener('click', () => {
  document.getElementById('appliance-list').innerHTML = `
    <div class="appliance">
      <label>Nom de l'appareil :</label>
      <input type="text" class="name" required>
      <label>Puissance (Watts) :</label>
      <input type="number" class="power" required>
      <label>Heures par jour :</label>
      <input type="number" class="hours" step="0.1" required>
    </div>
  `;
  document.getElementById('rate').value = '';
  document.getElementById('kwh-input').value = '';
  document.getElementById('result').textContent = '';
  if (chart) chart.destroy();
});

document.getElementById('toggleLang').addEventListener('click', () => {
  const lang = document.documentElement.lang === 'fr' ? 'en' : 'fr';
  document.documentElement.lang = lang;
  document.querySelectorAll('[data-fr]').forEach(el => {
    el.textContent = el.getAttribute('data-' + lang);
  });
  document.getElementById('toggleLang').textContent = lang === 'fr' ? '🇬🇧 English' : '🇫🇷 Français';
});
