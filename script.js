const form = document.querySelector("#leadForm");
const modal = document.querySelector("#resultModal");
const modalClose = document.querySelector(".modal-close");
const resultStatus = document.querySelector("#resultStatus");
const resultCopy = document.querySelector("#resultCopy");
const resultReasons = document.querySelector("#resultReasons");
const progressBar = document.querySelector("#progressBar");
const progressText = document.querySelector("#progressText");
const stepCounter = document.querySelector("#stepCounter");
const prevButton = document.querySelector("#prevStep");
const nextButton = document.querySelector("#nextStep");
const submitButton = document.querySelector("#submitLead");
const potentialHeadline = document.querySelector("#potentialHeadline");
const potentialHint = document.querySelector("#potentialHint");
const resultEyebrow = document.querySelector("#resultEyebrow");
const formNote = document.querySelector("#formNote");

const STORAGE_KEY = "geba-commercial-check-v2";
const ATTRIBUTION_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "gclid", "wbraid", "gbraid"];
let currentStepIndex = 0;
let modalReturnFocus = null;

window.dataLayer = window.dataLayer || [];

function track(event, payload = {}) {
  window.dataLayer.push({ event, ...payload });
}

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

function setAttribution() {
  const params = new URLSearchParams(window.location.search);
  ATTRIBUTION_KEYS.forEach((key) => {
    const current = params.get(key);
    const stored = sessionStorage.getItem(`geba_${key}`);
    const value = current || stored || "";
    if (current) sessionStorage.setItem(`geba_${key}`, current);
    const input = form.elements.namedItem(key);
    if (input) input.value = value;
  });
  form.elements.landing_page.value = window.location.href;
  form.elements.referrer.value = document.referrer;
  form.elements.form_started_at.value = new Date().toISOString();
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
    const pvOptInput = form.querySelector('input[name="topics"][value="pv-opt"]');
    if (pvOptInput) pvOptInput.checked = false;
    const newPvInput = form.querySelector('input[name="topics"][value="new-pv"]');
    if (pv === "no" && newPvInput) newPvInput.checked = true;
  }
}

function saveProgress() {
  const data = {};
  new FormData(form).forEach((value, key) => {
    if (key === "consent" || key === "website") return;
    if (data[key]) data[key] = Array.isArray(data[key]) ? [...data[key], value] : [data[key], value];
    else data[key] = value;
  });
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ data, step: currentStepIndex, savedAt: Date.now() }));
}

function restoreProgress() {
  try {
    const saved = JSON.parse(sessionStorage.getItem(STORAGE_KEY));
    if (!saved || Date.now() - saved.savedAt > 24 * 60 * 60 * 1000) return;
    Object.entries(saved.data || {}).forEach(([name, value]) => {
      const values = Array.isArray(value) ? value : [value];
      const fields = [...form.querySelectorAll(`[name="${CSS.escape(name)}"]`)];
      fields.forEach((field) => {
        if (field.type === "radio" || field.type === "checkbox") field.checked = values.includes(field.value);
        else if (!ATTRIBUTION_KEYS.includes(name)) field.value = values[0];
      });
    });
    currentStepIndex = Number(saved.step) || 0;
  } catch {
    sessionStorage.removeItem(STORAGE_KEY);
  }
}

function showStep(index, direction = "direct") {
  syncPvDependentOptions();
  const steps = getActiveSteps();
  currentStepIndex = Math.max(0, Math.min(index, steps.length - 1));

  form.querySelectorAll(".wizard-step").forEach((step) => step.classList.remove("is-active"));
  const activeStep = steps[currentStepIndex];
  activeStep.classList.add("is-active");

  const percent = Math.round(((currentStepIndex + 1) / steps.length) * 100);
  progressBar.style.width = `${percent}%`;
  progressText.textContent = `${percent}% beantwortet`;
  stepCounter.textContent = `Schritt ${currentStepIndex + 1} von ${steps.length}`;
  prevButton.disabled = currentStepIndex === 0;
  nextButton.hidden = currentStepIndex === steps.length - 1;
  submitButton.hidden = currentStepIndex !== steps.length - 1;
  saveProgress();

  track("geba_check_step_view", {
    step_number: currentStepIndex + 1,
    step_name: activeStep.querySelector(".step-kicker")?.textContent.trim(),
    direction,
  });
}

function validateCurrentStep() {
  const step = getActiveSteps()[currentStepIndex];
  const fields = [...step.querySelectorAll("input, select")].filter((field) => !field.disabled && !field.hidden);
  const groupedRadios = new Set();

  for (const field of fields) {
    if (field.type === "radio") {
      if (groupedRadios.has(field.name)) continue;
      groupedRadios.add(field.name);
      if (field.required && !step.querySelector(`input[name="${field.name}"]:checked`)) {
        field.setCustomValidity("Bitte wählen Sie eine Antwort aus.");
        field.reportValidity();
        field.setCustomValidity("");
        return false;
      }
      continue;
    }
    if (!field.checkValidity()) {
      field.reportValidity();
      return false;
    }
  }

  if (step.dataset.step === "4" && getCheckedValues("topics").length === 0) {
    const firstTopic = step.querySelector('input[name="topics"]');
    firstTopic.setCustomValidity("Bitte wählen Sie mindestens ein Ziel aus.");
    firstTopic.reportValidity();
    firstTopic.setCustomValidity("");
    return false;
  }
  return true;
}

function calculateScore() {
  const data = new FormData(form);
  const topics = getCheckedValues("topics");
  let points = 0;
  const reasons = [];
  const pv = data.get("pv");
  const pvSize = data.get("pvSize");
  const consumption = data.get("consumption");
  const loadTime = data.get("loadTime");
  const peakPower = data.get("peakPower");

  if (pv === "yes") { points += 20; reasons.push("bestehende PV-Anlage"); }
  if (pv === "planned") { points += 12; reasons.push("PV-Anlage in Planung"); }
  if (pv === "no" && topics.includes("new-pv")) points += 8;
  if (pvSize === "medium") points += 8;
  if (pvSize === "large" || pvSize === "enterprise") { points += 14; reasons.push("relevante PV-Leistung"); }
  if (consumption === "mid") { points += 12; reasons.push("relevanter Jahresverbrauch"); }
  if (consumption === "high" || consumption === "very-high") { points += 20; reasons.push("hoher Jahresstromverbrauch"); }
  if (loadTime === "peaks") { points += 16; reasons.push("erkennbare Lastspitzen"); }
  if (loadTime === "day" || loadTime === "mixed") points += 6;
  if (["100-250", "250-500", "over-500"].includes(peakPower)) { points += 12; reasons.push("betriebliche Leistungsspitzen"); }
  if (topics.includes("storage")) points += 10;
  if (topics.includes("peaks")) points += 12;
  if (topics.includes("pv-opt")) points += 8;
  if (topics.includes("charging")) points += 5;
  if (data.get("data") === "yes") { points += 8; reasons.push("Lastgang- oder Rechnungsdaten vorhanden"); }
  if (data.get("timeline") === "now") points += 8;
  if (data.get("timeline") === "quarter") points += 5;

  const normalized = Math.min(points, 100);
  const grade = normalized >= 72 ? "A" : normalized >= 45 ? "B" : "C";
  const priority = grade === "A" ? "priority" : grade === "B" ? "qualified" : "nurture";
  const copy = grade === "A"
    ? "Ihre Angaben zeigen mehrere konkrete Ansatzpunkte. GEBA sollte Lastgang, PV-Erzeugung und Leistungsspitzen zeitnah gemeinsam prüfen."
    : grade === "B"
      ? "Ihre Angaben zeigen prüfbares Potenzial. GEBA ordnet die Daten ein und empfiehlt die nächsten sinnvollen Analyseschritte."
      : "Ihre Angaben sind für eine erste Einordnung erfasst. GEBA prüft, welche Daten für eine belastbare Aussage noch fehlen.";

  return { points: normalized, grade, priority, copy, reasons: [...new Set(reasons)].slice(0, 4) };
}

function updatePotentialPreview() {
  const data = new FormData(form);
  const score = calculateScore();
  const hasSignal = data.get("pv") || data.get("consumption") || getCheckedValues("topics").length;
  if (!hasSignal) {
    potentialHeadline.textContent = "Noch keine Angaben bewertet";
    potentialHint.textContent = "Der Check passt Fragen und Hinweise an Ihre Situation an.";
    return;
  }
  potentialHeadline.textContent = score.grade === "A" ? "Mehrere starke Potenzialsignale" : score.grade === "B" ? "Prüfbares Potenzial erkennbar" : "Datenbasis wird aufgebaut";
  potentialHint.textContent = score.reasons.length ? `Aktuelle Signale: ${score.reasons.join(", ")}.` : "Weitere Angaben verbessern die technische Einordnung.";
}

function buildLeadPayload(score) {
  const payload = Object.fromEntries(new FormData(form).entries());
  payload.topics = getCheckedValues("topics");
  payload.lead_score = score.points;
  payload.lead_grade = score.grade;
  payload.lead_route = score.priority;
  payload.qualification_reasons = score.reasons;
  payload.submitted_at = new Date().toISOString();
  payload.page_title = document.title;
  delete payload.website;
  return payload;
}

async function submitLead(payload) {
  const endpoint = form.dataset.endpoint?.trim();
  if (!endpoint) return { demo: true };
  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(payload),
  });
  if (!response.ok) throw new Error(`Lead endpoint returned ${response.status}`);
  return response.json().catch(() => ({}));
}

function openResult(score, demo) {
  modalReturnFocus = document.activeElement;
  resultEyebrow.textContent = demo ? "Demo-Auswertung" : "Vorprüfung abgeschlossen";
  resultStatus.textContent = score.grade === "A" ? "Hohes Prüfpotenzial" : score.grade === "B" ? "Qualifizierte Vorprüfung" : "Erste Einordnung";
  resultCopy.textContent = score.copy;
  resultReasons.innerHTML = score.reasons.map((reason) => `<li>${reason}</li>`).join("");
  modal.querySelector(".modal-note").textContent = demo
    ? "Demo-Modus: Die Qualifizierung funktioniert bereits, der produktive GEBA-Endpunkt ist noch nicht verbunden."
    : "Ihre Anfrage wurde sicher an GEBA übermittelt. Das Team prüft die Angaben und meldet sich persönlich.";
  modal.hidden = false;
  document.body.classList.add("modal-open");
  modalClose.focus();
}

function closeResult() {
  modal.hidden = true;
  document.body.classList.remove("modal-open");
  modalReturnFocus?.focus();
}

form.addEventListener("change", (event) => {
  if (event.target.name === "pv") {
    currentStepIndex = 0;
    showStep(0, "branch-reset");
  }
  saveProgress();
  updatePotentialPreview();
});

nextButton.addEventListener("click", () => {
  if (!validateCurrentStep()) return;
  track("geba_check_step_complete", { step_number: currentStepIndex + 1 });
  showStep(currentStepIndex + 1, "next");
});

prevButton.addEventListener("click", () => showStep(currentStepIndex - 1, "back"));

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!validateCurrentStep() || form.elements.website.value) return;
  const score = calculateScore();
  const payload = buildLeadPayload(score);
  submitButton.disabled = true;
  submitButton.textContent = "Wird sicher vorbereitet …";
  try {
    const response = await submitLead(payload);
    track("generate_lead", { lead_grade: score.grade, lead_score: score.points, lead_route: score.priority, value: 1, currency: "EUR" });
    openResult(score, Boolean(response.demo));
    sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    resultStatus.textContent = "Übermittlung nicht möglich";
    resultCopy.textContent = "Bitte versuchen Sie es erneut oder kontaktieren Sie GEBA telefonisch unter 07765 – 918 375.";
    resultReasons.innerHTML = "";
    modal.hidden = false;
    document.body.classList.add("modal-open");
    modalClose.focus();
    track("geba_lead_error");
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = "Potenzialbewertung anfordern";
  }
});

document.querySelectorAll("[data-cta]").forEach((cta) => {
  cta.addEventListener("click", () => track("geba_cta_click", { cta_name: cta.dataset.cta }));
});

modalClose.addEventListener("click", closeResult);
modal.addEventListener("click", (event) => { if (event.target === modal) closeResult(); });
document.addEventListener("keydown", (event) => { if (event.key === "Escape" && !modal.hidden) closeResult(); });

setAttribution();
if (form.dataset.endpoint?.trim()) {
  formNote.innerHTML = '<span aria-hidden="true">🔒</span> Sichere Übermittlung. Verarbeitung ausschließlich zur GEBA-Potenzialbewertung.';
}
restoreProgress();
showStep(currentStepIndex);
updatePotentialPreview();
track("geba_check_loaded", { page_path: window.location.pathname });

const siteHeader = document.querySelector(".site-header");
const heroBackground = document.querySelector(".hero-bg");
const heroSection = document.querySelector(".hero");
const mobileCta = document.querySelector(".mobile-cta");
const motionAllowed = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function updatePageMotion() {
  siteHeader?.classList.toggle("is-scrolled", window.scrollY > 28);
  if (motionAllowed && heroBackground && window.scrollY < 900) {
    heroBackground.style.translate = `0 ${Math.min(window.scrollY * 0.12, 70)}px`;
  }
}

const revealItems = document.querySelectorAll(
  ".sales-copy, .decision-cards article, .compact-heading, .benefit-grid article, .check-intro, .lead-form, .reference-image, .reference-copy, .process-list li, .trust-layout > div, .faq-layout > div"
);

if (motionAllowed && "IntersectionObserver" in window) {
  revealItems.forEach((item) => item.classList.add("reveal-target"));
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -7%" });
  revealItems.forEach((item) => revealObserver.observe(item));
}

if (heroSection && mobileCta && "IntersectionObserver" in window) {
  const heroObserver = new IntersectionObserver(([entry]) => {
    mobileCta.classList.toggle("is-visible", !entry.isIntersecting);
  }, { threshold: 0.08 });
  heroObserver.observe(heroSection);
}

window.addEventListener("scroll", updatePageMotion, { passive: true });
updatePageMotion();
