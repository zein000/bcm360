import * as Joi from "joi";

/**
 * Konstante: DATABASE_CONFIG_ENVIRONMENT_VARIABLES_SCHEMA
 *
 * Dieses Joi-Schema definiert und validiert alle notwendigen Umgebungsvariablen
 * für die Datenbankverbindung. Es wird beim Start der Anwendung verwendet, um sicherzustellen,
 * dass keine Konfigurationswerte fehlen.
 *
 * Verwendet von: `ConfigModule.forRoot({ validationSchema })` in der NestJS-Konfiguration.
 *
 * Erwartete Umgebungsvariablen:
 * - DB_HOST:     Hostname oder IP der Datenbank (z. B. localhost)
 * - DB_PORT:     Portnummer (als String) – Standard für MySQL: 3306
 * - DB_USER:     Benutzername für DB-Zugang
 * - DB_PASSWORD: Passwort für den Benutzer
 * - DB_DATABASE: Name der zu verwendenden Datenbank
 */
export const DATABASE_CONFIG_ENVIRONMENT_VARIABLES_SCHEMA = Joi.object({
	DB_HOST: Joi.string().required(),
	DB_PORT: Joi.string().required(),
	DB_USER: Joi.string().required(),
	DB_PASSWORD: Joi.string().required(),
	DB_DATABASE: Joi.string().required(),
});
