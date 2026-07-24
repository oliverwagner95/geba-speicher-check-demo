# GEBA Kampagnen-Landingpages

Statische Conversion- und Marketing-Landingpages für zwei sauber getrennte GEBA-Kampagnen:

- `/` – bestehender Gewerbespeicher-Check für Unternehmen
- `/privatkunden-foerdercheck.html` – Förder-Check für private Eigentümer

## Lokal starten

```bash
npm start
```

Standardmäßig läuft der integrierte Server auf `http://localhost:5014`. Mit `PORT` kann der Port geändert werden.

## Technische Prüfung

```bash
npm run check
```

Der zusätzliche Browser-Qualitätscheck für die Privatkunden-Seite erwartet einen laufenden Server und prüft Desktop,
Mobile, den vollständigen Wizard sowie die unveränderte B2B-Seite:

```bash
PORT=5015 npm start
QA_BASE_URL=http://127.0.0.1:5015 npm run qa:private
```

Der statische Frontend-Stand kann weiterhin ohne Backend über einen beliebigen Webserver ausgeliefert werden. Solange `data-endpoint` im Formular leer bleibt, arbeitet der Check im klar gekennzeichneten Demo-Modus.

Die Privatkunden-Seite ist in der Demo bewusst ebenfalls mit leerem `data-endpoint` konfiguriert. Sie übermittelt oder
speichert keine Kontaktdaten und bestätigt dies nach dem letzten Wizard-Schritt ausdrücklich. Vor einem Livegang muss
ein geprüfter Lead-Endpunkt angeschlossen und mit Erfolgs- sowie Fehlerfall getestet werden.

## Produktive Lead-Übergabe

1. `.env.example` als Vorlage verwenden.
2. `LEAD_WEBHOOK_URL` serverseitig konfigurieren.
3. Optional `LEAD_WEBHOOK_SECRET` für die HMAC-Signatur setzen.
4. Im Formular `data-endpoint="/api/leads"` aktivieren.
5. Einen vollständigen Testlead einschließlich Fehlerfall und Bestätigung durchführen.

Secrets gehören ausschließlich in die Laufzeitumgebung und niemals ins Repository.

Weitere Marketing- und Tracking-Hinweise stehen in [MARKETING-INTEGRATION.md](./MARKETING-INTEGRATION.md).
