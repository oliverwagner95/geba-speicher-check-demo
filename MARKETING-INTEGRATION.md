# GEBA Marketing- und Google-Integration

## Bereits im Prototyp umgesetzt

- Google-fähige Meta-Daten, Canonical, Robots und XML-Sitemap
- Organization-, Service- und FAQ-Schema.org als JSON-LD
- Open Graph und Twitter Card
- semantische Seitenstruktur, Skip-Link, Fokus- und Reduced-Motion-Unterstützung
- responsive Sticky-CTA auf Mobilgeräten
- dynamischer Wizard mit bedingten Fragen und internem Lead-Scoring A/B/C
- UTM-, GCLID-, WBRAID- und GBRAID-Erfassung
- First-Touch-Attribution innerhalb der Sitzung
- `dataLayer`-Events für Funnel-Schritte, CTA-Klicks, Lead und Fehler
- Formular-Fortsetzung nach Neuladen über Session Storage
- Honeypot gegen einfache Bots
- produktiver JSON-Endpoint über `data-endpoint` vorbereitet
- serverseitige Feldvalidierung, Payload-Limit und IP-Rate-Limit
- signierte Webhook-Übergabe über serverseitige Umgebungsvariablen
- Security-Header, restriktive Browser-Berechtigungen und Asset-Caching

## Vor Produktivgang noch zu verbinden

1. Finalen Zielpfad bzw. Subdomain festlegen und Canonical/Sitemap bestätigen.
2. Google Tag Manager Container-ID eintragen und Consent Mode v2 über den bestehenden GEBA-Cookie-Banner anbinden.
3. GA4-Key-Events und Google-Ads-Conversions auf `generate_lead` konfigurieren.
4. Produktives CRM-/Webhook-Ziel festlegen, als Secret hinterlegen und den vorbereiteten Endpoint im Formular aktivieren.
5. Empfänger, Antwortzeiten, Lead-Routing und Bestätigungs-E-Mail fachlich freigeben.
6. Search Console Property/Sitemap anmelden und Indexierung prüfen.
7. Rechtstexte und Einwilligung mit GEBA-Datenschutzbeauftragten abstimmen.

## Data-Layer-Events

- `geba_check_loaded`
- `geba_cta_click`
- `geba_check_step_view`
- `geba_check_step_complete`
- `generate_lead`
- `geba_lead_error`

## Interne Lead-Felder

- `lead_score`: 0-100
- `lead_grade`: A, B oder C
- `lead_route`: priority, qualified oder nurture
- `qualification_reasons`: stärkste Potenzialsignale
- Marketing-Attribution: UTM-Felder, GCLID, WBRAID, GBRAID, Landingpage und Referrer
