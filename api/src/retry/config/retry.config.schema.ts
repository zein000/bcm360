import * as Joi from "joi";

/**
 * Konstante: RETRY_CONFIG_ENVIRONMENT_VARIABLES_SCHEMA
 *
 * Dieses Joi-Schema stellt sicher, dass die notwendigen Umgebungsvariablen
 * für die Retry-Konfiguration korrekt gesetzt sind. Es wird verwendet, um
 * die Redis-Verbindungsdetails für die BullMQ-Warteschlange zu validieren.
 *
 * Erwartete Umgebungsvariablen:
 * - REDIS_HOST: Redis-Host (z.B. "localhost" oder eine externe Redis-Instanz)
 * - REDIS_PORT: Redis-Port (z.B. 6379)
 * - REDIS_USERNAME: Optionaler Redis-Benutzername
 * - REDIS_PASSWORD: Optionales Passwort für Redis (kann auch null oder leer sein)
 */
export const RETRY_CONFIG_ENVIRONMENT_VARIABLES_SCHEMA = Joi.object({
	REDIS_HOST: Joi.string().required(),
	REDIS_PORT: Joi.string().required(),
	REDIS_USERNAME: Joi.string(),
	REDIS_PASSWORD: Joi.string().allow(null, ""),
});
