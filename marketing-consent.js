(function () {
  const CONSENT_KEY = "geba_marketing_consent_v1";
  const GTM_META_SELECTOR = 'meta[name="geba-gtm-id"]';
  const consentDefaults = {
    ad_storage: "denied",
    analytics_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
  };
  const consentGranted = {
    ad_storage: "granted",
    analytics_storage: "granted",
    ad_user_data: "granted",
    ad_personalization: "granted",
  };

  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function gtag() {
    window.dataLayer.push(arguments);
  };

  window.gtag("consent", "default", {
    ...consentDefaults,
    wait_for_update: 500,
  });

  function getGtmId() {
    const value = document.querySelector(GTM_META_SELECTOR)?.content.trim() || "";
    return /^GTM-[A-Z0-9]+$/i.test(value) ? value : "";
  }

  function loadGtm() {
    const gtmId = getGtmId();
    if (!gtmId || document.querySelector(`[data-gtm-id="${gtmId}"]`)) return;

    window.dataLayer.push({ "gtm.start": Date.now(), event: "gtm.js" });
    const script = document.createElement("script");
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(gtmId)}`;
    script.dataset.gtmId = gtmId;
    document.head.appendChild(script);
  }

  function updateConsent(granted) {
    window.gtag("consent", "update", granted ? consentGranted : consentDefaults);
    window.dataLayer.push({
      event: "geba_consent_update",
      marketing_consent: granted ? "granted" : "denied",
    });
    if (granted) loadGtm();
  }

  function saveChoice(granted) {
    localStorage.setItem(CONSENT_KEY, JSON.stringify({ granted, savedAt: new Date().toISOString() }));
    updateConsent(granted);
  }

  function readChoice() {
    try {
      const stored = JSON.parse(localStorage.getItem(CONSENT_KEY) || "null");
      return typeof stored?.granted === "boolean" ? stored.granted : null;
    } catch {
      localStorage.removeItem(CONSENT_KEY);
      return null;
    }
  }

  function showBanner() {
    const banner = document.querySelector("[data-cookie-consent]");
    if (!banner) return;
    const acceptButton = banner.querySelector("[data-consent-accept]");
    const rejectButton = banner.querySelector("[data-consent-reject]");

    banner.hidden = false;
    acceptButton?.addEventListener("click", () => {
      saveChoice(true);
      banner.hidden = true;
    });
    rejectButton?.addEventListener("click", () => {
      saveChoice(false);
      banner.hidden = true;
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    // Load GTM with Consent Mode defaults already set to "denied". This lets
    // Google receive cookieless measurement pings before a visitor makes a
    // choice, while storage remains blocked until explicit consent.
    loadGtm();
    const choice = readChoice();
    if (choice === null) {
      showBanner();
      return;
    }
    updateConsent(choice);
  });
})();
