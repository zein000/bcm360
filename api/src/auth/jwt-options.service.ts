import { Inject, Injectable } from "@nestjs/common";
import { ConfigType } from "@nestjs/config";
import { JwtModuleOptions, JwtOptionsFactory } from "@nestjs/jwt";

import jwtConfig from "./config/jwt.config";

/**
 * Klasse: JWTOptionsService
 *
 * Diese Service-Klasse implementiert das `JwtOptionsFactory`-Interface,
 * um die JWT-Konfiguration asynchron und typisiert bereitzustellen.
 *
 * Verwendung:
 * - Wird im `JwtModule.registerAsync(...)` genutzt
 * - Zieht dynamisch die Konfigurationswerte aus `.env` via `jwt.config.ts`
 *
 * Zurückgelieferte Optionen:
 * - secret: JWT-Geheimnis
 * - expiresIn: Ablaufdauer des Tokens
 */
@Injectable()
export class JWTOptionsService implements JwtOptionsFactory {
	constructor(
		@Inject(jwtConfig.KEY)
		private readonly config: ConfigType<typeof jwtConfig>
	) {}

	/**
	 * Liefert Konfigurationsoptionen für das JwtModule.
	 */
	createJwtOptions(): JwtModuleOptions {
		return {
			secret: this.config.secret,
			signOptions: {
				expiresIn: this.config.expiration,
			},
		};
	}
}
