/**
 * Datei: environment.d.ts
 *
 * Diese Datei erweitert das globale `ProcessEnv` Interface von NodeJS.
 *
 * Ziel: Statische Typisierung der Umgebungsvariablen (`process.env`) im Projekt, um
 * - Typensicherheit in der Entwicklung zu gewährleisten
 * - Fehler durch falsch geschriebene oder fehlende Variablennamen frühzeitig zu erkennen
 *
 * Jede definierte Eigenschaft entspricht einer Umgebungsvariablen, die von der Anwendung verwendet wird.
 * Alle Variablen sind als `string` typisiert, da Umgebungsvariablen immer als Strings gelesen werden.
 */

declare namespace NodeJS {
	export interface ProcessEnv {
		NODE_ENV: string; // z. B. "development", "production"

		// Datenbank-Konfiguration
		DB_PORT: string;
		DB_HOST: string;
		DB_USER: string;
		DB_PASSWORD: string;
		DB_DATABASE: string;

		// JWT Konfiguration für Authentifizierung
		JWT_AUTH_EXPIRE_SECONDS: string;
		JWT_AUTH_SECRET: string;
		JWT_AUTH_EXPIRE_DAYS: string;

		// E-Mail Konfiguration
		EMAIL_ADDRESS: string;
		EMAIL_PASSWORD: string;
		EMAIL_FEEDBACK_TO: string;

		// Web-Client Domain
		WEB_APP_DOMAIN: string;

		// Swagger Authentifizierung (API Doku)
		SWAGGER_USER: string;
		SWAGGER_PASSWORD: string;

		// Zwei-Faktor-Authentifizierungs-Konfiguration
		TWO_FACTOR_AUTHENTICATION_APP_NAME: string;

		// View Engine (z. B. für Handlebars Templates)
		PARTIALS_DIR: string;
		LAYOUTS_DIR: string;
		VIEWS_DIR: string;
		STATIC_ASSETS_DIR: string;
		DEFAULT_LAYOUT: string;

		// Redis Konfiguration (z. B. für Caching oder Sessions)
		REDIS_HOST: string;
		REDIS_PORT: string;
		REDIS_USERNAME: string;
		REDIS_PASSWORD: string;

		// JWT für Refresh Token Authentifizierung
		JWT_REFRESH_AUTH_SECRET: string;
		JWT_REFRESH_AUTH_EXPIRE_DAYS: string;

		// JWT für One-Time-Password (OTP)
		JWT_OTP_AUTH_SECRET: string;
		JWT_OTP_EXPIRE_SECONDS: string;
	}
}
