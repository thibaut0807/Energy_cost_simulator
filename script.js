document.getElementById('add-appliance').addEventListener('click', () => {
  const applianceDiv = document.createElement('div');
  applianceDiv.classList.add('appliance');
  applianceDiv.innerHTML = `
    <label>Appliance Name:</label>
    <input type="text" class="name" placeholder="e.g. AC" required>

    <label>Power (Watts):</label>
    <input type="number" class="power" required>

    <label>Daily Usage (Hours):</label>
    <input type="number" class="hours" step="0.1" required>
  `;
  document.getElementById('appliance-list').appendChild(applianceDiv);
});

document.getElementById('energy-form').addEventListener('submit', function(e) {
  e.preventDefault();

  const powers = document.querySelectorAll('.power');
  const hours = document.querySelectorAll('.hours');
  const days = parseFloat(document.getElementById('days').value);
  const rate = parseFloat(document.getElementById('rate').value);

  let totalEnergyKWh = 0;

  for (let i = 0; i < powers.length; i++) {
    const power = parseFloat(powers[i].value);
    const hour = parseFloat(hours[i].value);
    totalEnergyKWh += (power * hour * days) / 1000;
  }

  const totalCost = totalEnergyKWh * rate;
  document.getElementById('result').textContent =
    `💰 Total Monthly Cost: ${totalCost.toFixed(2)} currency units`;
});

document.getElementById('reset-btn').addEventListener('click', () => {
  document.getElementById('appliance-list').innerHTML = `
    <div class="appliance">
      <label>Appliance Name:</label>
      <input type="text" class="name" placeholder="e.g. Fan" required>

      <label>Power (Watts):</label>
      <input type="number" class="power" required>

      <label>Daily Usage (Hours):</label>
      <input type="number" class="hours" step="0.1" required>
    </div>
  `;
  document.getElementById('days').value = 30;
  document.getElementById('rate').value = '';
  document.getElementById('result').textContent = '';
});
