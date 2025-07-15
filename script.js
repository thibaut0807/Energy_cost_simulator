document.getElementById('energy-form').addEventListener('submit', function(e) {
  e.preventDefault();

  const kwh = parseFloat(document.getElementById('kwh-input').value);
  const rate = parseFloat(document.getElementById('rate').value);
  const currency = document.getElementById('currency').value;

  if (isNaN(kwh) || isNaN(rate)) {
    alert("Entrée invalide");
    return;
  }

  const total = kwh * rate;
  document.getElementById('result').textContent = `💰 Total: ${total.toFixed(2)} ${currency}`;
});
