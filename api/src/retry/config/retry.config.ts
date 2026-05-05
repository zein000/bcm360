import { registerAs } from "@nestjs/config";

/**
 * Konfiguration: retry
 *
 * Diese Konfiguration enthält die Redis-Verbindungsdetails für die Retry-Warteschlange.
 * Sie wird verwendet, um die Verbindung zu Redis zu konfigurieren, das für die Verarbeitung
 * von Wiederholungsjobs (über BullMQ) zuständig ist.
 *
 * Felder:
 * - host: Redis-Host (z.B. `localhost` oder eine externe Redis-Instanz)
 * - port: Redis-Port (typischerweise `6379` für Redis)
 * - password: Optionales Redis-Passwort, falls gesetzt (sonst leer)
 *
 * Diese Konfiguration wird durch das `ConfigModule` geladen.
 */
export default registerAs("retry", () => ({
	host: process.env.REDIS_HOST,
	port: Number(process.env.REDIS_PORT),
	// username: process.env.REDIS_USERNAME, // Optionaler Redis-Benutzername
	password: process.env.REDIS_PASSWORD ?? "",
}));
