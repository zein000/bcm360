import { registerAs } from "@nestjs/config";

/**
 * Konfiguration: jwt
 *
 * Dieses Konfigurationsobjekt stellt alle relevanten JWT-Einstellungen
 * der Anwendung bereit. Es wird unter dem Namespace `"jwt"` registriert
 * und typischerweise über das `ConfigModule` geladen.
 *
 * Enthält Secrets und Ablaufzeiten für:
 * - Access Tokens
 * - Refresh Tokens
 * - OTP Tokens (z.B. für 2FA)
 *
 * Verfügbare Werte:
 * - secret: Secret für Access Tokens
 * - expiration: Ablaufzeit (in Tagen oder ISO) für Access Tokens
 * - refreshSecret: Secret für Refresh Tokens
 * - refreshExpiration: Ablaufzeit für Refresh Tokens (⚠ hier scheinbar falsch benannt!)
 * - otpSecret: Secret für OTP-Token
 * - otpJWTExpiration: Ablaufzeit des OTP-JWT in Sekunden
 *

 */
export default registerAs("jwt", () => ({
	secret: process.env.JWT_AUTH_SECRET,
	expiration: process.env.JWT_AUTH_EXPIRE_DAYS,
	refreshSecret: process.env.JWT_REFRESH_AUTH_SECRET,
	refreshExpiration: process.env.JWT_AUTH_EXPIRE_SECONDS,
	otpSecret: process.env.JWT_OTP_AUTH_SECRET,
	otpJWTExpiration: process.env.JWT_OTP_EXPIRE_SECONDS,
}));
