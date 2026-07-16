import { createHash, createHmac, randomUUID } from "node:crypto";
import { createReadStream, statSync } from "node:fs";
import { extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";
import { createServer } from "node:http";

const root = fileURLToPath(new URL(".", import.meta.url));
const port = Number(process.env.PORT || 5014);
const webhookUrl = process.env.LEAD_WEBHOOK_URL || "";
const webhookSecret = process.env.LEAD_WEBHOOK_SECRET || "";
const rateLimit = new Map();

const mimeTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".mp4": "video/mp4",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".webmanifest": "application/manifest+json; charset=utf-8",
  ".webp": "image/webp",
  ".xml": "application/xml; charset=utf-8",
};

function securityHeaders(extra = {}) {
  return {
    "Content-Security-Policy": "default-src 'self'; img-src 'self' data:; style-src 'self'; script-src 'self' 'unsafe-inline'; connect-src 'self'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'; upgrade-insecure-requests",
    "Cross-Origin-Opener-Policy": "same-origin",
    "Permissions-Policy": "camera=(), microphone=(), geolocation=(), payment=()",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
    ...extra,
  };
}

function json(res, status, data) {
  res.writeHead(status, securityHeaders({ "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" }));
  res.end(JSON.stringify(data));
}

function clientIp(req) {
  return String(req.headers["cf-connecting-ip"] || req.headers["x-forwarded-for"] || req.socket.remoteAddress || "unknown")
    .split(",")[0]
    .trim();
}

function isRateLimited(ip) {
  const now = Date.now();
  const recent = (rateLimit.get(ip) || []).filter((time) => now - time < 15 * 60_000);
  recent.push(now);
  rateLimit.set(ip, recent);
  return recent.length > 8;
}

function cleanString(value, max = 300) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function validateLead(input) {
  const lead = {
    company: cleanString(input.company, 160),
    name: cleanString(input.name, 120),
    email: cleanString(input.email, 180).toLowerCase(),
    phone: cleanString(input.phone, 60),
    postalCode: cleanString(input.postalCode, 5),
    city: cleanString(input.city, 120),
    industry: cleanString(input.industry, 100),
    pv: cleanString(input.pv, 40),
    pvSize: cleanString(input.pvSize, 40),
    consumption: cleanString(input.consumption, 40),
    peakPower: cleanString(input.peakPower, 40),
    loadTime: cleanString(input.loadTime, 40),
    timeline: cleanString(input.timeline, 40),
    data: cleanString(input.data, 40),
    topics: Array.isArray(input.topics) ? input.topics.map((item) => cleanString(item, 40)).slice(0, 10) : [],
    lead_score: Number(input.lead_score || 0),
    lead_grade: cleanString(input.lead_grade, 4),
    lead_route: cleanString(input.lead_route, 40),
    qualification_reasons: Array.isArray(input.qualification_reasons)
      ? input.qualification_reasons.map((item) => cleanString(item, 100)).slice(0, 8)
      : [],
    attribution: {
      utm_source: cleanString(input.utm_source, 120),
      utm_medium: cleanString(input.utm_medium, 120),
      utm_campaign: cleanString(input.utm_campaign, 160),
      utm_content: cleanString(input.utm_content, 160),
      utm_term: cleanString(input.utm_term, 160),
      gclid: cleanString(input.gclid, 300),
      wbraid: cleanString(input.wbraid, 300),
      gbraid: cleanString(input.gbraid, 300),
      landing_page: cleanString(input.landing_page, 500),
      referrer: cleanString(input.referrer, 500),
    },
    submitted_at: new Date().toISOString(),
  };

  const errors = [];
  if (!lead.company) errors.push("company");
  if (!lead.name) errors.push("name");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(lead.email)) errors.push("email");
  if (lead.phone.replace(/\D/g, "").length < 6) errors.push("phone");
  if (!/^\d{5}$/.test(lead.postalCode)) errors.push("postalCode");
  if (!lead.city) errors.push("city");
  if (input.consent !== "on" && input.consent !== true) errors.push("consent");
  if (input.website) errors.push("spam");

  const startedAt = Date.parse(input.form_started_at || "");
  if (Number.isFinite(startedAt) && Date.now() - startedAt < 2_000) errors.push("too_fast");
  return { lead, errors };
}

async function readJson(req) {
  let body = "";
  for await (const chunk of req) {
    body += chunk;
    if (body.length > 64_000) throw new Error("payload_too_large");
  }
  return JSON.parse(body || "{}");
}

async function deliverLead(lead) {
  if (!webhookUrl) return { configured: false };
  const body = JSON.stringify({ event: "geba.lead.created", version: 1, lead });
  const signature = webhookSecret ? createHmac("sha256", webhookSecret).update(body).digest("hex") : "";
  const response = await fetch(webhookUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "User-Agent": "GEBA-Lead-Service/1.0",
      ...(signature ? { "X-GEBA-Signature": signature } : {}),
    },
    body,
    signal: AbortSignal.timeout(10_000),
  });
  if (!response.ok) throw new Error(`webhook_${response.status}`);
  return { configured: true };
}

function serveStatic(req, res) {
  const url = new URL(req.url, "http://localhost");
  const requested = url.pathname === "/" ? "/index.html" : url.pathname;
  const safePath = normalize(decodeURIComponent(requested)).replace(/^(\.\.(\/|\\|$))+/, "");
  const filePath = join(root, safePath);
  if (!filePath.startsWith(root)) return json(res, 404, { error: "not_found" });

  try {
    const stat = statSync(filePath);
    if (!stat.isFile()) throw new Error("not_file");
    const etag = `"${createHash("sha1").update(`${stat.size}:${stat.mtimeMs}`).digest("hex")}"`;
    if (req.headers["if-none-match"] === etag) {
      res.writeHead(304, securityHeaders({ ETag: etag }));
      return res.end();
    }
    const isAsset = requested.startsWith("/assets/");
    const contentType = mimeTypes[extname(filePath).toLowerCase()] || "application/octet-stream";
    const range = req.headers.range?.match(/^bytes=(\d*)-(\d*)$/);
    const start = range?.[1] ? Number(range[1]) : 0;
    const end = range?.[2] ? Math.min(Number(range[2]), stat.size - 1) : stat.size - 1;
    const validRange = Boolean(range) && Number.isSafeInteger(start) && Number.isSafeInteger(end)
      && start >= 0 && end >= start && start < stat.size;
    const commonHeaders = {
      "Content-Type": contentType,
      "Cache-Control": isAsset ? "public, max-age=604800, immutable" : "no-cache",
      "Accept-Ranges": "bytes",
      ETag: etag,
    };

    if (range && !validRange) {
      res.writeHead(416, securityHeaders({ ...commonHeaders, "Content-Range": `bytes */${stat.size}` }));
      return res.end();
    }

    const status = validRange ? 206 : 200;
    const responseHeaders = validRange
      ? {
          ...commonHeaders,
          "Content-Length": end - start + 1,
          "Content-Range": `bytes ${start}-${end}/${stat.size}`,
        }
      : { ...commonHeaders, "Content-Length": stat.size };
    res.writeHead(status, securityHeaders(responseHeaders));
    if (req.method === "HEAD") return res.end();
    createReadStream(filePath, validRange ? { start, end } : undefined).pipe(res);
  } catch {
    json(res, 404, { error: "not_found" });
  }
}

const server = createServer(async (req, res) => {
  if (req.method === "POST" && req.url === "/api/leads") {
    const ip = clientIp(req);
    if (isRateLimited(ip)) return json(res, 429, { error: "rate_limited" });

    try {
      const input = await readJson(req);
      const { lead, errors } = validateLead(input);
      if (errors.length) return json(res, 422, { error: "validation_failed", fields: errors });
      const delivery = await deliverLead(lead);
      if (!delivery.configured) return json(res, 503, { error: "delivery_not_configured" });
      return json(res, 202, { accepted: true, lead_id: randomUUID() });
    } catch (error) {
      return json(res, error.message === "payload_too_large" ? 413 : 502, { error: "delivery_failed" });
    }
  }

  if (req.method !== "GET" && req.method !== "HEAD") return json(res, 405, { error: "method_not_allowed" });
  serveStatic(req, res);
});

server.listen(port, "0.0.0.0", () => {
  console.log(`GEBA preview server listening on http://0.0.0.0:${port}`);
});
