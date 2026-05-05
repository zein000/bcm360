import * as Joi from "joi";

/**
 * Konstante: TOKEN_CONFIG_ENVIRONMENT_VARIABLES_SCHEMA
 *
 * Dieses Joi-Validierungsschema definiert die erlaubten Umgebungsvariablen für Token-Ablaufzeiten.
 * Es wird im Zusammenhang mit dem NestJS `ConfigModule` verwendet, um fehlerhafte Konfigurationen
 * zur Laufzeit frühzeitig zu erkennen.
 *
 * Unterstützte Variablen:
 * - INVITATION_TOKEN_EXPIRATION: Ablaufzeit für Einladungstokens (in ms)
 * - FORGOTTEN_PASSWORD_TOKEN_EXPIRATION: Ablaufzeit für Passwort-zurücksetzen-Tokens (in ms)
 *
 * Hinweis:
 * - Alle Felder sind optional, aber sollten gültige Strings (idealerweise Zahlen als Text) sein.
 * - Zusätzliche Felder wie `CHANGE_EMAIL_TOKEN_EXPIRATION` können bei Bedarf ergänzt werden.
 */
export const TOKEN_CONFIG_ENVIRONMENT_VARIABLES_SCHEMA = Joi.object({
	INVITATION_TOKEN_EXPIRATION: Joi.string(),
	FORGOTTEN_PASSWORD_TOKEN_EXPIRATION: Joi.string(),
});
