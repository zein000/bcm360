import { registerAs } from "@nestjs/config";

/**
 * Konfiguration: token
 *
 * Dieses Konfigurationsobjekt definiert die Ablaufzeiten (in Millisekunden) für verschiedene Token-Zwecke.
 * Es wird über das NestJS-`ConfigModule` geladen und unter dem Namespace `"token"` bereitgestellt.
 *
 * Token-Zwecke & Standardlaufzeiten:
 * - invitationTokenExpiration: Einladungs-Token, Standard: 7 Tage
 * - forgottenPasswordTokenExpiration: Passwort-Zurücksetzen, Standard: 7 Tage
 * - changeEmailTokenExpiration: E-Mail-Änderung, Standard: 7 Tage
 *
 * Hinweis:
 * - Die Werte können über Umgebungsvariablen gesteuert werden (müssen numerisch sein)
 */
export default registerAs("token", () => ({
	invitationTokenExpiration:
		process.env.INVITATION_TOKEN_EXPIRATION &&
		!isNaN(Number(process.env.INVITATION_TOKEN_EXPIRATION))
			? Number(process.env.INVITATION_TOKEN_EXPIRATION)
			: 7 * 24 * 60 * 60 * 1000, // 7 Tage

	forgottenPasswordTokenExpiration:
		process.env.FORGOTTEN_PASSWORD_TOKEN_EXPIRATION &&
		!isNaN(Number(process.env.FORGOTTEN_PASSWORD_TOKEN_EXPIRATION))
			? Number(process.env.FORGOTTEN_PASSWORD_TOKEN_EXPIRATION)
			: 7 * 24 * 60 * 60 * 1000,

	changeEmailTokenExpiration:
		process.env.CHANGE_EMAIL_TOKEN_EXPIRATION &&
		!isNaN(Number(process.env.CHANGE_EMAIL_TOKEN_EXPIRATION))
			? Number(process.env.CHANGE_EMAIL_TOKEN_EXPIRATION)
			: 7 * 24 * 60 * 60 * 1000,
}));
