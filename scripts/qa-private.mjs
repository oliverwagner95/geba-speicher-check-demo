import { mkdir, mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { spawn } from "node:child_process";

const baseUrl = process.env.QA_BASE_URL || "http://127.0.0.1:5015";
const chromePath = process.env.CHROME_BIN || "/usr/bin/google-chrome";
const port = 19227;
const outputDir = resolve("docs/screenshots");
const profileDir = await mkdtemp(join(tmpdir(), "geba-private-qa-"));
const browser = spawn(
  chromePath,
  [
    "--headless=new",
    "--disable-gpu",
    "--no-sandbox",
    `--remote-debugging-port=${port}`,
    `--user-data-dir=${profileDir}`,
    "--hide-scrollbars",
    "about:blank",
  ],
  { stdio: "ignore" },
);

const delay = (ms) => new Promise((resolveDelay) => setTimeout(resolveDelay, ms));

async function waitForJson(url, attempts = 30) {
  for (let index = 0; index < attempts; index += 1) {
    try {
      const response = await fetch(url);
      if (response.ok) return response.json();
    } catch {}
    await delay(150);
  }
  throw new Error(`Chrome debugging endpoint did not start: ${url}`);
}

function createCdp(url) {
  const socket = new WebSocket(url);
  let sequence = 0;
  const pending = new Map();
  const events = [];

  socket.addEventListener("message", (event) => {
    const payload = JSON.parse(event.data);
    if (payload.id) {
      const request = pending.get(payload.id);
      if (!request) return;
      pending.delete(payload.id);
      if (payload.error) request.reject(new Error(payload.error.message));
      else request.resolve(payload.result);
      return;
    }
    events.push(payload);
  });

  const ready = new Promise((resolveReady, rejectReady) => {
    socket.addEventListener("open", resolveReady, { once: true });
    socket.addEventListener("error", rejectReady, { once: true });
  });

  return {
    events,
    async send(method, params = {}) {
      await ready;
      sequence += 1;
      const id = sequence;
      const result = new Promise((resolveResult, rejectResult) => {
        pending.set(id, { resolve: resolveResult, reject: rejectResult });
      });
      socket.send(JSON.stringify({ id, method, params }));
      return result;
    },
    close() {
      socket.close();
    },
  };
}

async function evaluate(cdp, expression) {
  const result = await cdp.send("Runtime.evaluate", {
    expression,
    awaitPromise: true,
    returnByValue: true,
  });
  if (result.exceptionDetails) {
    throw new Error(result.exceptionDetails.text || "Browser evaluation failed");
  }
  return result.result.value;
}

async function navigate(cdp, url, width, height, mobile = false) {
  await cdp.send("Emulation.setDeviceMetricsOverride", {
    width,
    height,
    deviceScaleFactor: 1,
    mobile,
  });
  await cdp.send("Page.navigate", { url });
  for (let index = 0; index < 60; index += 1) {
    const state = await evaluate(cdp, "document.readyState");
    if (state === "complete") break;
    await delay(100);
  }
  await delay(500);
}

async function screenshot(cdp, fileName) {
  await evaluate(
    cdp,
    `(() => {
      const header = document.querySelector('[data-header]');
      if (header) {
        header.style.position = 'absolute';
        header.style.top = '0';
        header.classList.remove('is-scrolled');
      }
      const skipLink = document.querySelector('.skip-link');
      if (skipLink) skipLink.style.display = 'none';
      document.querySelectorAll('[data-reveal]').forEach((node) => node.classList.add('is-visible'));
      scrollTo(0, 0);
    })()`,
  );
  await delay(900);
  const metrics = await cdp.send("Page.getLayoutMetrics");
  const screenshotResult = await cdp.send("Page.captureScreenshot", {
    format: "png",
    captureBeyondViewport: true,
    clip: {
      x: 0,
      y: 0,
      width: Math.ceil(metrics.cssContentSize.width),
      height: Math.ceil(metrics.cssContentSize.height),
      scale: 1,
    },
  });
  await writeFile(join(outputDir, fileName), Buffer.from(screenshotResult.data, "base64"));
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

try {
  await mkdir(outputDir, { recursive: true });
  const targets = await waitForJson(`http://127.0.0.1:${port}/json`);
  const target = targets.find((candidate) => candidate.type === "page");
  const cdp = createCdp(target.webSocketDebuggerUrl);
  await cdp.send("Page.enable");
  await cdp.send("Runtime.enable");
  await cdp.send("Log.enable");

  await navigate(cdp, `${baseUrl}/privatkunden-foerdercheck.html`, 1440, 1000);
  await evaluate(
    cdp,
    `(async () => {
      scrollTo(0, document.documentElement.scrollHeight);
      await new Promise((resolve) => setTimeout(resolve, 500));
      document.querySelectorAll('[data-reveal]').forEach((node) => node.classList.add('is-visible'));
      scrollTo(0, 0);
      await new Promise((resolve) => setTimeout(resolve, 900));
    })()`,
  );
  const desktop = await evaluate(
    cdp,
    `({
      title: document.title,
      robots: document.querySelector('meta[name="robots"]')?.content,
      width: innerWidth,
      scrollWidth: document.documentElement.scrollWidth,
      h1: document.querySelector('h1')?.textContent.trim(),
      imagesLoaded: [...document.images].every((image) => image.complete && image.naturalWidth > 0),
      bonusBarHeights: [...document.querySelectorAll('.bonus-step i')].map((node) => node.getBoundingClientRect().height),
      bonusBarStyles: [...document.querySelectorAll('.bonus-step i')].map((node) => ({
        inline: node.parentElement.getAttribute('style'),
        inheritedHeight: getComputedStyle(node).getPropertyValue('--bar-height'),
        computedHeight: getComputedStyle(node).height
      }))
    })`,
  );
  assert(desktop.title.includes("Heizungsförderung"), "Private page title is missing");
  assert(!desktop.robots.includes("noindex"), "Private page must be indexable");
  assert(desktop.scrollWidth <= desktop.width, "Desktop layout has horizontal overflow");
  assert(desktop.imagesLoaded, "Not all private page images loaded");
  assert(
    desktop.bonusBarHeights[0] >= 58,
    `Desktop bonus decline bars did not reach their intended height: ${JSON.stringify(desktop.bonusBarStyles)}`,
  );
  await screenshot(cdp, "geba-private-foerdercheck-desktop.png");

  const wizardResult = await evaluate(
    cdp,
    `(async () => {
      const set = (selector, value) => {
        const node = document.querySelector(selector);
        node.value = value;
        node.dispatchEvent(new Event('input', { bubbles: true }));
        node.dispatchEvent(new Event('change', { bubbles: true }));
      };
      const click = (selector) => document.querySelector(selector).click();
      set('[name="postalCode"]', '88400');
      set('[name="city"]', 'Biberach');
      click('[name="propertyType"][value="Einfamilienhaus"]');
      click('[name="selfUsed"][value="Ja"]');
      click('[data-next]');
      await new Promise((resolve) => setTimeout(resolve, 50));
      const step2 = !document.querySelector('[data-step="2"]').hidden;
      click('[name="heatingType"][value="Gas"]');
      set('[name="heatingAge"]', '20–29 Jahre');
      click('[data-next]');
      await new Promise((resolve) => setTimeout(resolve, 50));
      const step3 = !document.querySelector('[data-step="3"]').hidden;
      click('[name="interest"][value="Beratung offen"]');
      set('[name="callbackWindow"]', 'Nachmittags (14–17 Uhr)');
      click('[data-next]');
      await new Promise((resolve) => setTimeout(resolve, 50));
      const step4 = !document.querySelector('[data-step="4"]').hidden;
      const summary = document.querySelector('[data-summary-title]')?.textContent.trim();
      set('[name="name"]', 'Max Mustermann');
      set('[name="phone"]', '01234 567890');
      set('[name="email"]', 'max@example.test');
      click('[name="consent"]');
      click('[data-next]');
      await new Promise((resolve) => setTimeout(resolve, 50));
      return {
        step2,
        step3,
        step4,
        summary,
        submitMessage: document.querySelector('[data-message]')?.textContent.trim(),
        messageVisible: !document.querySelector('[data-message]')?.hidden
      };
    })()`,
  );
  assert(wizardResult.step2 && wizardResult.step3 && wizardResult.step4, "Wizard did not advance through all steps");
  assert(wizardResult.summary.includes("Einfamilienhaus"), "Wizard summary did not use the selected property type");
  assert(wizardResult.messageVisible, "Submit result is not visible");
  assert(wizardResult.submitMessage.includes("GEBA direkt"), "Submit failure must point users to direct GEBA contact");

  await navigate(cdp, `${baseUrl}/privatkunden-foerdercheck.html`, 390, 844, true);
  const mobile = await evaluate(
    cdp,
    `({
      width: innerWidth,
      scrollWidth: document.documentElement.scrollWidth,
      heroButtonWidth: document.querySelector('.hero-actions .button')?.getBoundingClientRect().width,
      viewportWidth: document.documentElement.clientWidth
    })`,
  );
  assert(mobile.scrollWidth <= mobile.width, "Mobile layout has horizontal overflow");
  assert(mobile.heroButtonWidth <= mobile.viewportWidth - 24, "Mobile hero CTA is clipped");
  await screenshot(cdp, "geba-private-foerdercheck-mobile.png");

  await navigate(cdp, `${baseUrl}/privatkunden-foerdercheck.html`, 768, 900, true);
  const tablet = await evaluate(
    cdp,
    `({
      width: innerWidth,
      scrollWidth: document.documentElement.scrollWidth,
      clippedButtons: [...document.querySelectorAll('button, .button')].filter((node) => {
        const rect = node.getBoundingClientRect();
        return rect.left < 0 || rect.right > innerWidth;
      }).length
    })`,
  );
  assert(tablet.scrollWidth <= tablet.width, "Tablet layout has horizontal overflow");
  assert(tablet.clippedButtons === 0, "Tablet layout has clipped buttons");

  await navigate(cdp, `${baseUrl}/privatkunden-foerdercheck.html`, 320, 760, true);
  const narrow = await evaluate(
    cdp,
    `({
      width: innerWidth,
      scrollWidth: document.documentElement.scrollWidth,
      clippedButtons: [...document.querySelectorAll('button, .button')].filter((node) => {
        const rect = node.getBoundingClientRect();
        return rect.left < 0 || rect.right > innerWidth;
      }).length
    })`,
  );
  assert(narrow.scrollWidth <= narrow.width, "320px layout has horizontal overflow");
  assert(narrow.clippedButtons === 0, "320px layout has clipped buttons");

  await navigate(cdp, `${baseUrl}/`, 1440, 1000);
  const b2b = await evaluate(
    cdp,
    `({
      title: document.title,
      hasHero: Boolean(document.querySelector('h1')),
      width: innerWidth,
      scrollWidth: document.documentElement.scrollWidth
    })`,
  );
  assert(b2b.hasHero, "Existing B2B page no longer renders");
  assert(b2b.scrollWidth <= b2b.width, "Existing B2B page has horizontal overflow");

  const browserErrors = cdp.events.filter(
    (event) => {
      if (event.method === "Runtime.exceptionThrown") return true;
      if (event.method !== "Log.entryAdded" || !["error", "warning"].includes(event.params.entry.level)) return false;
      const entry = event.params.entry;
      return !(entry.url?.endsWith("/api/leads") && entry.text?.includes("503"));
    },
  );
  assert(browserErrors.length === 0, `Browser errors detected: ${JSON.stringify(browserErrors)}`);

  console.log(
    JSON.stringify(
      {
        privateDesktop: desktop,
        privateMobile: mobile,
        privateTablet: tablet,
        wizard: wizardResult,
        b2b,
        screenshots: [
          "docs/screenshots/geba-private-foerdercheck-desktop.png",
          "docs/screenshots/geba-private-foerdercheck-mobile.png",
        ],
      },
      null,
      2,
    ),
  );
  cdp.close();
} finally {
  browser.kill("SIGTERM");
}
