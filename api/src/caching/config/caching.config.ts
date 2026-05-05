import { CacheModuleOptions } from "@nestjs/cache-manager";
import { registerAs } from "@nestjs/config";

/**
 * Konfiguration: cache
 *
 * Diese Konfiguration registriert Cache-Einstellungen unter dem Namespace `"cache"`.
 * Sie wird im NestJS-Kontext für das CacheModule verwendet, um Standardwerte und
 * Umgebungsvariablen für TTL, Max-Items und Redis-Verbindung bereitzustellen.
 *
 * Verwendungszweck:
 * - Globale Steuerung von Cache-Verhalten (z. B. für User-, Szenario- oder JWT-Caches)
 * - Unterstützung für Umstellung von In-Memory auf Redis durch einfaches Entkommentieren
 *
 * Felder:
 * - ttl: Standard-Zeitdauer (in Sekunden) für Cache-Einträge (default: 5 Minuten)
 * - scenarioTtl: TTL speziell für Szenarien (default: 24 Stunden)
 * - max: Maximale Anzahl von Einträgen im Cache (default: 500)
 *
 * Redis-Konfiguration (auskommentiert):
 * - host, port, username, password: können aktiviert werden, um Redis als Store zu verwenden
 */
export default registerAs(
	"cache",
	(): CacheModuleOptions => ({
		ttl: Number(process.env.CACHE_TTL) || 5 * 60, // Standard-TTL: 5 Minuten
		scenarioTtl: Number(process.env.CACHE_SCENARIO_TTL) || 24 * 60 * 60, // Szenario-TTL: 1 Tag
		max: Number(process.env.CACHE_MAX) || 500,

		// Uncomment if you need redis cache
		// Redis Store-specific configuration:
		// host: process.env.REDIS_HOST,
		// port: process.env.REDIS_PORT,
		// username: process.env.REDIS_USERNAME,
		// password: process.env.REDIS_PASSWORD,
	})
);
