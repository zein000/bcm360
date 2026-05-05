import { Injectable, InternalServerErrorException, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";

import { ConfigurationName } from "src/enums/configuration.enum";

import { Errors } from "../../enums/errors.enum";
import Configuration from "../models/configuration.model";

/**
 * Klasse: ConfigurationRepository
 *
 * Dieses Repository ist die Datenzugriffsschicht für das Configuration-Modell.
 * Es kapselt alle direkten Zugriffe auf die Datenbank und behandelt Fehler zentral.
 * Nutzt Sequelize als ORM.
 */
@Injectable()
export class ConfigurationRepository {
	private readonly logger = new Logger(ConfigurationRepository.name);

	constructor(
		@InjectModel(Configuration)
		private model: typeof Configuration
	) {}

	/**
	 * Funktion: findAll
	 *
	 * Gibt alle Konfigurationseinträge zurück (inkl. evtl. firmenübergreifender Konfigurationen).
	 *
	 * @returns Liste aller Konfigurationen
	 */
	async findAll(): Promise<Configuration[]> {
		try {
			return await this.model.findAll();
		} catch (error) {
			this.logger.error(error, "Failed to find configurations");
			throw new InternalServerErrorException(Errors.INTERNAL_ERROR);
		}
	}

	/**
	 * Funktion: findAllByName
	 *
	 * Findet alle Konfigurationen mit einem bestimmten Namen (nicht gelöscht).
	 *
	 * @param name - Der gesuchte Konfigurationsname
	 * @returns Array von Konfigurationen mit diesem Namen
	 */
	async findAllByName(name: ConfigurationName): Promise<Configuration[]> {
		try {
			return await this.model.findAll({
				where: { name, deletedAt: null },
			});
		} catch (error) {
			this.logger.error(error, "Failed to find configurations");
			throw new InternalServerErrorException(Errors.INTERNAL_ERROR);
		}
	}

	/**
	 * Funktion: findByName
	 *
	 * Sucht eine einzelne Konfiguration anhand ihres Namens (optional nach companyId gefiltert).
	 *
	 * @param name - Der Konfigurationsname
	 * @param companyId - Optional: Filter auf Firma
	 * @returns Gefundene Konfiguration oder `null`
	 */
	async findByName(name: string, companyId?: number): Promise<Configuration> {
		try {
			const where = companyId ? { name, companyId } : { name };

			return await this.model.findOne({ where });
		} catch (error) {
			this.logger.error(error, "Failed to find configuration by name %s", name);
			throw new InternalServerErrorException(Errors.INTERNAL_ERROR);
		}
	}

	/**
	 * Funktion: save
	 *
	 * Persistiert ein Configuration-Objekt in der Datenbank.
	 *
	 * @param config - Die zu speichernde Instanz
	 * @returns Gespeicherte Konfiguration
	 */
	async save(config: Configuration): Promise<Configuration> {
		try {
			return await config.save();
		} catch (error) {
			this.logger.error(error, "Failed to save configuration", config.id);
			throw new InternalServerErrorException(Errors.INTERNAL_ERROR);
		}
	}

	/**
	 * Funktion: updateByName
	 *
	 * Aktualisiert Konfigurationen direkt über den Namen.
	 *
	 * @param name - Konfigurationsname
	 * @param data - Neue Felder (z. B. `value`, `updatedBy`)
	 * @returns Anzahl betroffener Einträge (meist 1)
	 */
	async updateByName(name: string, data: Partial<Configuration>): Promise<[affectedCount: number]> {
		try {
			return await this.model.update(data, { where: { name }, individualHooks: true });
		} catch (error) {
			this.logger.error(error, "Failed to update config by name %s", name);
			throw new InternalServerErrorException(Errors.INTERNAL_ERROR);
		}
	}

	/**
	 * Funktion: update
	 *
	 * Aktualisiert eine bereits geladene Konfiguration (Instanzbasiert).
	 *
	 * @param config - Die bestehende Konfiguration
	 * @param data - Zu aktualisierende Felder
	 * @returns Die aktualisierte Konfiguration
	 */
	async update(config: Configuration, data: Partial<Configuration>): Promise<Configuration> {
		try {
			return await config.update(data);
		} catch (error) {
			this.logger.error(error, "Failed to update config by name %s", config.name);
			throw new InternalServerErrorException(Errors.INTERNAL_ERROR);
		}
	}

	/**
	 * Funktion: upsert
	 *
	 * Erstellt eine neue Konfiguration oder aktualisiert eine bestehende (je nach Zustand).
	 *
	 * @param data - Die Felder, die gespeichert werden sollen
	 * @returns Tupel: [Konfiguration, true falls neu erstellt]
	 */
	async upsert(data: Partial<Configuration>): Promise<[Configuration, boolean]> {
		try {
			return await this.model.upsert(data);
		} catch (error) {
			this.logger.error(error, "Failed to upsert config by name %s", data.name);
			throw new InternalServerErrorException(Errors.INTERNAL_ERROR);
		}
	}

	/**
	 * Funktion: deleteByName
	 *
	 * Löscht eine Konfiguration anhand ihres Namens (setzt Deleted-At, Soft-Delete).
	 * Zusätzlich wird das Feld `updatedBy` gesetzt.
	 *
	 * @param updatedBy - ID des Benutzers, der löscht
	 * @param name - Name der zu löschenden Konfiguration
	 */
	async deleteByName(updatedBy: number, name: string): Promise<void> {
		try {
			const config = await this.model.findOne({ where: { name } });
			config.updatedBy = updatedBy;
			await config.destroy();
		} catch (error) {
			this.logger.error(error, "Failed to delete config by name %s", name);
			throw new InternalServerErrorException(Errors.INTERNAL_ERROR);
		}
	}

	/**
	 * Funktion: create
	 *
	 * Erstellt eine neue `Configuration`-Instanz (nicht gespeichert).
	 * Nützlich für `save()` oder `upsert()`-Operationen.
	 *
	 * @param config - Initiale Felder der Konfiguration
	 * @returns Eine neue, noch nicht persistierte Instanz
	 */
	create(config: Partial<Configuration>): Configuration {
		try {
			return this.model.build(config);
		} catch (error) {
			this.logger.error(error, "Failed to build config");
			throw new InternalServerErrorException(Errors.INTERNAL_ERROR);
		}
	}
}
