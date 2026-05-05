import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { Inject, Injectable, Logger } from "@nestjs/common";
import { Cache } from "cache-manager";

/**
 * Abstrakte Klasse: CachingService
 *
 * Diese abstrakte Basisklasse stellt generische Methoden zum Arbeiten mit dem Cache bereit.
 * Sie dient als Grundlage für spezialisierte Caching-Services wie z. B. JWT-Blacklist, UserInfo-Caching etc.
 *
 * Verwendungszweck:
 * - Einfache Nutzung von Cache-Operationen (`set`, `get`, `del`) mit automatischer TTL-Verwaltung
 * - Einheitliches Key-Namensschema durch `buildKey`
 * - Fehler werden geloggt, ohne die Anwendung zu unterbrechen
 *
 * Hinweise:
 * - `ttl` (Time To Live) wird in Sekunden übergeben, aber für `cacheManager.set` in Millisekunden konvertiert
 * - Schlüssel im Cache erhalten das Format: `cacheName:key`
 */
@Injectable()
export abstract class CachingService {
	private readonly logger = new Logger(CachingService.name);

	constructor(
		@Inject(CACHE_MANAGER) private cacheManager: Cache,
		private readonly cacheName: string,
		private readonly ttl: number // TTL in Sekunden
	) {}

	/**
	 * Funktion: set
	 *
	 * Speichert Daten im Cache mit einem zusammengesetzten Schlüssel und Ablaufzeit.
	 *
	 * @param key - Einzelschlüssel für den Cache-Eintrag
	 * @param data - Zu speichernder String-Wert
	 * @returns Der gespeicherte Wert (oder undefined im Fehlerfall)
	 */
	protected async set(key: string, data: string): Promise<string> {
		try {
			await this.cacheManager.set(this.buildKey(this.cacheName, key), data, this.ttl * 1000);
		} catch (error) {
			this.logger.error(error, "Failed to save data to %s cache for %s", this.cacheName, key);
			return;
		}
		return data;
	}

	/**
	 * Funktion: get
	 *
	 * Holt einen Cache-Eintrag anhand des zusammengesetzten Schlüssels.
	 *
	 * @param key - Einzelschlüssel
	 * @returns Der gespeicherte Wert oder `undefined`, falls nicht vorhanden oder Fehler auftritt
	 */
	protected async get(key: string): Promise<string> {
		try {
			return await this.cacheManager.get(this.buildKey(this.cacheName, key));
		} catch (error) {
			this.logger.error(error, "Failed to get data from %s cache for %s", this.cacheName, key);
			return;
		}
	}

	/**
	 * Funktion: del
	 *
	 * Löscht einen Eintrag aus dem Cache.
	 *
	 * @param key - Schlüssel des zu entfernenden Eintrags
	 */
	protected async del(key: string): Promise<void> {
		try {
			await this.cacheManager.del(this.buildKey(this.cacheName, key));
		} catch (error) {
			this.logger.error(error, "Failed to delete data from %s cache for %s", this.cacheName, key);
		}
	}

	/**
	 * Hilfsfunktion: buildKey
	 *
	 * Erzeugt einen eindeutigen Caching-Key nach dem Format `prefix:key`
	 *
	 * @param name - Präfix (z. B. Cache-Name)
	 * @param uniqueKey - Benutzerdefinierter Schlüssel
	 * @returns Zusammengesetzter Schlüsselstring
	 */
	private buildKey(name: string, uniqueKey: string) {
		return `${name}:${uniqueKey}`;
	}
}
