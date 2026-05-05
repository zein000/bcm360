import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";

import { ConfigurationController } from "./configuration.controller";

import { ConfigurationService } from "./configuration.service";
import ConfigurationHistory from "./models/configuration-history.model";
import Configuration from "./models/configuration.model";
import { ConfigurationRepository } from "./repositories/configuration.repository";

/**
 * Modul: ConfigurationModule
 *
 * Dieses Modul kapselt die gesamte Funktionalität zur Verwaltung von Konfigurationen.
 * Es stellt Controller, Services und Datenbankmodelle für Konfigurationen bereit.
 *
 * Enthalten:
 * - Controller: REST-API-Endpunkte zum Abrufen, Erstellen, Bearbeiten und Löschen von Konfigurationen
 * - Service: Geschäftslogik zur Verwaltung der Konfigurationen
 * - Repository: Datenzugriffsschicht (Sequelize)
 * - Models: Datenbankmodelle für Konfiguration und Historie
 *
 * Exportiert:
 * - ConfigurationService für die Wiederverwendung in anderen Modulen
 */
@Module({
	imports: [
		// Bindet die Sequelize-Modelle für Konfiguration und deren Historie ein
		SequelizeModule.forFeature([Configuration, ConfigurationHistory]),
	],
	controllers: [
		// Stellt REST-Endpunkte zur Verfügung
		ConfigurationController,
	],
	providers: [
		// Kernlogik und Datenzugriff
		ConfigurationService,
		ConfigurationRepository,
	],
	exports: [
		// Macht den Service in anderen Modulen verfügbar
		ConfigurationService,
	],
})
export class ConfigurationModule {}
