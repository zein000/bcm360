import { Inject, Injectable } from "@nestjs/common";
import { ConfigType } from "@nestjs/config";
import { SequelizeModuleOptions, SequelizeOptionsFactory } from "@nestjs/sequelize";

import sequelizeConfig from "./config/database.config";

/**
 * Klasse: SequelizeConfigService
 *
 * Diese Klasse implementiert die `SequelizeOptionsFactory`-Schnittstelle und wird verwendet,
 * um dynamisch die Konfiguration für die Sequelize-Datenbankverbindung bereitzustellen.
 *
 * Die Konfiguration wird aus einer zentralen `sequelizeConfig`-Datei (via NestJS ConfigModule) geladen.
 */
@Injectable()
export class SequelizeConfigService implements SequelizeOptionsFactory {
	constructor(
		@Inject(sequelizeConfig.KEY)
		private readonly config: ConfigType<typeof sequelizeConfig>
	) {}

	/**
	 * Funktion: createSequelizeOptions
	 *
	 * Erstellt die Konfigurationsoptionen für Sequelize (MySQL).
	 * Beinhaltet Host, Port, Authentifizierung, Datenbankname, Modellverzeichnis und Pool-Einstellungen.
	 *
	 * @returns Ein `SequelizeModuleOptions`-Objekt zur Initialisierung des Sequelize-Moduls
	 */
	createSequelizeOptions(): SequelizeModuleOptions {
		return {
			dialect: "mysql",
			host: this.config.host,
			port: this.config.port,
			username: this.config.username,
			password: this.config.password,
			database: this.config.database,

			// Dynamische Modelldateien werden über den Pfad geladen
			models: [`${__dirname}/../**/*.model{.ts,.js}`],

			// Keine automatische Synchronisation (Produktionsmodus)
			synchronize: false,
			sync: { alter: false },
			autoLoadModels: false,

			// Kein Logging (kann in dev aktiviert werden)
			logging: false,

			// Verbindungspool für Performance
			pool: {
				max: 5,       // maximale Anzahl gleichzeitiger Verbindungen
				min: 0,       // minimale Anzahl
				acquire: 30000, // maximale Wartezeit beim Erstellen einer Verbindung
				idle: 10000,  // Zeit bis zum Freigeben inaktiver Verbindung
			},
		};
	}
}
