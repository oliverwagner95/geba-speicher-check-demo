const form = document.querySelector("#leadForm");
const modal = document.querySelector("#resultModal");
const modalClose = document.querySelector(".modal-close");
const resultStatus = document.querySelector("#resultStatus");
const resultCopy = document.querySelector("#resultCopy");

function getCheckedValues(name) {
  return [...form.querySelectorAll(`input[name="${name}"]:checked`)].map((input) => input.value);
}

function calculateScore() {
  const data = new FormData(form);
  const topics = getCheckedValues("topics");
  let points = 0;
  const reasons = [];

  const pv = data.get("pv");
  if (pv === "yes") {
    points += 28;
    reasons.push("bestehende PV-Anlage");
  }
  if (pv === "planned") {
    points += 18;
    reasons.push("PV-Anlage in Planung");
  }

  const pvSize = data.get("pvSize");
  if (pvSize === "medium") points += 12;
  if (pvSize === "large" || pvSize === "enterprise") points += 18;

  const consumption = data.get("consumption");
  if (consumption === "mid") {
    points += 14;
    reasons.push("relevanter Jahresverbrauch");
  }
  if (consumption === "high" || consumption === "very-high") {
    points += 24;
    reasons.push("hoher Jahresstromverbrauch");
  }

  const loadTime = data.get("loadTime");
  if (loadTime === "peaks") {
    points += 20;
    reasons.push("schwankende Lasten / Lastspitzen");
  }
  if (loadTime === "day" || loadTime === "mixed") points += 8;

  if (topics.includes("storage")) points += 14;
  if (topics.includes("peaks")) points += 16;
  if (topics.includes("pv-opt")) points += 10;
  if (topics.includes("charging")) points += 8;
  if (topics.includes("costs")) points += 6;

  if (data.get("data") === "yes") {
    points += 10;
    reasons.push("Datenbasis vorhanden");
  }

  const timeline = data.get("timeline");
  if (timeline === "now") points += 12;
  if (timeline === "quarter") points += 8;

  if ((data.get("phone") || "").trim().length > 5) points += 5;

  const normalized = Math.min(points, 100);
  let priority = "standard";
  let copy = "Vielen Dank. GEBA hat Ihre Angaben erhalten und prüft, ob sich PV-Optimierung, Speicher oder Lastspitzenmanagement für Ihr Unternehmen sinnvoll darstellen lassen.";

  if (normalized >= 70) {
    priority = "urgent";
    copy = "Vielen Dank. Ihre Angaben wurden übermittelt. GEBA prüft die Daten und meldet sich mit einer ersten Einschätzung zu Speicher, Eigenverbrauch oder Lastspitzenmanagement.";
  } else if (normalized >= 42) {
    priority = "follow-up";
    copy = "Vielen Dank. GEBA bereitet auf Basis Ihrer Angaben eine erste Potenzialbewertung vor und meldet sich mit den nächsten sinnvollen Schritten.";
  }

  return {
    points: normalized,
    priority,
    copy,
    reasons,
  };
}

function updateScore() {
  calculateScore();
}

form.addEventListener("input", updateScore);
form.addEventListener("change", updateScore);

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const score = calculateScore();
  resultStatus.textContent = "Anfrage erfolgreich vorbereitet";
  resultCopy.textContent = score.copy;
  modal.hidden = false;
});

modalClose.addEventListener("click", () => {
  modal.hidden = true;
});

modal.addEventListener("click", (event) => {
  if (event.target === modal) {
    modal.hidden = true;
  }
});

updateScore();
