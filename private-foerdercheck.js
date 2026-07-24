const header = document.querySelector("[data-header]");
const wizard = document.querySelector("[data-private-wizard]");

const setHeaderState = () => {
  header?.classList.toggle("is-scrolled", window.scrollY > 24);
};

setHeaderState();
window.addEventListener("scroll", setHeaderState, { passive: true });

if (wizard) {
  const steps = [...wizard.querySelectorAll("[data-step]")];
  const currentLabel = wizard.querySelector("[data-step-current]");
  const progress = wizard.querySelector("[data-progress]");
  const backButton = wizard.querySelector("[data-back]");
  const nextButton = wizard.querySelector("[data-next]");
  const message = wizard.querySelector("[data-message]");
  const startedAt = wizard.querySelector("[data-started-at]");
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
      nextButton.textContent = currentStep === steps.length - 1 ? "Förder-Check anfragen" : "Weiter";
    }
    setMessage();

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
      wizard.reset();
    } catch (error) {
      console.error("Private Förder-Check submission failed", error);
      setMessage(
        "Die Anfrage konnte technisch nicht übermittelt werden. Bitte versuchen Sie es erneut oder kontaktieren Sie GEBA direkt.",
        "error",
      );
    } finally {
      nextButton.disabled = false;
      nextButton.textContent = "Förder-Check anfragen";
    }
  };

  nextButton?.addEventListener("click", () => {
    if (currentStep < steps.length - 1) {
      if (validateStep()) updateStep(currentStep + 1);
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
