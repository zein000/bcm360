/**
 * Interface: JWT2FAOTPPayload
 *
 * Dieses Interface beschreibt die Payload-Struktur eines JWT-Tokens,
 * das im Rahmen der Zwei-Faktor-Authentifizierung (2FA) für OTP (One-Time Password) verwendet wird.
 *
 * Verwendungszweck:
 * - Wird typischerweise beim Signieren und Verifizieren von JWTs für den zweiten Authentifizierungsschritt (OTP) benutzt
 * - Enthält nur die E-Mail-Adresse des Nutzers als Identifikationsmerkmal
 *
 * Felder:
 * - email: Die E-Mail-Adresse des Benutzers, für den das OTP generiert wurde
 */
export interface JWT2FAOTPPayload {
	email: string;
}
