import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { ConfigType } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";

import { TwoFAEnabledDTO } from "src/users/dto/2fa-enabled.dto";
import User from "src/users/models/user.model";
import { UserInfoDTO } from "../users/dto/user-info.dto";
import { UsersService } from "../users/users.service";
import jwtConfig from "./config/jwt.config";
import { AuthResponseDTO } from "./dto/auth-response.dto";

const bcrypt = require("bcryptjs");

/**
 * Klasse: AuthService
 *
 * Dieser Service verwaltet die Authentifizierungslogik der Anwendung.
 * Er unterstützt klassische E-Mail/Passwort-Loginvorgänge sowie 2FA-Logins
 * und stellt Access/Refresh-Tokens zur Verfügung.
 *
 * Hauptaufgaben:
 * - Benutzervalidierung (E-Mail + Passwort)
 * - JWT-Generierung für Access, Refresh und OTP-Tokens
 * - Erstellung strukturierter DTOs für Client-Rückgaben (z.B. AuthResponseDTO)
 */
@Injectable()
export class AuthService {
	constructor(
		@Inject(forwardRef(() => UsersService))
		private readonly usersService: UsersService,
		private readonly jwtService: JwtService,
		@Inject(jwtConfig.KEY)
		private config: ConfigType<typeof jwtConfig>
	) {}

	/**
	 * Funktion: validateUser
	 *
	 * Validiert einen Benutzer anhand von E-Mail und Passwort.
	 *
	 * @param email - E-Mail-Adresse des Benutzers
	 * @param password - Unverschlüsseltes Passwort
	 * @returns Der Benutzer, falls gültig, andernfalls `null`
	 */
	async validateUser(email: string, password: string): Promise<User | null> {
		const user = await this.usersService.findOneByEmail(email);

		if (user && user.password) {
			const isPasswordValid: boolean = await bcrypt.compare(password, user.password);
			return isPasswordValid ? user : null;
		}

		return null;
	}

	/**
	 * Funktion: loginWith2fa
	 *
	 * Gibt ein OTP-Token (kurzlebiger JWT) für die 2FA-Verifizierung zurück.
	 *
	 * @param user - Der Benutzer
	 * @param isRememberMe - Gibt an, ob der Login dauerhaft sein soll
	 * @returns DTO mit Benutzerinfo + OTP-Token
	 */
	loginWith2fa(user: User, isRememberMe: boolean): TwoFAEnabledDTO {
		return new TwoFAEnabledDTO({
			user: new UserInfoDTO(user),
			otpToken: this.jwtService.sign(
				{ email: user.email },
				{
					expiresIn: this.config.otpJWTExpiration || "5m",
					secret: this.config.otpSecret,
				}
			),
			isRememberMe,
		});
	}

	/**
	 * Funktion: login
	 *
	 * Gibt Access- und Refresh-Tokens zurück für den regulären Login.
	 *
	 * @param user - Der Benutzer
	 * @param isRememberMe - Optional: Merken-Funktion aktiviert?
	 * @returns AuthResponseDTO mit Benutzerinfo, AccessToken und RefreshToken
	 */
	login(user: User, isRememberMe: boolean = false): AuthResponseDTO {
		return new AuthResponseDTO({
			user: new UserInfoDTO(user),
			accessToken: this.jwtService.sign({
				id: user.id,
			}),
			refreshToken: this.jwtService.sign(
				{ id: user.id },
				{
					secret: this.config.refreshSecret,
					expiresIn: this.config.refreshExpiration,
				}
			),
			isRememberMe,
		});
	}
}
