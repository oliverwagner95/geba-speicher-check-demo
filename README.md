# GEBA Gewerbespeicher-Check

Conversion- und Marketing-Landingpage für die strukturierte Vorqualifizierung von Gewerbespeicher-, PV- und Lastmanagement-Anfragen.

## Lokal starten

```bash
npm start
```

Standardmäßig läuft der integrierte Server auf `http://localhost:5014`. Mit `PORT` kann der Port geändert werden.

## Technische Prüfung

```bash
npm run check
```

Der statische Frontend-Stand kann weiterhin ohne Backend über einen beliebigen Webserver ausgeliefert werden. Solange `data-endpoint` im Formular leer bleibt, arbeitet der Check im klar gekennzeichneten Demo-Modus.

## Produktive Lead-Übergabe

1. `.env.example` als Vorlage verwenden.
2. `LEAD_WEBHOOK_URL` serverseitig konfigurieren.
3. Optional `LEAD_WEBHOOK_SECRET` für die HMAC-Signatur setzen.
4. Im Formular `data-endpoint="/api/leads"` aktivieren.
5. Einen vollständigen Testlead einschließlich Fehlerfall und Bestätigung durchführen.

Secrets gehören ausschließlich in die Laufzeitumgebung und niemals ins Repository.

Weitere Marketing- und Tracking-Hinweise stehen in [MARKETING-INTEGRATION.md](./MARKETING-INTEGRATION.md).
