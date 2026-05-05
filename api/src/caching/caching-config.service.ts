import { Inject, Injectable } from "@nestjs/common";
import { ConfigType } from "@nestjs/config";

// Uncomment and install if you need redis cache
// import { redisStore } from "cache-manager-redis-store";

import { CacheModuleOptions, CacheOptionsFactory } from "@nestjs/cache-manager";

import cacheConfig from "./config/caching.config";

/**
 * Klasse: CachingConfigService
 *
 * Diese Service-Klasse stellt Konfigurationsoptionen für das `CacheModule` bereit.
 * Sie implementiert das `CacheOptionsFactory`-Interface, sodass NestJS das Cache-Verhalten
 * zur Laufzeit dynamisch konfigurieren kann (z. B. mit Umgebungsvariablen).
 *
 * Verwendungszweck:
 * - Zentralisierte Konfiguration des Caching-Mechanismus
 * - Unterstützt In-Memory-Cache (Standard) sowie Redis (auskommentiert)
 *
 * Hinweis:
 * - Die Redis-Konfiguration ist vorbereitet, aber aktuell deaktiviert.
 *   Sie kann durch Entfernen der Kommentare und Installation von `cache-manager-redis-store` aktiviert werden.
 */
@Injectable()
export class CachingConfigService implements CacheOptionsFactory {
	constructor(
		@Inject(cacheConfig.KEY)
		private readonly config: ConfigType<typeof cacheConfig>
	) {}

	/**
	 * Funktion: createCacheOptions
	 *
	 * Gibt die Konfiguration für das `CacheModule` zurück.
	 * Aktuell wird nur ein In-Memory-Cache mit `max`-Einträgen verwendet.
	 *
	 * @returns CacheModuleOptions für die Registrierung des CacheModules
	 */
	async createCacheOptions(): Promise<CacheModuleOptions> {
		return {
			max: this.config.max,
			// Uncomment if you need redis cache
			// store: {
			// 	create: () =>
			// 		redisStore({
			// 			socket: {
			// 				host: this.config.host,
			// 				port: this.config.port,
			// 			},
			// 			ttl: this.config.ttl,
			// 		}) as unknown as CacheStore,
			// },
		};
	}
}
