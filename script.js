const form = document.querySelector("#leadForm");
const modal = document.querySelector("#resultModal");
const modalClose = document.querySelector(".modal-close");
const resultStatus = document.querySelector("#resultStatus");
const resultCopy = document.querySelector("#resultCopy");
const progressBar = document.querySelector("#progressBar");
const progressText = document.querySelector("#progressText");
const stepCounter = document.querySelector("#stepCounter");
const prevButton = document.querySelector("#prevStep");
const nextButton = document.querySelector("#nextStep");
const submitButton = document.querySelector("#submitLead");

let currentStepIndex = 0;

function getCheckedValues(name) {
  return [...form.querySelectorAll(`input[name="${name}"]:checked`)].map((input) => input.value);
}

function getPvStatus() {
  return new FormData(form).get("pv");
}

function getActiveSteps() {
  const pv = getPvStatus();
  return [...form.querySelectorAll(".wizard-step")].filter((step) => {
    if (step.dataset.pvOnly === "true") return pv === "yes" || pv === "planned";
    return true;
  });
}

function syncPvDependentOptions() {
  const pv = getPvStatus();
  const hasPv = pv === "yes" || pv === "planned";
  const pvSizeInputs = [...form.querySelectorAll('input[name="pvSize"]')];
  const pvOpt = form.querySelector('[data-topic="pv-opt"]');
  const newPv = form.querySelector('[data-topic="new-pv"]');

  pvSizeInputs.forEach((input) => {
    input.required = hasPv && input.value === "unknown";
    input.disabled = !hasPv;
    if (!hasPv) input.checked = false;
  });

  if (pvOpt) pvOpt.hidden = !hasPv;
  if (newPv) newPv.hidden = hasPv;

  if (!hasPv) {
    form.querySelector('input[name="topics"][value="pv-opt"]').checked = false;
    const newPvInput = form.querySelector('input[name="topics"][value="new-pv"]');
    if (pv === "no" && newPvInput) newPvInput.checked = true;
  }
}

function showStep(index) {
  syncPvDependentOptions();
  const steps = getActiveSteps();
  currentStepIndex = Math.max(0, Math.min(index, steps.length - 1));

  form.querySelectorAll(".wizard-step").forEach((step) => step.classList.remove("is-active"));
  steps[currentStepIndex].classList.add("is-active");

  const percent = Math.round(((currentStepIndex + 1) / steps.length) * 100);
  progressBar.style.width = `${percent}%`;
  progressText.textContent = `${percent}% beantwortet`;
  stepCounter.textContent = `Schritt ${currentStepIndex + 1} von ${steps.length}`;

  prevButton.disabled = currentStepIndex === 0;
  nextButton.hidden = currentStepIndex === steps.length - 1;
  submitButton.hidden = currentStepIndex !== steps.length - 1;
}

function validateCurrentStep() {
  const step = getActiveSteps()[currentStepIndex];
  const fields = [...step.querySelectorAll("input, select")].filter((field) => !field.disabled && !field.hidden);
  const groupedRadios = new Set();

  for (const field of fields) {
    if (field.type === "radio") {
      if (groupedRadios.has(field.name)) continue;
      groupedRadios.add(field.name);
      const checked = step.querySelector(`input[name="${field.name}"]:checked`);
      if (field.required && !checked) return false;
      continue;
    }

    if (!field.checkValidity()) return false;
  }

  return true;
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
  if (pv === "no" && topics.includes("new-pv")) points += 12;

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
  let copy =
    "Vielen Dank. GEBA hat Ihre Angaben erhalten und prüft, ob sich PV-Optimierung, Speicher oder Lastspitzenmanagement für Ihr Unternehmen sinnvoll darstellen lassen.";

  if (normalized >= 70) {
    priority = "urgent";
    copy =
      "Vielen Dank. Ihre Angaben wurden übermittelt. GEBA prüft die Daten und meldet sich mit einer ersten Einschätzung zu Speicher, Eigenverbrauch oder Lastspitzenmanagement.";
  } else if (normalized >= 42) {
    priority = "follow-up";
    copy =
      "Vielen Dank. GEBA bereitet auf Basis Ihrer Angaben eine erste Potenzialbewertung vor und meldet sich mit den nächsten sinnvollen Schritten.";
  }

  return {
    points: normalized,
    priority,
    copy,
    reasons,
  };
}

form.addEventListener("change", (event) => {
  if (event.target.name === "pv") {
    currentStepIndex = 0;
    showStep(0);
  }
});

nextButton.addEventListener("click", () => {
  if (!validateCurrentStep()) {
    getActiveSteps()[currentStepIndex].querySelector("input, select")?.reportValidity();
    return;
  }
  showStep(currentStepIndex + 1);
});

prevButton.addEventListener("click", () => {
  showStep(currentStepIndex - 1);
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!validateCurrentStep()) return;

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

showStep(0);
