import { registerAs } from "@nestjs/config";

/**
 * Konfiguration: database
 *
 * Dieses Konfigurationsobjekt wird mit dem NestJS `ConfigModule` registriert
 * und liefert die Datenbankverbindungsinformationen aus Umgebungsvariablen.
 *
 * Durch `registerAs("database", ...)` wird die Konfiguration unter dem Schlüssel `database` verfügbar gemacht.
 *
 * Unterstützt sowohl benutzerdefinierte als auch alternative Umgebungsvariablennamen als Fallback.
 *
 * Verwendete Umgebungsvariablen:
 * - DB_HOST oder host
 * - DB_PORT oder port
 * - DB_USER oder user
 * - DB_PASSWORD oder password
 * - DB_DATABASE oder name
 *
 * Beispielnutzung:
 * ```ts
 * import { ConfigService } from '@nestjs/config';
 * const dbHost = configService.get('database.host');
 * ```
 */
export default registerAs("database", () => ({
	host: process.env.DB_HOST ?? process.env.host,
	port: Number(process.env.DB_PORT ?? process.env.port),
	username: process.env.DB_USER ?? process.env.user,
	password: process.env.DB_PASSWORD ?? process.env.password,
	database: process.env.DB_DATABASE ?? process.env.name,
}));
