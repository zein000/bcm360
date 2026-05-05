import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import viewEngineConfig from "src/view-engine/config/view-engine.config";
import { VIEW_ENGINE_ENVIRONMENT_VARIABLES_SCHEMA } from "src/view-engine/config/view-engine.config.schema";

import { ViewEngineService } from "./view-engine.service";

/**
 * Klasse: ViewEngineModule
 *
 * Dieses Modul kapselt die Konfiguration und Bereitstellung eines View-/Template-Rendering-Systems
 * (z.B. für E-Mail-Templates mit Handlebars, EJS etc.).
 *
 * Verwendungszweck:
 * - Dynamisches Rendern von HTML-Vorlagen mit Daten (z.B. für E-Mails, PDFs, etc.)
 * - Lädt Konfigurationswerte wie Pfade zu Templates und Layouts aus Umgebungsvariablen
 * - Exportiert den `ViewEngineService` zur Wiederverwendung in z.B. `MailService`, `TokenService`, etc.
 *
 * Bestandteile:
 * - `viewEngineConfig`: Konfigurationsfunktion für Template-Verzeichnisse & Defaults
 * - `VIEW_ENGINE_ENVIRONMENT_VARIABLES_SCHEMA`: Joi-Schema zur Validierung der `.env`-Werte
 * - `ViewEngineService`: Service zum Rendern von Templates mit Daten
 */
@Module({
	imports: [
		ConfigModule.forRoot({
			load: [viewEngineConfig],
			validationSchema: VIEW_ENGINE_ENVIRONMENT_VARIABLES_SCHEMA,
		}),
	],
	providers: [ViewEngineService],
	exports: [ViewEngineService],
})
export class ViewEngineModule {}
