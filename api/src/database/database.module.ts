import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { SequelizeModule } from "@nestjs/sequelize";

import sequelizeConfig from "./config/database.config";
import { SequelizeConfigService } from "./sequelize-config.service";

/**
 * Modul: DatabaseModule
 *
 * Dieses Modul konfiguriert die Datenbankverbindung für die gesamte Anwendung.
 * Es nutzt `SequelizeModule.forRootAsync()` zur dynamischen (asynchronen) Initialisierung
 * mithilfe der `SequelizeConfigService`-Klasse.
 *
 * Die Konfiguration wird über das zentrale `ConfigModule` geladen
 * (aus der Datei `database.config.ts` via `sequelizeConfig`).
 */
@Module({
	imports: [
		SequelizeModule.forRootAsync({
			// Lädt das Konfigurationsmodul mit der Datenbankkonfiguration
			imports: [
				ConfigModule.forRoot({
					load: [sequelizeConfig], // lädt die Konfiguration aus database.config.ts
				}),
			],
			// Nutzt den Service, um die Konfigurationswerte bereitzustellen
			useClass: SequelizeConfigService,
		}),
	],
})
export class DatabaseModule {}
