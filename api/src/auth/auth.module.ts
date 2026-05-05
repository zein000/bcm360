import { forwardRef, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";

import { UsersModule } from "../users/users.module";
import jwtConfig from "./config/jwt.config";

import { AuthService } from "./auth.service";

import { EmailStrategy } from "./strategies/email.strategy";
import { JwtTwoFactorStrategy } from "./strategies/jwt-two-factor.strategy";
import { JwtStrategy } from "./strategies/jwt.strategy";

import { CachingModule } from "../caching/caching.module";
import { JwtAndApiKeyGuard } from "./guards/jwt-api-key.guard";
import { JWTOptionsService } from "./jwt-options.service";
import { JwtRefreshAuthStrategy } from "./strategies/jwt-refresh-auth-strategy";
import { JwtTwoFactorOtpStrategy } from "./strategies/jwt-two-factor-otp.strategy";

/**
 * Klasse: AuthModule
 *
 * Dieses Modul bündelt alle Authentifizierungs-Features der Anwendung:
 * - E-Mail/Passwort-Login
 * - Zwei-Faktor-Authentifizierung (2FA)
 * - JWT-basierte Authentifizierung mit Refresh-Tokens
 * - API-Key-Absicherung
 *
 * Enthaltene Strategie-Klassen:
 * - EmailStrategy: Validierung von Benutzeranmeldedaten
 * - JwtStrategy: Standard-Token-Validierung
 * - JwtTwoFactorStrategy: Token mit aktivierter 2FA
 * - JwtTwoFactorOtpStrategy: 2FA via OTP
 * - JwtRefreshAuthStrategy: Refresh-Token-Verarbeitung
 *
 * Konfiguration:
 * - Lädt JWT-Konfiguration asynchron aus Umgebungsvariablen
 * - Verwendet `JWTOptionsService` zur Bereitstellung dynamischer Optionen
 *
 * Abhängigkeiten:
 * - UsersModule (für Benutzerdaten)
 * - CachingModule (z.B. für OTP-Token oder Blacklisting)
 */
@Module({
	imports: [
		ConfigModule.forRoot({
			load: [jwtConfig],
		}),
		PassportModule,
		ConfigModule,
		forwardRef(() => UsersModule),
		JwtModule.registerAsync({
			imports: [
				ConfigModule.forRoot({
					load: [jwtConfig],
				}),
			],
			global: true,
			useClass: JWTOptionsService,
		}),
		forwardRef(() => CachingModule),
	],
	providers: [
		AuthService,
		EmailStrategy,
		JwtStrategy,
		JwtTwoFactorStrategy,
		JwtAndApiKeyGuard,
		JwtRefreshAuthStrategy,
		JwtTwoFactorOtpStrategy,
	],
	exports: [AuthService, JwtModule],
})
export class AuthModule {}
