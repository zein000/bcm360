import * as Joi from "joi";

/**
 * Konstante: JWT_CONFIG_ENVIRONMENT_VARIABLES_SCHEMA
 *
 * Dieses Joi-Validierungsschema stellt sicher, dass alle notwendigen Umgebungsvariablen
 * für die JWT-Konfiguration korrekt gesetzt sind.
 * Es wird vom `ConfigModule` verwendet, um beim Start der Anwendung fehlerhafte oder fehlende
 * JWT-bezogene Konfigurationen frühzeitig zu erkennen.
 *
 * Erwartete Umgebungsvariablen:
 * - JWT_AUTH_SECRET: Secret für Access Tokens (z.B. Login-Token)
 * - JWT_AUTH_EXPIRE_DAYS: Gültigkeitsdauer des Access Tokens in Tagen
 * - JWT_REFRESH_AUTH_SECRET: Secret für Refresh Tokens
 * - JWT_REFRESH_AUTH_EXPIRE_DAYS: Gültigkeit des Refresh Tokens in Tagen
 * - JWT_OTP_AUTH_SECRET: Secret für OTP-Tokens (One-Time Password, z.B. 2FA)
 * - JWT_OTP_EXPIRE_SECONDS: Ablaufzeit der OTP-Tokens in Sekunden
 */
export const JWT_CONFIG_ENVIRONMENT_VARIABLES_SCHEMA = Joi.object({
	JWT_AUTH_SECRET: Joi.string().required(),
	JWT_AUTH_EXPIRE_DAYS: Joi.string().required(),
	JWT_REFRESH_AUTH_SECRET: Joi.string().required(),
	JWT_REFRESH_AUTH_EXPIRE_DAYS: Joi.string().required(),
	JWT_OTP_AUTH_SECRET: Joi.string().required(),
	JWT_OTP_EXPIRE_SECONDS: Joi.string().required(),
});
