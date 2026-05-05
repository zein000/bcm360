import { registerAs } from "@nestjs/config";

/**
 * Konfiguration: email
 *
 * Dieses Konfigurationsobjekt registriert die E-Mail-Einstellungen unter dem Namespace `"email"`.
 * Es wird von NestJS verwendet, um zentrale E-Mail-bezogene Umgebungsvariablen in den Anwendungskontext zu laden.
 *
 * Felder:
 * - key: API-Schlüssel für den Mail-Dienstleister (z. B. Mailjet)
 * - pass: API-Passwort für die Authentifizierung beim Mail-Dienst
 * - from: Standardabsender-Adresse für ausgehende E-Mails
 * - feedbackTo: Adresse für eingehende Feedback-/Support-E-Mails
 *
 * Hinweis: Falls `EMAIL_ADDRESS` oder `EMAIL_FEEDBACK_TO` nicht gesetzt sind,
 * werden Default-Adressen wie `template@browserbite.dev` verwendet.
 */
export default registerAs("email", () => ({
	key: process.env.EMAIL_KEY,
	pass: process.env.EMAIL_PASSWORD,
	from: process.env.EMAIL_ADDRESS || "template@browserbite.dev",
	feedbackTo: process.env.EMAIL_FEEDBACK_TO || "template@browserbite.dev",
}));
