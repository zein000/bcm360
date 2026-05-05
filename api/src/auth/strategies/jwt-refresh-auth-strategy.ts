import { ExtractJwt, Strategy } from "passport-jwt";
import { PassportStrategy } from "@nestjs/passport";
import { Inject, Injectable } from "@nestjs/common";
import { ConfigType } from "@nestjs/config";

import { JWT2FAPayload } from "src/interfaces/jwt-2fa-payload.interface";
import User from "src/users/models/user.model";

import { UserInfoCachingService } from "../../caching/services/user-info-caching.service";
import jwtConfig from "../config/jwt.config";

/**
 * Klasse: JwtRefreshAuthStrategy
 *
 * Diese Passport-Strategie behandelt die Authentifizierung mittels Refresh-Tokens.
 * Sie wird z.B. beim Erneuern eines Access-Tokens verwendet.
 *
 * Verwendung:
 * - Strategie-Name: `"jwt-refresh-auth"`
 * - Token wird aus dem Authorization Header im Bearer-Format extrahiert
 * - Validiert das Token gegen das `refreshSecret` aus der Konfiguration
 *
 * Besonderheit:
 * - Der Benutzer wird aus dem Cache geladen, um zusätzliche DB-Queries zu vermeiden
 */
@Injectable()
export class JwtRefreshAuthStrategy extends PassportStrategy(Strategy, "jwt-refresh-auth") {
	constructor(
		@Inject(jwtConfig.KEY)
		config: ConfigType<typeof jwtConfig>,
		private readonly userInfoCachingService: UserInfoCachingService
	) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: false,
			secretOrKey: config.refreshSecret,
		});
	}

	/**
	 * Gibt den Benutzer zurück, der im JWT-Refresh-Payload enthalten ist.
	 *
	 * @param payload - JWT-Payload mit `id`-Feld
	 * @returns Benutzerobjekt aus dem Cache (oder undefined)
	 */
	async validate(payload: JWT2FAPayload): Promise<User | void> {
		return await this.userInfoCachingService.getUser(payload.id);
	}
}
