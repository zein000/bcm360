import * as Joi from "joi";

/**
 * Konstante: EMAIL_CONFIG_ENVIRONMENT_VARIABLES_SCHEMA
 *
 * Dieses Joi-Schema validiert die Umgebungsvariablen, die für den E-Mail-Versand benötigt werden.
 * Es wird z.B. im Rahmen des `ConfigModule`-Setups verwendet, um sicherzustellen, dass alle
 * erforderlichen Konfigurationswerte vorhanden und korrekt sind.
 *
 * Validierte Variablen:
 * - EMAIL_KEY: API-Schlüssel des E-Mail-Dienstleisters (z.B. Mailjet)
 * - EMAIL_PASSWORD: API-Passwort des Dienstleisters
 * - EMAIL_ADDRESS: Absenderadresse für ausgehende E-Mails
 * - EMAIL_FEEDBACK_TO: E-Mail-Adresse für Feedback oder Supportanfragen
 */
export const EMAIL_CONFIG_ENVIRONMENT_VARIABLES_SCHEMA = Joi.object({
	EMAIL_KEY: Joi.string().required(),
	EMAIL_PASSWORD: Joi.string().required(),
	EMAIL_ADDRESS: Joi.string().required(),
	EMAIL_FEEDBACK_TO: Joi.string().required(),
});
