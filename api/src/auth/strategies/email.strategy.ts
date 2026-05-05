import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";

import User from "src/users/models/user.model";
import { AuthService } from "../auth.service";

/**
 * Klasse: EmailStrategy
 *
 * Diese Passport-Strategie erweitert die `local`-Strategie,
 * um die Authentifizierung über E-Mail und Passwort zu ermöglichen.
 *
 * Besonderheit:
 * - Der `usernameField` wird auf `"email"` gesetzt (statt standardmäßig `username`)
 *
 * Verwendung:
 * - Wird bei Login-Vorgängen verwendet (z.B. `/auth/login`)
 * - Intern wird `authService.validateUser(...)` aufgerufen
 */
@Injectable()
export class EmailStrategy extends PassportStrategy(Strategy, "email") {
	constructor(private authService: AuthService) {
		super({ usernameField: "email" });
	}

	/**
	 * Validiert E-Mail und Passwort gegen die Benutzerdatenbank.
	 *
	 * @param email - Benutzer-E-Mail
	 * @param password - Klartext-Passwort
	 * @returns Benutzerobjekt bei Erfolg, sonst `UnauthorizedException`
	 */
	async validate(email: string, password: string): Promise<User> {
		const user: User | null = await this.authService.validateUser(email, password);

		if (!user) {
			throw new UnauthorizedException();
		}

		return user;
	}
}
