import { ExtractJwt, Strategy } from "passport-jwt";
import { PassportStrategy } from "@nestjs/passport";
import { Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigType } from "@nestjs/config";

import { UsersService } from "src/users/users.service";
import { JWT2FAOTPPayload } from "src/interfaces/jwt-2fa-otp-payload.interface";

import User from "../../users/models/user.model";
import jwtConfig from "../config/jwt.config";

/**
 * Klasse: JwtTwoFactorOtpStrategy
 *
 * Diese Passport-Strategie wird für den zweiten Schritt der Zwei-Faktor-Authentifizierung (2FA) verwendet.
 * Sie prüft das kurze JWT, das nach erfolgreichem Login zur Validierung des OTP (One-Time Password) dient.
 *
 * Strategie-Name: `"jwt-two-factor-otp"`
 * Verwendetes Secret: `otpSecret` aus der Konfiguration
 */
@Injectable()
export class JwtTwoFactorOtpStrategy extends PassportStrategy(Strategy, "jwt-two-factor-otp") {
	constructor(
		@Inject(jwtConfig.KEY)
		config: ConfigType<typeof jwtConfig>,
		private readonly userService: UsersService
	) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: false,
			secretOrKey: config.otpSecret,
			passReqToCallback: true,
		});
	}

	/**
	 * Validiert den Benutzer anhand der im JWT enthaltenen E-Mail.
	 *
	 * @param req - HTTP-Request (nicht verwendet, aber notwendig wegen passReqToCallback)
	 * @param payload - Payload mit E-Mail-Adresse
	 * @returns Benutzerobjekt oder UnauthorizedException
	 */
	async validate(req, payload: JWT2FAOTPPayload): Promise<User | void> {
		const user = await this.userService.findOneByEmail(payload.email);

		if (!user) {
			throw new UnauthorizedException();
		}

		return user;
	}
}
