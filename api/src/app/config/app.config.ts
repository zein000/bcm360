import { registerAs } from "@nestjs/config";

/**
 * Interface: IAppConfig
 *
 * Beschreibt die Struktur der zentralen App-Konfiguration, die über Umgebungsvariablen definiert wird.
 */
export interface IAppConfig {
	webAppDomain: string;
	throttleTtl: number;
	throttleLimit: number;
	logLevel: string;
	env: string;
	logToken?: string | false;
}

/**
 * Konfiguration: app
 *
 * Registriert die globale Anwendungskonfiguration unter dem Namespace `"app"`.
 * Diese Einstellungen beeinflussen zentrale Verhalten wie Logging, Throttling und Domain-Angaben.
 *
 * Felder:
 * - webAppDomain: Domain der Web-Anwendung (für Mails, CORS etc.)
 * - throttleTtl: Dauer (in Sekunden) für Rate Limiting (Request-Limits)
 * - throttleLimit: Anzahl erlaubter Requests innerhalb der TTL
 * - logLevel: Logging-Stufe (z.B. info, warn, error)
 * - env: Umgebung (z.B. development, production)
 * - logToken: (optional) Logtail o.ä. Logging-Token, deaktiviert wenn nicht gesetzt
 */
export default registerAs("app", (): IAppConfig => {
	return {
		webAppDomain: process.env.WEB_APP_DOMAIN,
		throttleTtl: Number(process.env.THROTTLE_TTL),
		throttleLimit: Number(process.env.THROTTLE_LIMIT),
		logLevel: process.env.LOG_LEVEL || "info",
		env: process.env.NODE_ENV || "development",
		logToken: process.env.LOG_TOKEN || false,
	};
});
