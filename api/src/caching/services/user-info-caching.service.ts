import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { ConfigType } from "@nestjs/config";
import { Cache } from "cache-manager";

import { CACHE_MANAGER } from "@nestjs/cache-manager";

import { UserInfoDTO } from "src/users/dto/user-info.dto";
import User from "../../users/models/user.model";
import { UsersService } from "../../users/users.service";
import { CachingService } from "../caching.service";
import cacheConfig from "../config/caching.config";

/**
 * Klasse: UserInfoCachingService
 *
 * Dieser Service kümmert sich um das Caching von Benutzerinformationen, sowohl anhand der Benutzer-ID
 * als auch anhand des API-Schlüssels. Ziel ist es, häufige Zugriffe auf Benutzerdaten effizienter
 * zu gestalten und unnötige Datenbankanfragen zu vermeiden.
 *
 * Besonderheiten:
 * - Erweiterung der generischen `CachingService`-Basisklasse mit Cache-Namespace `"user"`
 * - Integration des `UsersService` für Fallback-Zugriffe auf die Datenbank
 */
@Injectable()
export class UserInfoCachingService extends CachingService {
	constructor(
		@Inject(cacheConfig.KEY)
		config: ConfigType<typeof cacheConfig>,
		@Inject(CACHE_MANAGER) cacheManager: Cache,
		@Inject(forwardRef(() => UsersService))
		private readonly userService: UsersService
	) {
		super(cacheManager, "user", config.ttl);
	}

	/**
	 * Funktion: setUser
	 *
	 * Speichert einen Benutzer im Cache unter seiner ID.
	 *
	 * @param data - Benutzerobjekt
	 */
	async setUser(data: User) {
		await this.set(data.id.toString(), JSON.stringify(data));
	}

	/**
	 * Funktion: setUserByApiKey
	 *
	 * Speichert einen Benutzer im Cache unter seinem API-Key.
	 *
	 * @param data - Benutzerobjekt
	 */
	async setUserByApiKey(data: User) {
		await this.set(data.apiKey, JSON.stringify(data));
	}

	/**
	 * Funktion: getUser
	 *
	 * Holt einen Benutzer aus dem Cache (via ID) oder lädt ihn aus der DB bei Bedarf.
	 *
	 * @param id - Benutzer-ID
	 * @returns Benutzerobjekt oder undefined
	 */
	async getUser(id: number) {
		const res = await this.get(id.toString());

		if (res) {
			return JSON.parse(res);
		}

		const user = await this.userService.findOneById(id);

		if (!user) {
			return;
		}

		await this.setUser(user);
		return user;
	}

	/**
	 * Funktion: getUserByApiKey
	 *
	 * Holt einen Benutzer anhand des API-Schlüssels aus dem Cache oder aus der Datenbank.
	 *
	 * @param apiKey - API-Schlüssel des Benutzers
	 * @returns Benutzerobjekt oder undefined
	 */
	async getUserByApiKey(apiKey: string) {
		const res = await this.get(apiKey);

		if (res) {
			return JSON.parse(res);
		}

		const user = await this.userService.findOneByApiKey(apiKey);

		if (!user) {
			return;
		}

		await this.setUserByApiKey(user);
		return user;
	}

	/**
	 * Funktion: clearUser
	 *
	 * Löscht den Benutzer aus dem Cache (z. B. nach Update oder Logout).
	 *
	 * @param data - Benutzerobjekt oder DTO mit ID
	 */
	async clearUser(data: User | UserInfoDTO) {
		await this.del(data.id.toString());
	}
}
