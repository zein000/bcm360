import { Injectable } from "@nestjs/common";

import User from "src/users/models/user.model";

import { ConfigurationName } from "src/enums/configuration.enum";

import { ConfigurationResponseDTO } from "./dtos/configuration-response.dto";
import Configuration from "./models/configuration.model";
import { ConfigurationRepository } from "./repositories/configuration.repository";

/**
 * Klasse: ConfigurationService
 *
 * Diese Serviceklasse enthält die Geschäftslogik für die Verwaltung von Konfigurationen im System.
 * Sie bietet Methoden zum:
 * - Abrufen von Konfigurationen
 * - Erstellen, Aktualisieren und Löschen
 * - Upsert (Erstellen oder Aktualisieren)
 * - Rückgabe in DTO-Format zur Entkopplung der internen Datenstruktur
 */
@Injectable()
export class ConfigurationService {
	constructor(private readonly configRepo: ConfigurationRepository) {}

	/**
	 * Funktion: findAll
	 *
	 * Ruft alle Konfigurationseinträge ab.
	 *
	 * @returns Liste aller Konfigurationen als DTOs
	 */
	async findAll(): Promise<ConfigurationResponseDTO[]> {
		return (await this.configRepo.findAll()).map(this.toResponse);
	}

	/**
	 * Funktion: findAllByNameInteranal
	 *
	 * Interne Methode, um alle Konfigurationen eines bestimmten Namens zurückzugeben.
	 * Wird intern ohne DTO-Mapping genutzt.
	 *
	 * @param name - Konfigurationsname
	 * @returns Liste aller Konfigurationen mit diesem Namen (nicht gefiltert auf companyId)
	 */
	async findAllByNameInteranal(name: ConfigurationName): Promise<Configuration[]> {
		return await this.configRepo.findAllByName(name);
	}

	/**
	 * Funktion: findAllByName
	 *
	 * Gibt alle Konfigurationen mit einem bestimmten Namen zurück, als DTO-Array.
	 *
	 * @param name - Konfigurationsname
	 * @returns Liste passender Konfigurationen (als DTOs)
	 */
	async findAllByName(name: ConfigurationName): Promise<ConfigurationResponseDTO[]> {
		const configs = await this.configRepo.findAllByName(name);
		return configs.map((config) => this.toResponse(config));
	}

	/**
	 * Funktion: findOneByName
	 *
	 * Sucht eine einzelne Konfiguration anhand des Namens (ohne DTO-Konvertierung).
	 *
	 * @param name - Name der Konfiguration
	 * @returns Die Konfiguration als Datenbankmodell
	 */
	async findOneByName(name: ConfigurationName): Promise<Configuration> {
		return this.configRepo.findByName(name);
	}

	/**
	 * Funktion: find
	 *
	 * Sucht eine Konfiguration anhand Name + optionaler companyId.
	 *
	 * @param name - Name der Konfiguration
	 * @param companyId - Optional: Firmenspezifische Einschränkung
	 * @returns DTO der gefundenen Konfiguration
	 */
	async find(name: string, companyId?: number): Promise<ConfigurationResponseDTO> {
		return this.toResponse(await this.configRepo.findByName(name, companyId));
	}

	/**
	 * Funktion: create
	 *
	 * Erstellt eine neue Konfiguration.
	 *
	 * @param user - Der Benutzer, der die Konfiguration erstellt (für updatedBy)
	 * @param name - Name der Konfiguration
	 * @param value - Wert der Konfiguration
	 * @returns Die erstellte Konfiguration als DTO
	 */
	async create(
		user: User,
		name: ConfigurationName,
		value: string
	): Promise<ConfigurationResponseDTO> {
		return this.toResponse(
			await this.configRepo.save(this.configRepo.create({ name, value, updatedBy: user.id }))
		);
	}

	/**
	 * Funktion: update
	 *
	 * Aktualisiert eine bestehende Konfiguration.
	 *
	 * @param user - Der Benutzer, der die Änderung vornimmt
	 * @param name - Name der zu aktualisierenden Konfiguration
	 * @param value - Neuer Wert
	 * @returns Die aktualisierte Konfiguration als DTO
	 */
	async update(
		user: User,
		name: ConfigurationName,
		value: string
	): Promise<ConfigurationResponseDTO> {
		const config = await this.configRepo.findByName(name, user.companyId);
		return this.toResponse(await this.configRepo.update(config, { value, updatedBy: user.id }));
	}

	/**
	 * Funktion: upsert
	 *
	 * Erstellt oder aktualisiert eine Konfiguration.
	 *
	 * @param user - Der Benutzer, der die Aktion durchführt
	 * @param name - Name der Konfiguration
	 * @param value - Neuer Wert
	 * @returns Die erstellte oder aktualisierte Konfiguration als DTO
	 */
	async upsert(
		user: User,
		name: ConfigurationName,
		value: string
	): Promise<ConfigurationResponseDTO> {
		return this.toResponse((await this.configRepo.upsert({ name, value, updatedBy: user.id }))[0]);
	}

	/**
	 * Funktion: delete
	 *
	 * Löscht eine Konfiguration anhand des Namens.
	 *
	 * @param user - Benutzer, der die Löschung durchführt
	 * @param name - Name der Konfiguration
	 */
	async delete(user: User, name: ConfigurationName): Promise<void> {
		await this.configRepo.deleteByName(user.id, name);
	}

	/**
	 * Funktion: toResponse
	 *
	 * Hilfsfunktion zur Konvertierung eines Konfigurationsmodells in ein DTO.
	 *
	 * @param config - Das interne Sequelize-Modell
	 * @returns DTO mit serialisierbaren Feldern
	 */
	private toResponse(config: Configuration): ConfigurationResponseDTO {
		const data = config.dataValues ? config.toJSON() : config;
		return {
			name: data.name,
			value: data.value,
			companyId: data.companyId,
		};
	}
}
