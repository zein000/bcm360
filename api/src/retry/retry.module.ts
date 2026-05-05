import { BullModule } from "@nestjs/bullmq";
import { forwardRef, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { HttpClientModule } from "src/http-client/http-client.module";
import retryConfig from "src/retry/config/retry.config";
import { RETRY_CONFIG_ENVIRONMENT_VARIABLES_SCHEMA } from "src/retry/config/retry.config.schema";

import { RETRY_QUEUE_NAME } from "./constants";
import { RetryProcessor } from "./retry.processor";

/**
 * Modul: RetryModule
 *
 * Dieses Modul verwaltet die Wiederholungslogik für fehlgeschlagene HTTP-Anfragen.
 * Es nutzt BullMQ zur Verwaltung der Wiederholungswarteschlange und verarbeitet Jobs, die fehlschlagen.
 *
 * Komponenten:
 * - `RetryProcessor`: Prozessor, der die eigentliche Logik zur Verarbeitung und Wiederholung von Jobs enthält.
 * - `RetryQueue`: BullMQ-Warteschlange, in der fehlgeschlagene Jobs gespeichert werden.
 *
 * Konfiguration:
 * - Verbindungsdetails für Redis werden aus den Umgebungsvariablen und `retryConfig` geladen.
 * - Job-Warteschlangenoptionen wie `removeOnComplete` und `backoff` für exponentielle Backoff-Zeiten.
 */
const config = retryConfig();

const RetryQueue = BullModule.registerQueue({
	name: RETRY_QUEUE_NAME,
	settings: {},
	defaultJobOptions: {
		removeOnComplete: true, // Job wird nach der erfolgreichen Bearbeitung entfernt
		backoff: {
			type: "exponential", // Exponentielles Backoff für wiederholte Versuche
			delay: 3000, // Verzögerung von 3 Sekunden vor dem nächsten Versuch
		},
	},
});

@Module({
	imports: [
		ConfigModule.forRoot({
			load: [retryConfig], // Lädt die Konfiguration für Retry-Mechanismen
			validationSchema: RETRY_CONFIG_ENVIRONMENT_VARIABLES_SCHEMA, // Validiert Umgebungsvariablen
		}),
		BullModule.forRoot({
			connection: {
				host: config?.host || process.env.REDIS_HOST, // Redis-Host
				port: config.port || +process.env.REDIS_PORT, // Redis-Port
				// username: config.username || process.env.REDIS_USERNAME, // Optional: Redis-Benutzername
				password: config.password || process.env.REDIS_PASSWORD, // Redis-Passwort
			},
		}),
		RetryQueue, // Die definierte Retry-Warteschlange
		forwardRef(() => HttpClientModule), // Abhängigkeit vom HTTP-Client-Modul
	],
	exports: [RetryQueue], // Exponiert die Retry-Warteschlange
	providers: [RetryProcessor], // Prozessor zur Verarbeitung der Jobs
})
export class RetryModule {}
