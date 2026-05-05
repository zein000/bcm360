import { forwardRef, Module } from "@nestjs/common";
import { HttpModule } from "@nestjs/axios";

import { RetryModule } from "src/retry/retry.module";
import { ConfigurationModule } from "src/configuration/configuration.module";

import { HttpClientService } from "./http-client.service";

/**
 * Klasse: HttpClientModule
 *
 * Dieses Modul kapselt die Konfiguration und Bereitstellung des `HttpClientService`,
 * welcher für HTTP-Anfragen innerhalb der Anwendung verwendet wird.
 *
 * Ziel:
 * - Bereitstellung eines zentralen Dienstes für externe HTTP-Kommunikation
 * - Integrierte Unterstützung für Retry-Logik und Konfigurationsmanagement
 *
 * Imports:
 * - `ConfigurationModule`: Ermöglicht Zugriff auf globale Konfigurationswerte (z. B. aus Umgebungsvariablen)
 * - `HttpModule`: NestJS Modul für HTTP-Requests (basiert auf Axios), mit Timeout und Redirects vorkonfiguriert
 * - `RetryModule`: Kapselt Wiederholungslogik bei fehlgeschlagenen HTTP-Requests (z. B. Netzwerkfehler)
 *
 * Bereitgestellte Services:
 * - `HttpClientService`: Eigener Dienst, der `HttpService` erweitert und zusätzliche Funktionalität wie Retry, Logging etc. implementiert
 *
 * Exportiert:
 * - `HttpClientService`, um diesen in anderen Modulen wiederverwenden zu können
 */

@Module({
	imports: [
		ConfigurationModule,
		HttpModule.register({
			timeout: 180000, // Timeout nach 3 Minuten
			maxRedirects: 5, // Maximal 5 Weiterleitungen
		}),
		forwardRef(() => RetryModule), // Vorwärtsreferenz zur Auflösung zyklischer Abhängigkeiten
	],
	providers: [HttpClientService],
	exports: [HttpClientService],
})
export class HttpClientModule {}
