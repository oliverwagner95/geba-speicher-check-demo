# GEBA Google-Ads Keyword-Blueprint

Stand: 2026-08-11

Ziel: Die Kampagnen koennen vorbereitet werden, ohne auf Conversion Media zu warten und ohne Ads live zu schalten. DNS, Landingpages, Leadversand und technische Events sind erledigt. Offen ist nur noch der Abgleich mit bestehenden Google-Ads-Kampagnen, Keywords, Suchbegriffen und Conversion-Zielen.

## Aktueller Stand

- Speichercheck: `https://speichercheck.geba-gmbh.com/`
- Foerdercheck: `https://foerdercheck.geba-gmbh.com/`
- GTM: `GTM-MKML2CBG`
- Lead-Events:
  - `lead_submit`
  - `speichercheck_lead`
  - `foerdercheck_lead`
  - `generate_lead`
- Leadversand: produktiv getestet
- Ads-Livegang: noch nicht starten

## Was wir von Conversion Media brauchen

Nur diese Punkte anfordern:

1. Export der laufenden Suchkampagnen
   - Kampagnenname
   - Anzeigengruppen
   - Keywords
   - Match Types
   - Anzeigen
   - Assets/Erweiterungen
2. Search-Terms-Report der letzten 30 bis 90 Tage
   - Suchbegriff
   - Kampagne
   - Anzeigengruppe
   - Klicks
   - Kosten
   - Conversions
3. Bestehende Negative-Keyword-Listen
4. Aktuelle Conversion-Ziele
   - welche Conversion-Aktionen sind primaer?
   - welche sind sekundaer?
   - gelten sie accountweit oder kampagnenspezifisch?

Kurzer Anforderungstext:

```text
Hallo zusammen, DNS, Landingpages und Leadversand sind erledigt.

Fuer den naechsten Schritt brauchen wir bitte den aktuellen Google-Ads-Stand:
- Keywordliste / Suchbegriffe der laufenden Kampagnen
- Kampagnen- und Anzeigengruppenstruktur
- bestehende Negative Keywords
- aktuelle Conversion-Ziele inkl. primaer/sekundaer

Bitte als Export oder Screenshots schicken. Wir wollen vermeiden, dass wir parallel ein Setup bauen, das eure laufenden Kampagnen doppelt oder stoert.
```

## Strategische Grundentscheidung

Empfehlung: Zwei getrennte Search-Kampagnen, keine Vermischung.

- `GEBA | Search | Speichercheck | B2B | Suedbaden`
- `GEBA | Search | Foerdercheck | Privat | Suedbaden`

Warum:

- B2B-Speicher und private Heizungsfoerderung haben komplett unterschiedliche Suchintentionen.
- Conversion-Werte sind unterschiedlich.
- Anzeigenversprechen und Landingpages sind unterschiedlich.
- Negative Keywords lassen sich sauberer steuern.

## Kampagne 1: Speichercheck B2B

Landingpage: `https://speichercheck.geba-gmbh.com/`

### Zielgruppe

Unternehmen in Suedbaden / Hochrhein / Schwarzwald / Freiburg / Bodensee mit Interesse an:

- Gewerbespeicher
- Batteriespeicher fuer Unternehmen
- PV-Eigenverbrauch
- Lastspitzenmanagement
- Energiekosten senken
- Ladeinfrastruktur + Speicher

### Kampagnenziel

Primaer:

- qualifizierte B2B-Anfrage

Sekundaer:

- Formularstart
- CTA-Klick
- Wizard-Schritt abgeschlossen

### Anzeigengruppen

#### 1. Gewerbespeicher

Keyword-Set:

```text
"gewerbespeicher"
"gewerbe speicher"
"stromspeicher gewerbe"
"stromspeicher unternehmen"
"batteriespeicher gewerbe"
"batteriespeicher unternehmen"
"industriespeicher"
"speicher fuer gewerbebetrieb"
[gewerbespeicher]
[stromspeicher gewerbe]
[batteriespeicher gewerbe]
```

Suchintention:

- Nutzer sucht konkrete Speicherloesung fuer Betrieb.

Anzeige-Winkel:

- Wirtschaftlichkeit pruefen
- PV-Strom besser nutzen
- Lastspitzen reduzieren
- regionale Planung durch GEBA

#### 2. Lastspitzenmanagement

Keyword-Set:

```text
"lastspitzen reduzieren"
"lastspitzen kappen"
"lastspitzenmanagement"
"peak shaving speicher"
"leistungspreis senken"
"lastgang optimieren"
"batteriespeicher lastspitzen"
[lastspitzenmanagement]
[lastspitzen reduzieren]
[peak shaving speicher]
```

Suchintention:

- Nutzer hat Problem mit Leistungspreisen/Lastgang.

Anzeige-Winkel:

- Leistungsspitzen glaetten
- Speicher als technischer Hebel
- Betrieb vorab bewerten lassen

#### 3. PV-Eigenverbrauch Gewerbe

Keyword-Set:

```text
"pv eigenverbrauch gewerbe"
"photovoltaik eigenverbrauch gewerbe"
"solarstrom speichern gewerbe"
"pv speicher unternehmen"
"pv speicher gewerbe"
"photovoltaik speicher gewerbe"
"eigenverbrauch optimieren gewerbe"
[pv speicher gewerbe]
[photovoltaik speicher gewerbe]
[pv eigenverbrauch gewerbe]
```

Suchintention:

- Nutzer hat oder plant PV und will mehr Eigenstrom nutzen.

Anzeige-Winkel:

- Solarstrom dann nutzen, wenn der Betrieb ihn braucht
- Speicher, PV und Verbrauch gemeinsam bewerten

#### 4. Energieberatung / Energiekosten B2B

Keyword-Set:

```text
"energiekosten senken unternehmen"
"energiekosten gewerbe senken"
"energieberatung gewerbe"
"energieberatung unternehmen"
"stromkosten senken unternehmen"
"energieeffizienz gewerbe"
[energiekosten senken unternehmen]
[energieberatung gewerbe]
```

Suchintention:

- Nutzer sucht breiter nach Einsparung, noch nicht zwingend Speicher.

Hinweis:

- Nur kontrolliert testen. Gefahr: zu breit, viele unqualifizierte Klicks.

### Regionale Keyword-Ergaenzungen

Mit Ort/Region kombinieren:

```text
suedbaden
hochrhein
waldshut
loerrach
freiburg
schwarzwald
bodensee
villingen-schwenningen
tuttlingen
konstanz
```

Beispiele:

```text
"gewerbespeicher suedbaden"
"stromspeicher gewerbe freiburg"
"batteriespeicher unternehmen hochrhein"
"lastspitzenmanagement waldshut"
```

### Negative Keywords B2B

Kampagnenweit:

```text
privat
privathaushalt
wohnung
mieter
balkonkraftwerk
camping
wohnmobil
powerstation
akku
handy
auto batterie
e bike
job
jobs
ausbildung
studium
wiki
wikipedia
pdf
kostenlos download
selber bauen
diy
gebraucht
amazon
ebay
test
vergleich
forum
```

Hinweis:

- `kostenlos` nicht pauschal ausschliessen, weil die Landingpage einen kostenlosen Check anbietet.
- Stattdessen `kostenlos download`, `kostenlos pdf`, `kostenlos rechner` etc. pruefen.

## Kampagne 2: Foerdercheck Privatkunden

Landingpage: `https://foerdercheck.geba-gmbh.com/`

### Zielgruppe

Private Eigentuemer in Suedbaden / Hochrhein / Schwarzwald / Freiburg / Bodensee mit Interesse an:

- Heizungsfoerderung
- KfW-Heizungsfoerderung
- Waermepumpe
- Heizungstausch
- Foerdercheck
- Sanierung / Energieberatung

### Kampagnenziel

Primaer:

- Foerdercheck-Anfrage

Sekundaer:

- Formularstart
- CTA-Klick
- Wizard-Schritt abgeschlossen

### Anzeigengruppen

#### 1. Heizungsfoerderung

Keyword-Set:

```text
"heizungsfoerderung"
"heizung foerderung"
"foerderung heizungstausch"
"foerderung neue heizung"
"heizung erneuern foerderung"
"zuschuss heizung"
"staatliche foerderung heizung"
[heizungsfoerderung]
[foerderung heizungstausch]
[heizung foerderung]
```

Suchintention:

- Nutzer will wissen, ob es Geld fuer eine neue Heizung gibt.

Anzeige-Winkel:

- Foerderung einordnen lassen
- keine Foerdergarantie
- regionaler GEBA-Check

#### 2. KfW / BEG

Keyword-Set:

```text
"kfw 458"
"kfw heizungsfoerderung"
"kfw foerderung heizung"
"beg heizungsfoerderung"
"kfw zuschuss heizung"
"kfw waermepumpe foerderung"
[kfw 458]
[kfw heizungsfoerderung]
[beg heizungsfoerderung]
```

Suchintention:

- Nutzer ist schon foerdernah und wahrscheinlich qualifizierter.

Anzeige-Winkel:

- Bedingungen verstehen
- naechsten Schritt klaeren
- GEBA prueft regional

#### 3. Waermepumpe Foerderung

Keyword-Set:

```text
"waermepumpe foerderung"
"foerderung waermepumpe"
"waermepumpe zuschuss"
"kfw waermepumpe"
"waermepumpe kosten foerderung"
"waermepumpe austausch oelheizung foerderung"
[waermepumpe foerderung]
[foerderung waermepumpe]
[waermepumpe zuschuss]
```

Suchintention:

- Nutzer denkt konkret ueber Waermepumpe nach.

Anzeige-Winkel:

- Foerderung + Machbarkeit pruefen
- nicht nur Zuschuss, sondern passender naechster Schritt

#### 4. Heizung tauschen / alte Heizung

Keyword-Set:

```text
"alte heizung ersetzen"
"heizung tauschen"
"oelheizung ersetzen"
"gasheizung ersetzen"
"heizung modernisieren"
"neue heizung eigentum"
"heizung sanieren"
[heizung tauschen]
[oelheizung ersetzen]
[gasheizung ersetzen]
```

Suchintention:

- Nutzer ist im Problem-/Planungsmodus, noch nicht zwingend foerderorientiert.

Anzeige-Winkel:

- erst Foerderlage pruefen
- nicht vorschnell entscheiden
- regionaler Erstcheck

### Regionale Keyword-Ergaenzungen

```text
suedbaden
hochrhein
waldshut
loerrach
freiburg
schwarzwald
bodensee
bad saeckingen
rheinfelden
titisee-neustadt
donaueschingen
konstanz
```

Beispiele:

```text
"heizungsfoerderung suedbaden"
"waermepumpe foerderung freiburg"
"heizung tauschen waldshut"
"kfw heizungsfoerderung loerrach"
```

### Negative Keywords Privatkunden

Kampagnenweit:

```text
gewerbe
industrie
unternehmen
b2b
job
jobs
ausbildung
studium
wiki
wikipedia
pdf
gesetzestext
formular download
antrag pdf
selber machen
diy
gebraucht
ersatzteile
thermostat
heizkoerper
ofen
kamin
pellets kaufen
stromspeicher gewerbe
gewerbespeicher
lastspitzen
```

Vorsicht:

- `antrag` nicht pauschal ausschliessen, weil Antragstellung eine kaufnahe Suchintention sein kann.
- Besser nur `antrag pdf`, `formular download`, `vordruck` ausschliessen.

## Match-Type-Logik

Start konservativ:

- Hauptkeywords als Phrase Match
- sehr klare Keywords zusaetzlich als Exact Match
- Broad Match erst spaeter mit Smart Bidding und genuegend Conversion-Daten testen

Begruendung:

- Phrase Match gibt genug Reichweite, bleibt aber kontrollierbarer als Broad.
- Exact Match sichert die klarsten Suchintentionen.
- Broad kann spaeter sinnvoll sein, braucht aber harte Negative-Keyword-Pflege und saubere Conversion-Daten.

Arbeitsgrundlage:

- Google Ads unterscheidet Broad, Phrase und Exact Match; breitere Match Types erfassen mehr Suchanfragen, brauchen aber staerkere Steuerung.
- Der Search-Terms-Report ist Pflicht fuer die laufende Optimierung, weil er zeigt, welche echten Suchanfragen Anzeigen ausgeloest haben.
- Negative Keywords muessen aktiv gepflegt werden, damit irrelevante Suchanfragen ausgeschlossen werden.
- Conversion-Ziele muessen vor Livegang sauber getrennt werden, damit bestehende Kampagnen nicht auf falsche Ziele optimieren.

Quellen:

- Google Ads Help: Keyword Matching Options - https://support.google.com/google-ads/answer/7478529
- Google Ads Help: Search Terms Report - https://support.google.com/google-ads/answer/2472708
- Google Ads Help: Negative Keywords - https://support.google.com/google-ads/answer/2453972
- Google Ads Help: Conversion Goals - https://support.google.com/google-ads/answer/10995103

## Anzeigenbausteine

### Speichercheck Headlines

```text
Gewerbespeicher prüfen
Speicherpotenzial berechnen
Lastspitzen senken
PV-Strom besser nutzen
GEBA Speicher-Check
Energie für Unternehmen
Speicher für Gewerbe
Kostenloser Potenzialcheck
Regional in Südbaden
PV und Speicher planen
```

### Speichercheck Beschreibungen

```text
Prüfen Sie, ob PV, Speicher und Lastmanagement für Ihren Betrieb wirtschaftlich interessant sind.
GEBA bewertet Verbrauch, PV-Potenzial und Lastspitzen. Kostenlos und unverbindlich anfragen.
Mehr Eigenverbrauch, weniger Spitzen, bessere Planung. Starten Sie den GEBA Speicher-Check.
```

### Foerdercheck Headlines

```text
Heizungsförderung prüfen
GEBA Förder-Check
KfW Zuschuss einordnen
Wärmepumpe Förderung
Heizungstausch prüfen
Förderung vorab klären
Regionaler Förder-Check
Kostenlos anfragen
Eigentümer aufgepasst
Förderlage prüfen lassen
```

### Foerdercheck Beschreibungen

```text
Prüfen Sie unverbindlich, ob sich ein schneller Förder-Check für Ihre Heizung lohnt.
GEBA ordnet Ihre Ausgangslage regional ein. Keine Fördergarantie, aber ein klarer nächster Schritt.
Seit 2026 gelten neue Bedingungen. Lassen Sie Ihre Förderlage frühzeitig einschätzen.
```

## UTM-Struktur

### Speichercheck

```text
utm_source=google
utm_medium=cpc
utm_campaign=geba_speichercheck_search_suedbaden
utm_content={adgroup}_{advariant}
utm_term={keyword}
```

Beispiele:

```text
utm_campaign=geba_speichercheck_search_suedbaden
utm_content=gewerbespeicher_ad1
utm_content=lastspitzenmanagement_ad1
utm_content=pv_eigenverbrauch_ad1
```

### Foerdercheck

```text
utm_source=google
utm_medium=cpc
utm_campaign=geba_foerdercheck_search_suedbaden
utm_content={adgroup}_{advariant}
utm_term={keyword}
```

Beispiele:

```text
utm_campaign=geba_foerdercheck_search_suedbaden
utm_content=heizungsfoerderung_ad1
utm_content=kfw_beg_ad1
utm_content=waermepumpe_ad1
```

## Conversion-Zuordnung

Noch nicht live aktivieren, aber so vorbereiten:

### Primaere Ziele

- Speichercheck-Kampagne: `speichercheck_lead`
- Foerdercheck-Kampagne: `foerdercheck_lead`

### Sekundaere Ziele

- `lead_submit`
- `generate_lead`
- Wizard-Schritt abgeschlossen
- CTA-Klick

### Wichtige Regel

Keine neue Conversion-Aktion als Konto-Standardziel setzen, solange unklar ist, welche bestehenden Conversion-Ziele im Ads-Konto aktiv sind. Sonst kann die Optimierung laufender Kampagnen verfälscht werden.

## Budget- und Startlogik

Nicht als Freigabe verstehen, sondern als Strukturvorschlag.

### Testphase

- Speichercheck: kleiner, aber priorisierter B2B-Test
- Foerdercheck: separater Privatkunden-Test
- keine gemeinsamen Budgets
- taegliche Suchbegriffe pruefen
- Negative Keywords nachziehen

### Auswertung nach 7 bis 14 Tagen

Bewerten:

- Klickrate
- Kosten pro Formularstart
- Kosten pro Lead
- Speichercheck: Kosten pro A-/B-Lead
- Suchbegriffe mit falscher Intention
- regionale Performance

## Entscheidungsregel gegen Conversion-Blocker

Wenn Conversion Media bis heute keinen Export liefert:

1. Dieses Setup als eigene Arbeitsgrundlage verwenden.
2. Dominik/GEBA transparent sagen:
   - Technik ist fertig.
   - DNS ist fertig.
   - Leadversand ist fertig.
   - Es fehlt nur der Ads-Abgleich.
3. Kampagnen nicht blind live schalten, aber final vorbereiten.
4. Conversion Media spaeter nur noch zum Abgleich heranziehen.

## Operative Checkliste

- [ ] Conversion Media Export anfordern
- [ ] Bestehende Keywords gegen diesen Blueprint abgleichen
- [ ] Negative-Keyword-Liste finalisieren
- [ ] Anzeigenvarianten final formulieren
- [ ] GTM/GA4 Events final testen
- [ ] Ads-Conversion-Ziele kampagnenspezifisch planen
- [ ] Freigabe von Oli/GEBA vor jedem Livegang einholen
