let chart; // graphique global

// ⚡ Changement de méthode de calcul
document.getElementById("method").addEventListener("change", () => {
  const method = document.getElementById("method").value;
  document.getElementById("compteur-mode").style.display = method === "compteur" ? "block" : "none";
  document.getElementById("appareil-mode").style.display = method === "appareils" ? "block" : "none";
  document.getElementById("result").textContent = "";
  if (chart) chart.destroy();
  document.getElementById("chart").style.display = method === "compteur" ? "none" : "block";
});

// ➕ Ajouter un appareil dynamiquement
document.getElementById("add-appliance").addEventListener("click", () => {
  const div = document.createElement("div");
  div.classList.add("appliance");
  div.innerHTML = `
    <input type="text" class="name" placeholder="Nom" />
    <input type="number" class="power" placeholder="Watt" />
    <input type="number" class="hours" placeholder="Heures/jour" step="0.1" />
  `;
  document.getElementById("appliance-list").appendChild(div);
});

// 🧮 Calcul total
document.getElementById("calculate").addEventListener("click", () => {
  const method = document.getElementById("method").value;
  const currency = document.getElementById("currency").value;
  let total = 0;

  if (method === "compteur") {
    const kwh = parseFloat(document.getElementById("kwh-input").value);
    const rate = parseFloat(document.getElementById("rate-compteur").value);
    if (isNaN(kwh) || isNaN(rate)) return alert("Veuillez remplir tous les champs.");
    total = kwh * rate;
    document.getElementById("result").textContent =
      `✅ Vous avez consommé ${kwh.toFixed(2)} kWh • 💰 Coût total : ${total.toFixed(2)} ${currency}`;
    if (chart) chart.destroy();
    document.getElementById("chart").style.display = "none";
  }

  else if (method === "appareils") {
    const powers = document.querySelectorAll(".power");
    const hours = document.querySelectorAll(".hours");
    const names = document.querySelectorAll(".name");
    const rate = parseFloat(document.getElementById("rate-appareil").value);
    const days = parseFloat(document.getElementById("days").value);

    if (isNaN(rate) || isNaN(days)) return alert("Champs de tarif ou jours manquants.");

    let labels = [], data = [];

    for (let i = 0; i < powers.length; i++) {
      const power = parseFloat(powers[i].value);
      const hour = parseFloat(hours[i].value);
      const name = names[i].value || `Appareil ${i + 1}`;

      if (!isNaN(power) && !isNaN(hour)) {
        const energy = (power * hour * days) / 1000;
        total += energy * rate;
        labels.push(name);
        data.push(energy);
      }
    }

    document.getElementById("result").textContent =
      `💰 Coût total : ${total.toFixed(2)} ${currency}`;
    
    // 🎨 Graphique
    const ctx = document.getElementById("chart").getContext("2d");
    if (chart) chart.destroy();
    chart = new Chart(ctx, {
      type: "bar",
      data: {
        labels: labels,
        datasets: [{
          label: "kWh/mois",
          data: data,
          backgroundColor: "#007bff"
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false }
        },
        scales: {
          y: {
            beginAtZero: true,
            title: { display: true, text: "Consommation (kWh)" }
          }
        }
      }
    });

    document.getElementById("chart").style.display = "block";
  }
});

// 🔄 Réinitialiser
document.getElementById("reset").addEventListener("click", () => {
  location.reload();
});

// 🌐 Changer de langue
document.getElementById("toggleLang").addEventListener("click", () => {
  const lang = document.documentElement.lang === "fr" ? "en" : "fr";
  document.documentElement.lang = lang;
  document.querySelectorAll("[data-fr]").forEach(el => {
    el.textContent = el.getAttribute("data-" + lang);
  });
  document.getElementById("toggleLang").textContent = lang === "fr" ? "🇬🇧 English" : "🇫🇷 Français";
});
