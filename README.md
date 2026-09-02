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

Der statische Frontend-Stand kann weiterhin ohne Backend über einen beliebigen Webserver ausgeliefert werden. Für produktive Lead-Übermittlung muss aber der Node-Endpoint `/api/leads` auf dem Zielhosting laufen.

Beide Seiten sind auf `data-endpoint="/api/leads"` konfiguriert. Der Endpoint muss auf einem Node-Hosting laufen;
rein statisches GitHub Pages kann keine Leads per E-Mail versenden.

## Produktive Lead-Übergabe

1. `.env.example` als Vorlage verwenden.
2. Für E-Mail-Versand `RESEND_API_KEY` serverseitig konfigurieren.
3. Optional Absender mit `LEAD_FROM_EMAIL` setzen.
4. Standardempfänger sind `kontakt@geba-waerme.com` und in Kopie `oliverwagner@geba-gmbh.com`.
5. Alternativ oder als Fallback `LEAD_WEBHOOK_URL` und optional `LEAD_WEBHOOK_SECRET` konfigurieren.
6. Einen vollständigen Testlead einschließlich Fehlerfall und Bestätigung durchführen.

Secrets gehören ausschließlich in die Laufzeitumgebung und niemals ins Repository.

## Replit Deployment

Das Repo ist für Replit vorbereitet:

- Run command: `npm start`
- Server: `server.mjs`
- Produktiver Lead-Endpunkt: `/api/leads`
- Deployment-Typ: Autoscale

In Replit müssen die Secrets/Environment Variables separat gesetzt werden:

```env
RESEND_API_KEY=
LEAD_FROM_EMAIL=GEBA Landingpages <leads@geba-waerme.com>
LEAD_NOTIFY_TO=kontakt@geba-waerme.com
LEAD_NOTIFY_CC=oliverwagner@geba-gmbh.com
```

Wenn `leads@geba-waerme.com` noch nicht als Absenderdomain verifiziert ist, vorübergehend einen verifizierten Resend-Absender verwenden.

Weitere Marketing- und Tracking-Hinweise stehen in [MARKETING-INTEGRATION.md](./MARKETING-INTEGRATION.md).
