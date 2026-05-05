import * as Joi from "joi";

/**
 * Konstante: CACHE_CONFIG_ENVIRONMENT_VARIABLES_SCHEMA
 *
 * Dieses Joi-Validierungsschema stellt sicher, dass beim Laden der Umgebungsvariablen für das Caching
 * alle erforderlichen (oder optionalen) Konfigurationswerte vorhanden und korrekt formatiert sind.
 *
 * Verwendungszweck:
 * - Eingesetzt im `ConfigModule` zur Validierung beim Start der Anwendung
 * - Verhindert ungültige Konfigurationen für den Cache (z. B. fehlender TTL-Wert)
 *
 * Felder:
 * - CACHE_TTL: Zeit in Sekunden, wie lange ein Cache-Eintrag gültig bleibt
 * - CACHE_MAX: Maximale Anzahl an Elementen im Cache
 *
 * Optional für Redis (derzeit auskommentiert):
 * - REDIS_HOST: Hostname oder IP des Redis-Servers (required bei Nutzung)
 * - REDIS_PORT: Portnummer des Redis-Servers
 * - REDIS_USERNAME: Optionaler Benutzername für Authentifizierung
 * - REDIS_PASSWORD: Optionales Passwort für Authentifizierung
 */
export const CACHE_CONFIG_ENVIRONMENT_VARIABLES_SCHEMA = Joi.object({
	CACHE_TTL: Joi.string(),
	CACHE_MAX: Joi.string(),

	// Uncomment if you need redis cache
	// REDIS_HOST: Joi.string().required(),
	// REDIS_PORT: Joi.string().required(),
	// REDIS_USERNAME: Joi.string(),
	// REDIS_PASSWORD: Joi.string(),
});
