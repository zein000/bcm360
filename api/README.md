# BCM360 API

NestJS-Backend für die BCM360-Plattform. REST-API mit WebSocket-Unterstützung für die Durchführung und Auswertung von Krisenmanagement-Szenarien.

Vollständige Projektdokumentation: siehe [Root-README](../README.md).

---

## Schnellstart

```bash
# Abhängigkeiten installieren
npm install

# Umgebungsvariablen konfigurieren
cp .example.env .env
# .env anpassen (Datenbank, Redis, MinIO, JWT-Secrets, etc.)

# Entwicklungsserver starten (Hot Reload)
npm run start:dev
```

---

## Verfügbare Skripte

### Entwicklung

| Befehl | Beschreibung |
|---|---|
| `npm run start:dev` | Entwicklungsserver mit Hot Reload |
| `npm start` | Einzel-Worker ohne Watch-Modus |

### Produktion

| Befehl | Beschreibung |
|---|---|
| `npm run build` | TypeScript zu JavaScript kompilieren |
| `npm run start:prod` | Produktionsserver (Cluster-Modus) |
| `npm run start:prod:db` | Produktionsserver + DB-Migrationen beim Start |
| `npm run build:start` | Build + Migrationen + Start in einem Schritt |

### Datenbank

| Befehl | Beschreibung |
|---|---|
| `npm run db:migrate` | Ausstehende Migrationen ausführen |
| `npm run db:seed` | Seed-Daten einspielen |
| `npm run db:update` | Migrieren + Seeden |
| `npm run db:update:constants` | Nur Konstanten-Seeds (Rollen, Berechtigungen) |

### Tests

| Befehl | Beschreibung |
|---|---|
| `npm run test` | Unit-Tests |
| `npm run test:e2e` | End-to-End-Tests |
| `npm run test:cov` | Test-Coverage-Bericht |

### Code-Qualität

| Befehl | Beschreibung |
|---|---|
| `npm run lint` | ESLint ausführen |
| `npm run format` | Prettier-Formatierung anwenden |

---

## Modulübersicht

| Modul | Pfad | Verantwortlichkeit |
|---|---|---|
| `AppModule` | `src/app/` | Root-Modul, globale Konfiguration |
| `AuthModule` | `src/auth/` | JWT-Strategien, Guards |
| `UsersModule` | `src/users/` | Benutzer-CRUD, Einladungen |
| `CompanyModule` | `src/company/` | Unternehmensverwaltung |
| `RolesModule` | `src/roles/` | RBAC-Rollenverwaltung |
| `PermissionsModule` | `src/permissions/` | Berechtigungsdefinitionen |
| `TwoFAModule` | `src/2fa/` | TOTP/OTP Zwei-Faktor-Auth |
| `CoursesModule` | `src/courses/` | Szenarien & Tags |
| `CourseProgressModule` | `src/course-progress/` | Sitzungen, Teilnehmer, WebSocket-Gateway |
| `CachingModule` | `src/caching/` | Redis-Caching-Services |
| `DatabaseModule` | `src/database/` | Sequelize-Konfiguration |
| `FileModule` | `src/file/` | MinIO-Datei-Upload/-Löschung |
| `MailModule` | `src/mail/` | Transaktionale E-Mails (Mailjet) |
| `EventHistoryModule` | `src/event-history/` | Audit-Logging |
| `TokensModule` | `src/tokens/` | Einladungs- & Reset-Tokens |
| `FeaturesModule` | `src/features/` | Feature-Flags |
| `ConfigurationModule` | `src/configuration/` | Laufzeit-App-Konfiguration |
| `HealthModule` | `src/health/` | Kubernetes-Readiness-Probe |
| `ViewEngineModule` | `src/view-engine/` | Handlebars-E-Mail-Templates |

---

## Datenbankmigrationen

Migrationen liegen unter `migrations/` und werden mit der Sequelize CLI verwaltet.

```bash
# Neue Migration erstellen
npx sequelize-cli migration:create --name beschreibung

# Neuen Seeder erstellen
npx sequelize-cli seed:generate --name beschreibung
```

Konfiguration: `migrations/config.js` (liest aus Umgebungsvariablen).

---

## Ports

| Port | Dienst |
|---|---|
| `3000` | HTTP-API + WebSocket |
| `4001` | Prometheus-Metriken (nur Master-Prozess) |
