# GEBA Conversion-Audit

Stand: 2026-08-25, 10:55-11:05 CEST

## Kurzfazit

Die Seiten sind technisch erreichbar, indexierbar und der Lead-Endpunkt nimmt Production-Anfragen an. Das akute Demo-Copy-Problem ist behoben. Die schwache Lead-Performance liegt damit wahrscheinlich nicht an einem einzigen technischen Defekt, sondern an einer Kombination aus Traffic-Fit, zu weichem Angebotsversprechen, zu spaetem Trust-Aufbau und Formularreibung.

## Datenbasis

- Aktuelle Live-Seiten:
  - `https://speichercheck.geba-gmbh.com/`
  - `https://foerdercheck.geba-gmbh.com/`
- Letzte saubere Ads-Auswertung 17.08.-23.08.2026:
  - Gesamt: 670 Impressionen, 81 Klicks, 680,18 EUR Kosten, 1 Conversion.
  - Privat/Foerdercheck: 354 Impressionen, 66 Klicks, 357,28 EUR Kosten, Ø 5,41 EUR CPC.
  - B2B/Speichercheck: 316 Impressionen, 15 Klicks, 322,90 EUR Kosten, Ø 21,53 EUR CPC.
- Technischer Live-Check:
  - Seiten liefern HTTP 200.
  - Production `/api/leads` liefert HTTP 202 `accepted`.
  - HTML-Groessen: B2B ca. 38 KB, Privat ca. 24 KB; Asset-Gewichte unkritisch.

## Hauptursachen

### 1. B2B-Speichercheck ist fuer teure Klicks zu allgemein

Der erste Screen sagt aktuell im Kern: "Mehr aus Ihrer Energie machen." Das ist sauber, aber fuer B2B-Search mit hohem CPC zu weich. Ein Betrieb, der nach Gewerbespeicher, Lastspitzenmanagement oder Batteriespeicher sucht, braucht sofort eine wirtschaftliche Einordnung:

- Welche Kostenhebel werden geprueft?
- Welche Daten reichen fuer eine Ersteinschaetzung?
- Was bekommt der Nutzer nach dem Absenden?
- Warum GEBA statt irgendeinem Speicheranbieter?

Risiko: Nutzer verstehen das Angebot als allgemeinen Info-Check, nicht als konkreten Einstieg in eine wirtschaftliche Speicher-/Lastspitzenanalyse.

### 2. Der CTA "Check" ist niedrigschwellig, aber nicht wertstark genug

"Check starten" reduziert Reibung, aber es verkauft den Gegenwert nicht hart genug. Besser waere ein konkreteres Ergebnisversprechen:

- "Kostenlose Speicher-Ersteinschaetzung erhalten"
- "Lastspitzen- und Speicherpotenzial pruefen lassen"
- "Rueckruf zur Speicher-Wirtschaftlichkeit anfordern"

Der Nutzer muss vor dem Formular wissen, dass danach ein echter GEBA-Mensch die Angaben bewertet.

### 3. Trust ist vorhanden, aber nicht frueh und konkret genug

GEBA-Logo, regionale Referenz und Erfahrung sind vorhanden. Der Beweis kommt aber nicht hart genug im ersten Entscheidungsbereich. Fuer kalten Paid-Traffic braucht der erste Screen sichtbarer:

- echte Firma, regionale Naehe, Telefonnummer
- Ansprechpartner oder Team-Kontext
- Referenz/Projektbeweis
- klare Aussage: keine Weitergabe, persoenliche Rueckmeldung

Beim Foerdercheck ist das besser, aber auch dort fehlen im ersten Screen ein sichtbarer Ansprechpartner und eine direkte Rueckrufalternative.

### 4. B2B-Formular ist wahrscheinlich zu schwer fuer kalten Traffic

B2B hat 6 Schritte und viele Auswahl-/Pflichtfelder. Das ist fuer Qualifizierung gut, aber nur wenn der Nutzer vorher starken Nutzen erkannt hat. Bei Search-Klicks fuer 20+ EUR CPC ist jeder zusaetzliche Schritt teuer.

Problematisch:

- Nutzer muss erst mehrere fachliche Fragen beantworten, bevor Kontakt kommt.
- Telefon ist Pflicht.
- Es gibt keine schnelle Alternative wie "Rueckruf vereinbaren" mit nur Name, Telefon, Firma, PLZ.
- Kein Sofortnutzen wie grobe Einschaetzung, PDF, Checkliste oder "GEBA meldet sich innerhalb von X Werktagen".

### 5. Privat/Foerdercheck zieht eher Klicks, aber wahrscheinlich gemischte Lead-Qualitaet

Der Foerdercheck ist conversion-staerker: klarer Schmerz, Frist, kurzer Wizard. Das Risiko liegt eher bei Traffic-Qualitaet:

- Foerderthemen ziehen Info-Sucher an.
- Nicht jeder Suchende liegt im wirtschaftlichen GEBA-Einzugsgebiet.
- Nutzer suchen eventuell Foerdergeld, nicht Heizungsprojekt.
- Ohne harte regionale Einordnung entstehen Klickkosten ohne verwertbare Leads.

### 6. Tracking ist jung und signalarm

Events sind vorbereitet (`lead_submit`, CTA-Klicks, Step-Events). Aber Google Ads lernt erst sinnvoll, wenn echte Conversions in ausreichender Menge und korrekt als primaere Ziele ankommen. Mit 1 Conversion auf 81 Klicks ist die Datenbasis zu duenn fuer stabile automatische Optimierung.

Zusatzrisiko: Consent begrenzt Marketing-/Analytics-Signale, wenn Nutzer nicht akzeptieren. Das ist rechtlich korrekt, reduziert aber beobachtbare Daten.

## Einfluss Conversion Media

Dass wir Conversion Media umgehen muessen, ist ein echter Nachteil, aber nicht die Hauptursache.

Konkreter Einfluss:

- Uns fehlen deren historische Search-Terms, Negative Keywords und Conversion-Ziel-Setups.
- Wir starten staerker aus einem kalten System und muessen Learnings selbst erzeugen.
- Es besteht hoeheres Risiko, dass Kampagnenstruktur, Keywords und Conversion-Ziele nicht optimal an die bestehenden Learnings anschliessen.
- Abstimmung und Deployments dauern laenger, weil wir nicht direkt in deren sauberem Arbeitsfluss arbeiten.

Aber: Gute Landingpages und gute Search-Kampagnen koennen auch ohne Conversion Media Leads erzeugen. Conversion Media ist kein Ersatz fuer klares Angebot, Trust, passenden Traffic und eine kurze Abschlussstrecke.

## Prioritaeten

### Prio 1: B2B-Seite umbauen

- Hero auf wirtschaftlichen Nutzen zuspitzen: Lastspitzen, Eigenverbrauch, Speicher-Wirtschaftlichkeit.
- Im ersten Screen Telefon, Region, echte Referenz und GEBA-Ansprechpartner staerker sichtbar machen.
- CTA ersetzen durch klareres Ergebnisversprechen.
- Parallel-CTA einfuehren: "Rueckruf anfordern" mit Kurzformular.
- Wizard kuerzen: Kontakt frueher, technische Details optional danach.

### Prio 2: Foerdercheck nachschaerfen

- Region/Einsatzgebiet frueher sichtbar machen.
- Rueckruf als gleichwertigen CTA neben Foerdercheck setzen.
- Noch klarer trennen: unverbindliche Foerdereinordnung, keine Foerdergarantie, naechster Heizungs-Schritt.
- PLZ-Fruehfilter nutzen, um unpassende Regionen nicht weiter teuer zu bearbeiten.

### Prio 3: Ads-/Suchbegriffe pruefen

- Suchbegriffe der letzten Tage exportieren.
- Irrelevante Begriffe konsequent ausschliessen.
- B2B enger auf Gewerbespeicher, Lastspitzen, Batteriespeicher Unternehmen, PV Eigenverbrauch Gewerbe.
- Privat enger regional und intentbasiert: Heizungsfoerderung + Waermepumpe/Heizungstausch + Region.

### Prio 4: Conversion-Ziele bereinigen

- Primaer: echter Lead accepted.
- Sekundaer: Formularstart, Step 1-3, CTA-Klick.
- Keine sekundären Events als echte Lead-Conversions optimieren lassen.

## Naechste Umsetzung

Empfehlung: Kein kleiner Text-Flickenteppich. B2B zuerst als conversion-orientierte Version 2 umbauen, Foerdercheck danach schlanker nachschaerfen. Danach mindestens 3-5 Tage mit sauberem Suchbegriffsmonitoring laufen lassen.
