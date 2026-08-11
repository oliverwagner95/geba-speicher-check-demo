# GEBA Tracking- und Optimierungs-Blueprint

Ziel: Die beiden GEBA-Landingpages sollen nicht nur Leads messen, sondern langfristig auf gute Leads optimieren. Ads-Conversions werden erst verbunden, wenn Ads-Konto, Kampagnenabgrenzung und Keyword-Abgleich sauber geklaert sind.

## Grundstruktur

- GTM-Container: `GTM-MKML2CBG` (`GEBA Landingpages`)
- Domains:
  - `speichercheck.geba-gmbh.com`
  - `foerdercheck.geba-gmbh.com`
- Consent: Google Consent Mode v2, Default `denied`
- GTM-Ladung: erst nach Cookie-Zustimmung
- Ads-Konto: offen, vorerst keine Conversion-Aktionen anlegen

## Event-Modell

| Event | Seite | Zweck | Spaetere Nutzung |
| --- | --- | --- | --- |
| `lead_submit` | beide | zentrale Lead-Conversion | GA4 Key Event, optional Google Ads |
| `speichercheck_lead` | Speichercheck | B2B-Speicherlead separat messen | eigene Ads-Conversion |
| `foerdercheck_lead` | Foerdercheck | Privatkunden-Foerderlead separat messen | eigene Ads-Conversion |
| `generate_lead` | beide | Google-kompatibles Standardevent | Fallback/GA4-Auswertung |
| `geba_cta_click` | beide | CTA-Klicks messen | Anzeigen-/Landingpage-Qualitaet |
| `geba_check_step_view` | Speichercheck | Wizard-Schritt sichtbar | Funnel-Abbruchanalyse |
| `geba_check_step_complete` | Speichercheck | Wizard-Schritt abgeschlossen | Funnel-Abbruchanalyse |
| `geba_private_check_step_view` | Foerdercheck | Wizard-Schritt sichtbar | Funnel-Abbruchanalyse |
| `geba_private_check_step_complete` | Foerdercheck | Wizard-Schritt abgeschlossen | Funnel-Abbruchanalyse |
| `geba_lead_error` | beide | Formular-/Versandfehler | technisches Monitoring |

## Lead-Qualitaet

Der Speichercheck liefert bereits Qualitaetsdaten:

- `lead_score`: 0-100
- `lead_grade`: A, B oder C
- `lead_route`: `priority`, `qualified`, `nurture`
- `qualification_reasons`: wichtigste Potenzialsignale

Optimierungslogik:

- Phase 1: alle validen Leads messen, um Datenbasis aufzubauen.
- Phase 2: A- und B-Leads separat auswerten.
- Phase 3: Kampagnen nicht nur nach Kosten pro Lead, sondern nach Kosten pro A-/B-Lead bewerten.
- Phase 4: falls genug Volumen vorhanden ist, nur hochwertige Leads als Primaerziel in Ads nutzen.

## UTM-Standard

Alle Anzeigenlinks sollen mit festen Parametern gebaut werden:

```text
utm_source=google
utm_medium=cpc
utm_campaign=geba_{seite}_{ziel}_{region}
utm_content={anzeigengruppe}_{anzeige}
utm_term={keyword}
```

Beispiele:

```text
utm_campaign=geba_speichercheck_gewerbespeicher_suedbaden
utm_campaign=geba_foerdercheck_heizungstausch_suedbaden
utm_content=gewerbespeicher_lastspitzen_ad1
utm_content=heizungsfoerderung_eigentuemer_ad1
```

Wichtig:

- `gclid`, `wbraid` und `gbraid` werden bereits erfasst.
- UTM-Daten werden in den Lead-Payload und die Lead-Mail uebernommen.
- Kampagnennamen muessen stabil bleiben, sonst wird Reporting unbrauchbar.

## GTM-Konfiguration

Vorbereiten im Container:

1. GA4 Configuration Tag
2. DataLayer Event Trigger:
   - `lead_submit`
   - `speichercheck_lead`
   - `foerdercheck_lead`
   - `geba_cta_click`
   - Wizard-Step-Events
3. GA4 Event Tags:
   - `lead_submit`
   - `speichercheck_lead`
   - `foerdercheck_lead`
   - `cta_click`
   - `wizard_step_view`
   - `wizard_step_complete`
   - `lead_error`
4. Consent-Einstellungen:
   - Analytics/Ads Tags nur mit passendem Consent ausloesen.
   - Keine Ads-Remarketing-Tags ohne klare Freigabe.

## Conversion-Strategie

Noch nicht aktivieren, bis Ads-Konto geklaert ist.

Empfohlene Conversion-Aktionen spaeter:

- `GEBA - Speichercheck Lead`
- `GEBA - Foerdercheck Lead`
- optional: `GEBA - Qualifizierter Speichercheck Lead`

Wertlogik zum Start:

- Speichercheck Lead: hoeherer Wert als Foerdercheck Lead
- A-Lead: hoechster Wert
- B-Lead: mittlerer Wert
- C-Lead: niedrig oder nur sekundär messen

Keine Conversion-Aktion als Konto-Standardziel setzen, bevor klar ist, welche Kampagnen davon optimiert werden sollen.

## Ads-Blueprint

Detailausarbeitung: `GEBA-ADS-KEYWORD-BLUEPRINT.md`

Kampagnen getrennt halten:

- B2B Speichercheck
  - Gewerbespeicher
  - Batteriespeicher Gewerbe
  - Lastspitzenmanagement
  - PV Eigenverbrauch Gewerbe
- Privatkunden Foerdercheck
  - Heizungsfoerderung
  - Waermepumpe Foerderung
  - Heizung tauschen
  - KfW 458

Vor Start benoetigt:

- laufende Kampagnen von Conversion Media
- deren Keyword-/Suchthemen
- Ausschlusskeyword-Liste
- Entscheidung: eigenes Ads-Konto oder bestehendes Konto mit kampagnenspezifischen Zielvorhaben

## Reporting

Minimal-Dashboard:

- Leads gesamt
- Leads nach Landingpage
- Leads nach Kampagne/UTM
- Leads nach `lead_grade`
- Kosten pro Lead
- Kosten pro A-/B-Lead
- Formularabbrueche pro Schritt
- technische Fehler (`geba_lead_error`)

Entscheidungsregeln:

- Hohe Klickkosten + wenige Formularstarts: Keyword/Anzeige pruefen.
- Viele Formularstarts + wenige Leads: Landingpage/Formularschritte pruefen.
- Viele C-Leads: Keyword-Intent oder Anzeigenversprechen pruefen.
- A-/B-Leads mit guten Kosten: Budget schrittweise erhoehen.

## Naechste Umsetzungsschritte

1. GA4 Property/Stream klaeren oder neu anlegen.
2. GTM-Tags fuer GA4 Events anlegen.
3. GTM Preview mit beiden Domains testen.
4. Testlead senden und Events in DebugView pruefen.
5. Ads-Konto-Entscheidung treffen.
6. Conversion-Aktionen erst danach anlegen.
7. Kampagnenstruktur und UTM-Links finalisieren.
