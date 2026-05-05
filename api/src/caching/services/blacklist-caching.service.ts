import { Inject, Injectable } from "@nestjs/common";
import { ConfigType } from "@nestjs/config";
import { Cache } from "cache-manager";

import { CACHE_MANAGER } from "@nestjs/cache-manager";

import UserBlacklist from "src/user-blacklist/models/user-blacklist.model";

import cacheConfig from "../config/caching.config";
import { CachingService } from "../caching.service";

/**
 * Klasse: BlacklistJwtCachingService
 *
 * Dieser Service erweitert die generische `CachingService`-Klasse und verwaltet die Zwischenspeicherung (Caching)
 * von JWT-Tokens, die auf eine Blacklist gesetzt wurden. Dies dient der zusätzlichen Sicherheit, um
 * Tokens sofort ungültig zu machen, z. B. nach Logout oder Sicherheitsverletzungen.
 *
 * Cache-Namespace: `"bl_jwt"`
 *
 * Funktionen:
 * - JWT in die Blacklist aufnehmen (set)
 * - Blacklisted JWT auslesen (get)
 * - JWT aus der Blacklist entfernen (del)
 */
@Injectable()
export class BlacklistJwtCachingService extends CachingService {
	constructor(
		@Inject(cacheConfig.KEY)
		config: ConfigType<typeof cacheConfig>,
		@Inject(CACHE_MANAGER) cacheManager: Cache
	) {
		super(cacheManager, "bl_jwt", config.ttl);
	}

	/**
	 * Funktion: setBlacklistedJwt
	 *
	 * Speichert ein JWT-Token in der Blacklist im Cache.
	 *
	 * @param data - Objekt mit userId, issuedAt, expiresAt, value (JWT)
	 */
	async setBlacklistedJwt(data: Partial<UserBlacklist>) {
		await this.set(
			data.value.toString(),
			JSON.stringify({
				userId: data.userId,
				issuedAt: data.issuedAt,
				expiresAt: data.expiresAt,
			})
		);
	}

	/**
	 * Funktion: getBlacklistedJwt
	 *
	 * Prüft, ob ein JWT-Token sich in der Blacklist befindet.
	 *
	 * @param jwt - JWT-Token als String
	 * @returns Parsed Objekt mit Blacklist-Informationen oder null
	 */
	async getBlacklistedJwt(jwt: string) {
		const res = await this.get(jwt.toString());

		if (res) {
			return JSON.parse(res);
		}

		return null;
	}

	/**
	 * Funktion: deleteBlacklistedJwt
	 *
	 * Entfernt ein JWT-Token aus der Blacklist.
	 *
	 * @param jwt - JWT-Token als String
	 */
	async deleteBlacklistedJwt(jwt: string) {
		await this.del(jwt);
	}
}
