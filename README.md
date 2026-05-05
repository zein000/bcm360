# BCM360

BCM360 ist eine webbasierte Plattform für die Durchführung und Auswertung von Krisenmanagement-Szenarien (Business Continuity Management). Die Anwendung ermöglicht es Organisationen, strukturierte Übungen zu planen, durchzuführen und zu dokumentieren – mit Echtzeit-Kommunikation, rollenbasierter Zugriffskontrolle und revisionssicherem Audit-Logging.

---

## Inhaltsverzeichnis

- [Architektur](#architektur)
- [Tech-Stack](#tech-stack)
- [Features](#features)
- [Projektstruktur](#projektstruktur)
- [Voraussetzungen](#voraussetzungen)
- [Installation](#installation)
- [Konfiguration](#konfiguration)
- [Anwendung starten](#anwendung-starten)
- [Datenbankmigrationen](#datenbankmigrationen)
- [API-Dokumentation](#api-dokumentation)
- [Authentifizierung & Autorisierung](#authentifizierung--autorisierung)
- [WebSockets & Echtzeit](#websockets--echtzeit)
- [Dateiverwaltung](#dateiverwaltung)
- [Monitoring & Logging](#monitoring--logging)
- [Tests](#tests)
- [Deployment](#deployment)

---

## Architektur

BCM360 ist als klassische Client-Server-Anwendung aufgebaut:

```
┌─────────────────────────────────────────────────────────────────┐
│                          BCM360                                  │
│                                                                   │
│  ┌────────────────┐        ┌──────────────────────────────────┐  │
│  │   web-app/     │  HTTP  │           api/                   │  │
│  │  React (SPA)   │◄──────►│       NestJS REST-API            │  │
│  │                │ WS     │       + WebSocket-Gateway        │  │
│  └────────────────┘        └─────────────┬────────────────────┘  │
│                                          │                        │
│                             ┌────────────┼────────────┐          │
│                             ▼            ▼            ▼          │
│                          MySQL         Redis        MinIO         │
│                         (Daten)      (Cache/       (Dateien)      │
│                                     Sessions)                     │
└─────────────────────────────────────────────────────────────────┘
```

Der Backend-Prozess läuft im **Cluster-Modus** (Node.js `cluster`-Modul) mit Sticky Sessions für WebSocket-Kompatibilität. Prometheus-Metriken aller Worker-Prozesse werden über einen Aggregator auf Port `4001` bereitgestellt.

---

## Tech-Stack

| Bereich | Technologie |
|---|---|
| Backend-Framework | NestJS 10 (TypeScript, Node.js ≥ 20.9) |
| Datenbank | MySQL 8 + Sequelize ORM |
| Caching / Sessions | Redis (via `cache-manager`) |
| Datei-Storage | MinIO (S3-kompatibel) |
| Echtzeit | Socket.io (WebSockets) |
| Hintergrundaufgaben | Bull / BullMQ + `@nestjs/schedule` |
| Authentifizierung | JWT (Access, Refresh, OTP) + 2FA (TOTP) + API-Key |
| E-Mail | Mailjet (transaktionale E-Mails, Handlebars-Templates) |
| Logging | Pino (strukturiertes JSON) + optionaler Logtail-Export |
| Monitoring | Prometheus (`prom-client`) |
| API-Dokumentation | Swagger / OpenAPI (Basic-Auth-geschützt) |
| Frontend | React (Create React App) |
| Containerisierung | Docker |
| Prozessmanagement | PM2 / Node-Clustering |
| Testing | Jest (Unit + E2E) |
| Code-Qualität | ESLint, Prettier, Husky, commitlint |

---

## Features

### Szenario-Management
- Erstellen und Verwalten von Trainingsszenarien (Courses) mit JSON-Konfiguration, Tags und Dateianhängen
- Starten, Verfolgen und Abschliessen von Szenario-Sitzungen (Course Progress)
- Automatische Abschlusserkennung bei zeitüberschreiteten Szenarien (täglicher Cron-Job)
- Export von Szenario-Berichten

### Echtzeit-Kollaboration
- Echtzeit-Updates für alle Teilnehmer einer aktiven Szenario-Sitzung via Socket.io
- In-Szenario-Messaging, Entscheidungsprotokolle und Verlaufsverfolgung
- Authentifizierte WebSocket-Verbindungen mit dediziertem `WebSocketGuard`

### Benutzer- und Rollenverwaltung
- Vollständiges Einladungsworkflow (Invite → Token → Registrierung)
- Feingranulare RBAC mit 33 Berechtigungscodes (z. B. `MANAGE_COURSES`, `INVITE_USER`, `GLOBAL_ADMIN`)
- Dynamische Rollenzuweisung zur Laufzeit

### Sicherheit
- JWT Access Tokens (kurzlebig) + Refresh Tokens (365 Tage)
- Zwei-Faktor-Authentifizierung (TOTP/OTP) als optionale oder erzwungene Sicherheitsstufe
- API-Key-Authentifizierung für Service-to-Service-Kommunikation
- JWT-Blacklisting bei Logout (Redis-gestützt)
- Passwort-Hashing mit bcrypt (10 Runden)
- HTTP-Sicherheitsheader via Helmet, CORS-Konfiguration

### Audit & Compliance
- Lückenloser Ereignisverlauf (`EventHistory`) – jede CREATE/UPDATE/DELETE-Aktion wird protokolliert
- Konfigurationsänderungs-Historie (`ConfigurationHistory`)
- Request-ID-Tracing für alle eingehenden HTTP-Anfragen

### Infrastruktur
- Health-Check-Endpunkt für Kubernetes-/Docker-Probes
- Prometheus-Metriken für alle Worker-Instanzen
- Feature-Flags-System für kontrollierten Rollout neuer Funktionen
- Redis-gestütztes Caching von Benutzerprofilen und Szenario-Zuständen

---

## Projektstruktur

```
bcm360-api/
├── api/                          # NestJS-Backend
│   ├── src/
│   │   ├── app/                  # Root-Modul & Konfiguration
│   │   ├── auth/                 # Authentifizierungsstrategien & Guards
│   │   ├── users/                # Benutzerverwaltung
│   │   ├── company/              # Unternehmensverwaltung
│   │   ├── roles/                # Rollendefinitionen
│   │   ├── permissions/          # Berechtigungssystem
│   │   ├── 2fa/                  # Zwei-Faktor-Authentifizierung
│   │   ├── courses/              # Szenario-/Kurs-Verwaltung
│   │   ├── course-progress/      # Szenario-Sitzungen & Teilnehmer
│   │   ├── caching/              # Redis-Caching-Services
│   │   ├── database/             # Sequelize-Datenbankmodul
│   │   ├── file/                 # MinIO-Dateiverwaltung
│   │   ├── mail/                 # E-Mail-Service (Mailjet)
│   │   ├── event-history/        # Audit-Logging
│   │   ├── tokens/               # Einladungs- & Reset-Tokens
│   │   ├── features/             # Feature-Flags
│   │   ├── configuration/        # App-Konfiguration (DB-gestützt)
│   │   ├── health/               # Health-Check-Endpunkt
│   │   ├── view-engine/          # Handlebars-E-Mail-Templates
│   │   └── main.ts               # Applikations-Einstiegspunkt
│   ├── migrations/               # Sequelize-Migrationen & Seeders
│   ├── Dockerfile
│   ├── pm2.json
│   └── .example.env              # Umgebungsvariablen-Vorlage
└── web-app/                      # React-Frontend
```

---

## Voraussetzungen

- **Node.js** ≥ 20.9.0
- **npm** ≥ 10
- **MySQL** 8
- **Redis** 7
- **MinIO** (oder S3-kompatibler Speicher)
- Ein laufender **Mailjet**-Account für transaktionale E-Mails

---

## Installation

```bash
# Repository klonen
git clone <repository-url>
cd bcm360-api

# Backend-Abhängigkeiten installieren
cd api
npm install

# Frontend-Abhängigkeiten installieren
cd ../web-app
npm install
```

---

## Konfiguration

Kopiere die Umgebungsvariablen-Vorlage und passe sie an:

```bash
cd api
cp .example.env .env
```

### Pflichtfelder

| Variable | Beschreibung |
|---|---|
| `NODE_ENV` | `development` oder `production` |
| `PORT` | HTTP-Port des API-Servers (Standard: `3000`) |
| `DB_HOST` | MySQL-Hostname |
| `DB_PORT` | MySQL-Port (Standard: `3306`) |
| `DB_USER` | Datenbankbenutzer |
| `DB_PASSWORD` | Datenbankpasswort |
| `DB_DATABASE` | Datenbankname |
| `REDIS_HOST` | Redis-Hostname |
| `REDIS_PORT` | Redis-Port (Standard: `6379`) |
| `REDIS_PASSWORD` | Redis-Passwort |
| `JWT_AUTH_SECRET` | Geheimschlüssel für Access Tokens |
| `JWT_REFRESH_AUTH_SECRET` | Geheimschlüssel für Refresh Tokens |
| `JWT_OTP_AUTH_SECRET` | Geheimschlüssel für OTP-Tokens |
| `EMAIL_ADDRESS` | Absender-E-Mail-Adresse |
| `EMAIL_USER` | Mailjet-API-Schlüssel |
| `EMAIL_PASSWORD` | Mailjet-API-Geheimnis |
| `MINIO_BUCKET` | MinIO-Bucket-Name |
| `MINIO_ENDPOINT` | MinIO-Endpunkt-URL |
| `MINIO_ACCESS_KEY` | MinIO Access Key |
| `MINIO_SECRET_KEY` | MinIO Secret Key |
| `WEB_APP_DOMAIN` | Öffentliche URL der Web-App |
| `API_KEY` | API-Key für Service-Authentifizierung (UUID) |

### Optionale Felder

| Variable | Beschreibung |
|---|---|
| `LOG_LEVEL` | Log-Level (`info`, `debug`, `error`) |
| `LOG_TOKEN` | Logtail-Ingestion-Token für Cloud-Logging |
| `ACTIVATE_SWAGGERER` | Swagger-UI aktivieren (`true`/`false`) |
| `SWAGGER_USER` | Benutzername für Swagger Basic Auth |
| `SWAGGER_PASSWORD` | Passwort für Swagger Basic Auth |
| `THROTTLE_TTL` | Rate-Limit-Fenster in Sekunden |
| `THROTTLE_LIMIT` | Maximale Anfragen pro Fenster |

---

## Anwendung starten

### Backend (API)

```bash
cd api

# Entwicklungsmodus (Hot Reload)
npm run start:dev

# Produktionsmodus (mit Clustering)
npm run start:prod

# Produktionsmodus + Datenbankmigrationen beim Start
npm run start:prod:db
```

### Frontend (Web-App)

```bash
cd web-app
npm start
```

Die Anwendung ist dann erreichbar unter:
- **API**: `http://localhost:3000`
- **Swagger-Dokumentation**: `http://localhost:3000/docs` (sofern aktiviert)
- **Prometheus-Metriken**: `http://localhost:4001/metrics`
- **Frontend**: `http://localhost:3001` (oder je nach CRA-Konfiguration)

---

## Datenbankmigrationen

```bash
cd api

# Alle ausstehenden Migrationen ausführen
npm run db:migrate

# Seed-Daten einspielen
npm run db:seed

# Migrieren + Seeden in einem Schritt
npm run db:update

# Nur Konstanten-Seed-Daten (Rollen, Berechtigungen, etc.)
npm run db:update:constants
```

> Migrationen und Seeders liegen unter `api/migrations/`. Die Ausführungshistorie wird in den Tabellen `_migrations` und `_seeders` in der Datenbank gespeichert.

---

## API-Dokumentation

Die interaktive Swagger-UI ist unter `/docs` erreichbar, wenn `ACTIVATE_SWAGGERER=true` gesetzt ist. Der Zugriff ist mit Basic Auth (`SWAGGER_USER` / `SWAGGER_PASSWORD`) gesichert.

### Endpunkt-Übersicht

| Ressource | Basis-Pfad | Beschreibung |
|---|---|---|
| Benutzer | `/api/users` | Registrierung, Einladung, Profil, Passwortverwaltung |
| Authentifizierung | `/api/users/login` | Login, Token-Refresh, Logout |
| Zwei-Faktor-Auth | `/api/2fa` | 2FA generieren, verifizieren, deaktivieren |
| Unternehmen | `/api/company` | Unternehmen erstellen und verwalten |
| Rollen | `/api/roles` | Rollenverwaltung (RBAC) |
| Berechtigungen | `/api/permissions` | Berechtigungsdefinitionen |
| Szenarien (Courses) | `/api/course` | Szenarien erstellen, bearbeiten, löschen |
| Szenario-Sitzungen | `/api/course-progress` | Sitzungen starten, verfolgen, exportieren |
| Dateien | `/api/file` | Dateien hochladen und löschen (MinIO) |
| Tokens | `/api/tokens` | Einladungs- und Reset-Token-Verwaltung |
| Feature-Flags | `/api/features` | Features aktivieren/deaktivieren |
| Konfiguration | `/api/configuration` | App-Konfiguration zur Laufzeit |
| Health | `/api/health` | Gesundheitsstatus (DB-Konnektivität) |

---

## Authentifizierung & Autorisierung

### Authentifizierungsfluss

```
1. POST /api/users/login  →  { accessToken, refreshToken }
2. Requests:  Authorization: Bearer <accessToken>
3. Token abgelaufen?  →  POST /api/users/refresh  →  neues accessToken
4. Logout:  POST /api/users/logout  →  Token wird in Redis-Blacklist eingetragen
```

### Zwei-Faktor-Authentifizierung

```
1. POST /api/2fa/generate  →  QR-Code + Secret
2. QR-Code in Authenticator-App scannen
3. POST /api/2fa/verify    →  6-stelliger TOTP-Code bestätigen
4. Zukünftige Logins erfordern OTP-Token als zweiten Schritt
```

### Token-Typen

| Typ | Lebensdauer | Verwendung |
|---|---|---|
| Access Token | Kurz (konfigurierbar) | API-Anfragen autorisieren |
| Refresh Token | 365 Tage | Access Token erneuern |
| OTP Token | 5 Minuten | Temporärer Token nach 2FA-Login |

### Berechtigungssystem

Berechtigungen werden über `@UseGuards(JwtAuthGuard, PermissionsGuard)` und den `@Permissions(...)` Dekorator auf Controller-Methoden durchgesetzt. Wichtige Berechtigungscodes:

```
GLOBAL_ADMIN        – Vollzugriff auf alle Ressourcen
ADMIN               – Administrativer Zugriff auf Unternehmensebene
MANAGE_COURSES      – Szenarien erstellen und bearbeiten
COURSES             – Szenarien lesen
INVITE_USER         – Benutzer einladen
GET_USER            – Benutzerprofile lesen
UPDATE_USER         – Benutzer bearbeiten
MANAGE_CONFIGURATION – App-Konfiguration ändern
UPLOAD_FILES        – Dateien hochladen
PROTOCOL_WRITER     – In Szenario-Protokolle schreiben
```

---

## WebSockets & Echtzeit

Die Anwendung verwendet `Socket.io` über den `CourseProgressGateway` für Echtzeit-Updates während aktiver Szenario-Sitzungen. Verbindungen werden über den `WebSocketGuard` authentifiziert (JWT-Token im Handshake).

**Typische Ereignisse:**
- Teilnehmer tritt Sitzung bei / verlässt sie
- Protokollnachrichten werden versendet
- Entscheidungen werden getroffen
- Szenario-Status ändert sich

Im Cluster-Betrieb sorgen Sticky Sessions dafür, dass WebSocket-Verbindungen immer zum selben Worker-Prozess routen.

---

## Dateiverwaltung

Dateien werden in einem **MinIO**-Bucket gespeichert (S3-kompatibel). Der `FileService` unterstützt:

- Einzelne und Batch-Uploads via Multer
- Upload aus dem lokalen Dateisystem (temporäre Dateien)
- Automatische MIME-Type-Erkennung
- Dateilöschung aus dem Bucket

Kurs-Dateien werden täglich durch einen Cron-Job bereinigt, der nicht mehr referenzierte Dateien aus dem Bucket entfernt.

---

## Monitoring & Logging

### Logging

Alle HTTP-Anfragen werden mit Pino strukturiert protokolliert. Sensible Felder (`authorization`, `password`, `confirmPassword`) werden automatisch aus den Logs reduziert. Jede Anfrage erhält eine eindeutige `x-request-id` für end-to-end-Tracing.

Bei gesetztem `LOG_TOKEN` werden Logs zusätzlich an **Logtail** (cloud-based logging) weitergeleitet.

### Prometheus-Metriken

```
GET http://localhost:4001/metrics
```

Im Cluster-Modus aggregiert der Master-Prozess die Metriken aller Worker und stellt sie unter Port `4001` bereit, kompatibel mit Standard-Prometheus-Scraping-Setups.

### Health Check

```
GET /api/health
```

Prüft die Datenbankverbindung. Geeignet für Kubernetes Liveness- und Readiness-Probes.

---

## Tests

```bash
cd api

# Unit-Tests
npm run test

# End-to-End-Tests
npm run test:e2e

# Test-Coverage-Bericht
npm run test:cov
```

---

## Deployment

### Docker

```bash
cd api
docker build -t bcm360-api .
docker run -p 3000:3000 --env-file .env bcm360-api
```

> Das Docker-Image basiert auf `mcr.microsoft.com/playwright` und beinhaltet alle nativen Build-Abhängigkeiten (Python3, make, g++).

### PM2

```bash
cd api
npm run build
pm2 start pm2.json
```

### Produktionsskripte

```bash
# Build + Migrations + Start in einem Schritt
npm run build:start

# Nur Produktionsserver (bereits kompiliert)
npm run start:prod
```

### Empfohlene Produktionskonfiguration

- **Reverse Proxy**: Nginx vor der Node.js-Anwendung mit SSL-Terminierung
- **Sticky Sessions**: Zwingend erforderlich wenn mehrere Worker-Prozesse laufen (WebSocket-Kompatibilität)
- **Redis Sentinel / Cluster**: Für Hochverfügbarkeit des Caches
- **MySQL Read Replicas**: Für Leseoperationen unter Last
- **MinIO Multi-Node**: Für hochverfügbaren Dateispeicher
