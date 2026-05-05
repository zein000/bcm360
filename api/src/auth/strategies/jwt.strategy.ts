import { Inject, Injectable } from "@nestjs/common";
import { ConfigType } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";

import { JWTPayload } from "src/interfaces/jwt-payload.interface";
import jwtConfig from "../config/jwt.config";

/**
 * Klasse: JwtStrategy
 *
 * Diese Strategie implementiert die Standard-JWT-Authentifizierung mit Passport.
 * Sie extrahiert das JWT aus dem Authorization-Header und prüft es mit dem konfigurierten Secret.
 *
 * Verwendung:
 * - Wird für Routen verwendet, die `@UseGuards(AuthGuard('jwt'))` nutzen
 * - Verifiziert gültige Bearer Tokens und übergibt die Nutzlast an Request-Handler
 *
 * Payload:
 * - Erwartet ein Objekt vom Typ `JWTPayload`, das `id` und `roles` enthält
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor(
		@Inject(jwtConfig.KEY)
		private readonly config: ConfigType<typeof jwtConfig>
	) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: false,
			secretOrKey: config.secret,
		});
	}

	/**
	 * Wird automatisch aufgerufen, wenn das Token gültig ist.
	 * Gibt die extrahierte Nutzlast zur weiteren Verwendung zurück.
	 *
	 * @param payload - JWT Payload (enthält id und Rollen)
	 * @returns Authentifizierter Benutzerkontext
	 */
	async validate(payload: JWTPayload): Promise<JWTPayload> {
		return { id: payload.id, roles: payload.roles };
	}
}
