import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { ViewEngineModule } from "src/view-engine/view-engine.module";

import emailConfig from "./config/mail.config";
import { MailService } from "./mail.service";

/**
 * Klasse: MailModule
 *
 * Dieses Modul stellt alle Funktionalitäten rund um das Versenden von E-Mails bereit.
 * Es lädt die E-Mail-Konfiguration, bindet eine Template-Engine ein und exportiert
 * den zentralen `MailService` zur Nutzung in anderen Modulen.
 *
 * Verwendungszweck:
 * - Ermöglicht das Senden von E-Mails mit dynamischen Inhalten
 * - Verwendet Konfigurationswerte aus `.env` über `mail.config.ts`
 * - Nutzt `ViewEngineModule`, um E-Mail-Templates mit z. B. Handlebars zu rendern
 *
 * Enthaltene Bestandteile:
 * - `ConfigModule`: Lädt E-Mail-Konfiguration aus externer Datei (`mail.config.ts`)
 * - `ViewEngineModule`: Ermöglicht das Rendern von HTML-Templates für E-Mails
 * - `MailService`: Bietet Methoden zum Versand von E-Mails (z. B. mit Bestätigungslinks, OTPs etc.)
 *
 * Exporte:
 * - `MailService`: Wird exportiert, damit andere Module diesen Dienst nutzen können
 */
@Module({
	imports: [
		ConfigModule.forRoot({
			load: [emailConfig],
		}),
		ViewEngineModule,
	],
	providers: [MailService],
	exports: [MailService],
})
export class MailModule {}
