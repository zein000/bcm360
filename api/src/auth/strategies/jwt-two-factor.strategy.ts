import { Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigType } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";

import { JWT2FAPayload } from "src/interfaces/jwt-2fa-payload.interface";
import { BlacklistJwtCachingService } from "src/caching/services/blacklist-caching.service";
import { UserInfoCachingService } from "../../caching/services/user-info-caching.service";

import User from "../../users/models/user.model";
import jwtConfig from "../config/jwt.config";

/**
 * Klasse: JwtTwoFactorStrategy
 *
 * Diese Passport-Strategie behandelt JWTs, bei denen Zwei-Faktor-Authentifizierung (2FA) aktiv ist.
 * Sie verwendet das Standard-Secret, prüft jedoch zusätzlich, ob das Token bereits auf einer Blacklist steht.
 *
 * Verwendungszweck:
 * - Strategie-Name: `"jwt-two-factor"`
 * - Verwendet bei Benutzern mit aktivierter 2FA
 * - Schützt zusätzlich vor der Wiederverwendung von bereits abgemeldeten Tokens
 */
@Injectable()
export class JwtTwoFactorStrategy extends PassportStrategy(Strategy, "jwt-two-factor") {
	constructor(
		@Inject(jwtConfig.KEY)
		config: ConfigType<typeof jwtConfig>,
		private readonly userInfoCachingService: UserInfoCachingService,
		private readonly jwtCachingService: BlacklistJwtCachingService
	) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: false,
			secretOrKey: config.secret,
			passReqToCallback: true,
		});
	}

	/**
	 * Validiert das JWT und stellt sicher, dass es nicht auf der Blacklist steht.
	 *
	 * @param req - Die HTTP-Anfrage (wird benötigt für Zugriff auf den Token-String)
	 * @param payload - JWT-Payload mit Benutzer-ID
	 * @returns Benutzerobjekt aus Cache
	 * @throws UnauthorizedException wenn Token blockiert ist
	 */
	async validate(req, payload: JWT2FAPayload): Promise<User | void> {
		const rawToken = req.headers["authorization"].split(" ")[1];

		const jwtInfo = await this.jwtCachingService.getBlacklistedJwt(rawToken);

		if (jwtInfo) {
			throw new UnauthorizedException();
		}

		return await this.userInfoCachingService.getUser(payload.id);
	}
}
