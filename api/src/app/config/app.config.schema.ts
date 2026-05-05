import * as Joi from "joi";

/**
 * Konstante: APP_CONFIG_ENVIRONMENT_VARIABLES_SCHEMA
 *
 * Dieses Joi-Schema dient zur Validierung der Umgebungsvariablen,
 * die für die allgemeine App-Konfiguration relevant sind.
 *
 * Verwendung:
 * - Wird im `ConfigModule` genutzt, um `.env`-Werte bei App-Start zu prüfen
 * - Verhindert ungültige oder fehlende Werte für zentrale App-Einstellungen
 *
 * Felder:
 * - WEB_APP_DOMAIN: (erforderlich) Domain der Web-Anwendung (z B. für CORS, Mails)
 * - THROTTLE_TTL: (optional) Rate-Limit TTL in Sekunden
 * - THROTTLE_LIMIT: (optional) Anzahl erlaubter Requests pro TTL
 * - NODE_ENV: (erforderlich) Umgebungsname (`development`, `production` etc.)
 * - LOG_TOKEN: (optional) API-Token für externes Logging (z.B. Logtail)
 * - LOG_LEVEL: (optional) Log-Level (`debug`, `info`, `warn`, `error` etc.)
 */
export const APP_CONFIG_ENVIRONMENT_VARIABLES_SCHEMA = Joi.object({
	WEB_APP_DOMAIN: Joi.string().required(),
	THROTTLE_TTL: Joi.string().optional(),
	THROTTLE_LIMIT: Joi.string().optional(),
	NODE_ENV: Joi.string().required(),
	LOG_TOKEN: Joi.string().optional(),
	LOG_LEVEL: Joi.string().optional(),
});
