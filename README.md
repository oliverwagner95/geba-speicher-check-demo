# GEBA Signature Energy Experience · Variante 2

Eigenständiger Neustart der GEBA-Vertriebsseite: eine bildstarke digitale Industrie-Reportage mit geführter Energie-Diagnose statt klassischer Landingpage- und Kacheloptik.

## Lokal starten

```bash
npm start
```

Standardmäßig läuft der integrierte Server auf `http://localhost:5014`. Mit `PORT` kann der Port geändert werden.

## Gestaltung und Erlebnis

- eigenständige Figma-Konzeption für Desktop, Mobile, Diagnose und Motion
- neue, realistische Gewerbe-Bildwelt; Logo und Markenwelle bleiben offizielle GEBA-Assets
- editorielle Dramaturgie mit Wirtschaftlichkeit, Energiefluss, Team, Referenz und Kundenstimmen
- adaptiver Check mit Live-Potenzialprofil, A/B/C-Qualifizierung und Ergebnisdialog
- lokale PT-Sans-Fonts, Reduced Motion, Tastaturbedienung und responsive Darstellung ab 320 px
- UTM-/GCLID-/WBRAID-/GBRAID-Zuordnung und Fortsetzen nach Abbruch

## Qualitätsstand

- JavaScript- und Server-Syntax geprüft
- beide Wizard-Verzweigungen sowie Demo-Ergebnis getestet
- kein horizontaler Überlauf bei 390 px
- Lighthouse mobil: Accessibility 100, Best Practices 100, Performance 87
- SEO ist technisch vorbereitet; die Vorschau bleibt absichtlich `noindex`, wodurch der Preview-SEO-Score reduziert ist

## Produktive Lead-Übergabe

Die Oberfläche und Qualifizierungslogik sind vollständig. Für die echte Veröffentlichung müssen nur noch externe Betriebsdaten eingesetzt werden:

1. `LEAD_WEBHOOK_URL` und optional `LEAD_WEBHOOK_SECRET` konfigurieren.
2. Im Formular `data-endpoint="/api/leads"` aktivieren.
3. Finale GTM-/GA4-/Google-Ads-IDs ergänzen.
4. Datenschutz-, Einwilligungs- und Bewertungsinhalte final freigeben.
5. Einen vollständigen Testlead einschließlich Fehlerfall und Bestätigung durchführen.

Secrets gehören ausschließlich in die Laufzeitumgebung und niemals ins Repository. Weitere Hinweise stehen in [MARKETING-INTEGRATION.md](./MARKETING-INTEGRATION.md).
