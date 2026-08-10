const header = document.querySelector("[data-header]");
const wizard = document.querySelector("[data-private-wizard]");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

window.dataLayer = window.dataLayer || [];

function track(event, payload = {}) {
  window.dataLayer.push({ event, ...payload });
}

if (!reduceMotion) {
  document.documentElement.classList.add("motion-ready");
  requestAnimationFrame(() => document.documentElement.classList.add("motion-active"));
}

const revealElements = [...document.querySelectorAll("[data-reveal]")];
if (reduceMotion || !("IntersectionObserver" in window)) {
  revealElements.forEach((element) => element.classList.add("is-visible"));
} else {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { rootMargin: "0px 0px -8% 0px", threshold: 0.12 },
  );
  revealElements.forEach((element) => revealObserver.observe(element));
}

const setHeaderState = () => {
  header?.classList.toggle("is-scrolled", window.scrollY > 24);
};

setHeaderState();
window.addEventListener("scroll", setHeaderState, { passive: true });

const initFundingStory = () => {
  const story = document.querySelector("[data-funding-story]");
  const stage = story?.querySelector("[data-funding-story-stage]");
  const moments = story ? [...story.querySelectorAll("[data-funding-moment]")] : [];
  const bonusMoments = story ? [...story.querySelectorAll("[data-bonus-moment]")] : [];
  const bonusBars = bonusMoments.map((moment) => moment.querySelector("i")).filter(Boolean);
  const progress = story?.querySelector("[data-funding-progress]");
  const canAnimate =
    story &&
    stage &&
    moments.length === 3 &&
    bonusMoments.length === 5 &&
    !reduceMotion &&
    window.matchMedia("(min-width: 901px)").matches &&
    window.gsap &&
    window.ScrollTrigger;

  if (!canAnimate) return;

  const { gsap, ScrollTrigger } = window;
  gsap.registerPlugin(ScrollTrigger);
  document.documentElement.classList.add("funding-story-ready");

  gsap.set(moments, { autoAlpha: 0.34, scale: 0.965, y: 14 });
  gsap.set(bonusMoments, { autoAlpha: 0.34, y: 10 });
  gsap.set(bonusBars, { scaleY: 0.08, transformOrigin: "bottom center" });
  gsap.set(moments[0], { autoAlpha: 1, scale: 1, y: 0 });
  gsap.set(bonusMoments[0], { autoAlpha: 1, y: 0 });
  gsap.set(bonusBars[0], { scaleY: 1 });

  const timeline = gsap.timeline({
    defaults: { ease: "none" },
    scrollTrigger: {
      id: "geba-funding-story",
      trigger: story,
      start: "top top+=72",
      end: () => `+=${Math.round(window.innerHeight * 1.35)}`,
      scrub: 0.9,
      pin: stage,
      anticipatePin: 1,
      invalidateOnRefresh: true,
    },
  });

  timeline
    .to(progress, { scaleX: 0.32, duration: 0.55 }, 0)
    .to(moments[0], { autoAlpha: 0.42, scale: 0.97, y: -8, duration: 0.28 }, 0.7)
    .to(moments[1], { autoAlpha: 1, scale: 1, y: 0, duration: 0.3 }, 0.7)
    .to(bonusMoments[1], { autoAlpha: 1, y: 0, duration: 0.28 }, 0.7)
    .to(bonusBars[1], { scaleY: 1, duration: 0.28 }, 0.7)
    .to(progress, { scaleX: 0.64, duration: 0.45 }, 0.7)
    .to(moments[1], { autoAlpha: 0.42, scale: 0.97, y: -8, duration: 0.3 }, 1.35)
    .to(moments[2], { autoAlpha: 1, scale: 1, y: 0, duration: 0.32 }, 1.35)
    .to(bonusMoments.slice(2), { autoAlpha: 1, y: 0, stagger: 0.1, duration: 0.38 }, 1.35)
    .to(bonusBars.slice(2), { scaleY: 1, stagger: 0.1, duration: 0.38 }, 1.35)
    .to(progress, { scaleX: 1, duration: 0.52 }, 1.35)
    .to({}, { duration: 0.3 });

  window.addEventListener("load", () => ScrollTrigger.refresh(), { once: true });
};

initFundingStory();

if (wizard) {
  const steps = [...wizard.querySelectorAll("[data-step]")];
  const currentLabel = wizard.querySelector("[data-step-current]");
  const progress = wizard.querySelector("[data-progress]");
  const backButton = wizard.querySelector("[data-back]");
  const nextButton = wizard.querySelector("[data-next]");
  const message = wizard.querySelector("[data-message]");
  const startedAt = wizard.querySelector("[data-started-at]");
  const summaryTitle = wizard.querySelector("[data-summary-title]");
  const summaryText = wizard.querySelector("[data-summary-text]");
  let currentStep = 0;

  if (startedAt) {
    startedAt.value = new Date().toISOString();
  }

  const setMessage = (text = "", type = "") => {
    if (!message) return;
    message.textContent = text;
    message.hidden = !text;
    message.className = `wizard-message${type ? ` is-${type}` : ""}`;
  };

  const updateSummary = () => {
    const data = new FormData(wizard);
    const propertyType = data.get("propertyType") || "Immobilie";
    const selfUsed = data.get("selfUsed") === "Ja";
    const heatingType = data.get("heatingType") || "Heizung";
    const heatingAge = data.get("heatingAge") || "Alter noch offen";
    const interest = data.get("interest") || "Beratung offen";

    if (summaryTitle) {
      summaryTitle.textContent = `${selfUsed ? "Selbst genutztes" : "Nicht selbst genutztes"} ${propertyType}`;
    }
    if (summaryText) {
      summaryText.textContent =
        `${heatingType}-Heizung · ${heatingAge} · Interesse: ${interest}. ` +
        "GEBA ordnet diese Angaben im persönlichen Förder-Check individuell ein.";
    }
  };

  const updateStep = (nextStep, focusHeading = true) => {
    currentStep = Math.max(0, Math.min(nextStep, steps.length - 1));
    steps.forEach((step, index) => {
      const active = index === currentStep;
      step.hidden = !active;
      step.classList.toggle("is-active", active);
    });

    if (currentLabel) currentLabel.textContent = String(currentStep + 1);
    if (progress) progress.style.width = `${((currentStep + 1) / steps.length) * 100}%`;
    if (backButton) backButton.hidden = currentStep === 0;
    if (nextButton) {
      nextButton.textContent = currentStep === steps.length - 1 ? "Einschätzung anfragen" : "Weiter";
    }
    if (currentStep === steps.length - 1) updateSummary();
    setMessage();
    track("geba_private_check_step_view", {
      step_number: currentStep + 1,
      step_name: steps[currentStep]?.querySelector("h3")?.textContent.trim(),
    });

    if (focusHeading) {
      steps[currentStep]?.querySelector("h3")?.focus?.({ preventScroll: true });
      wizard.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const validateStep = () => {
    const activeStep = steps[currentStep];
    const requiredFields = [...activeStep.querySelectorAll("[required]")];
    let firstInvalid = null;

    requiredFields.forEach((field) => {
      if (!field.checkValidity()) {
        firstInvalid ||= field;
      }
    });

    const postalCode = activeStep.querySelector('[name="postalCode"]');
    if (postalCode && !/^\d{5}$/.test(postalCode.value.trim())) {
      postalCode.setCustomValidity("Bitte geben Sie eine fünfstellige Postleitzahl ein.");
      firstInvalid ||= postalCode;
    } else {
      postalCode?.setCustomValidity("");
    }

    const phone = activeStep.querySelector('[name="phone"]');
    if (phone && phone.value.trim().replace(/\D/g, "").length < 6) {
      phone.setCustomValidity("Bitte geben Sie eine gültige Telefonnummer ein.");
      firstInvalid ||= phone;
    } else {
      phone?.setCustomValidity("");
    }

    if (firstInvalid) {
      setMessage("Bitte vervollständigen Sie die markierten Angaben.", "error");
      firstInvalid.reportValidity();
      firstInvalid.focus();
      return false;
    }

    return true;
  };

  const formPayload = () => {
    const data = Object.fromEntries(new FormData(wizard).entries());
    delete data.website;
    return {
      ...data,
      company: "Privatkunde",
      source: "GEBA Privatkunden Förder-Check",
      submittedAt: new Date().toISOString(),
    };
  };

  const submitWizard = async () => {
    if (!validateStep()) return;
    const endpoint = wizard.dataset.endpoint?.trim();

    if (!endpoint) {
      setMessage(
        "Demo abgeschlossen: Ihre Eingaben wurden nicht übertragen oder gespeichert. Vor dem Livegang wird hier der geprüfte GEBA-Lead-Endpunkt angeschlossen.",
        "success",
      );
      return;
    }

    nextButton.disabled = true;
    nextButton.textContent = "Wird übermittelt …";

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formPayload()),
      });
      if (!response.ok) throw new Error(`Lead endpoint returned ${response.status}`);

      setMessage(
        "Vielen Dank. Ihre Anfrage wurde übermittelt. GEBA meldet sich im gewünschten Zeitraum bei Ihnen.",
        "success",
      );
      track("generate_lead", {
        lead_type: "private_funding_check",
        value: 1,
        currency: "EUR",
      });
      wizard.reset();
    } catch (error) {
      console.error("Private Förder-Check submission failed", error);
      setMessage(
        "Die Anfrage konnte technisch nicht übermittelt werden. Bitte versuchen Sie es erneut oder kontaktieren Sie GEBA direkt.",
        "error",
      );
      track("geba_lead_error", { lead_type: "private_funding_check" });
    } finally {
      nextButton.disabled = false;
      nextButton.textContent = "Förder-Check anfragen";
    }
  };

  nextButton?.addEventListener("click", () => {
    if (currentStep < steps.length - 1) {
      if (validateStep()) {
        track("geba_private_check_step_complete", { step_number: currentStep + 1 });
        updateStep(currentStep + 1);
      }
      return;
    }
    submitWizard();
  });

  backButton?.addEventListener("click", () => updateStep(currentStep - 1));

  wizard.addEventListener("submit", (event) => {
    event.preventDefault();
    if (currentStep === steps.length - 1) submitWizard();
  });

  wizard.addEventListener("input", (event) => {
    event.target.setCustomValidity?.("");
    if (!message?.hidden && message?.classList.contains("is-error")) setMessage();
  });

  updateStep(0, false);
}

document.querySelectorAll('a[href="#check"], .header-button, .button').forEach((cta) => {
  cta.addEventListener("click", () => {
    track("geba_cta_click", { cta_name: cta.textContent.trim(), page_path: window.location.pathname });
  });
});

track("geba_private_check_loaded", { page_path: window.location.pathname });
