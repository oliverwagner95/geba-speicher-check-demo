const form = document.querySelector("#leadForm");
const scoreLabel = document.querySelector("#scoreLabel");
const scoreHint = document.querySelector("#scoreHint");
const modal = document.querySelector("#resultModal");
const modalClose = document.querySelector(".modal-close");
const resultScore = document.querySelector("#resultScore");
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
  let label = "C-Lead";
  let hint = "Informationsinteresse. Für Nurturing oder E-Mail-Follow-up geeignet.";
  let copy =
    "Die Angaben zeigen erstes Interesse. In der Live-Version würde der Kontakt in ein Nurturing oder ein leichtes Follow-up laufen.";

  if (normalized >= 70) {
    label = "A-Lead";
    hint = "Hohe Priorität. Telefonische Kontaktaufnahme innerhalb von 24 Stunden.";
    copy =
      "Die Angaben sprechen für hohes Potenzial. Dieser Lead sollte schnell telefonisch qualifiziert und in ein GEBA-Beratungsgespräch überführt werden.";
  } else if (normalized >= 42) {
    label = "B-Lead";
    hint = "Mittlere Priorität. E-Mail-Bewertung plus gezieltes Follow-up.";
    copy =
      "Die Angaben zeigen relevantes Potenzial. Sinnvoll ist eine kurze Potenzialbewertung per E-Mail und ein nachgelagerter Qualifizierungsanruf.";
  }

  return {
    points: normalized,
    label,
    hint,
    copy,
    reasons,
  };
}

function updateScore() {
  const score = calculateScore();
  scoreLabel.textContent = `${score.label} (${score.points}/100)`;
  scoreHint.textContent = score.hint;
}

form.addEventListener("input", updateScore);
form.addEventListener("change", updateScore);

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const score = calculateScore();
  resultScore.textContent = `${score.label} · ${score.points}/100`;
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
