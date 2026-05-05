import { Injectable, InternalServerErrorException, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Op } from "sequelize";

import { Errors } from "src/enums/errors.enum";

import Role from "../../roles/models/role.model";
import Permission from "../models/permission.model";

/**
 * Klasse: PermissionRepository
 *
 * Dieses Repository stellt den direkten Datenbankzugriff auf das `Permission`-Modell bereit.
 * Es enthält Methoden zum Suchen, Aktualisieren und Löschen von Berechtigungen.
 *
 * Besonderheiten:
 * - Alle Methoden sind mit Fehlerbehandlung und Logging ausgestattet
 * - Die meisten Abfragen inkludieren zugehörige Rollen (`Role`)
 */
@Injectable()
export class PermissionRepository {
	private readonly logger = new Logger(PermissionRepository.name);

	constructor(
		@InjectModel(Permission)
		private model: typeof Permission
	) {}

	/**
	 * Funktion: findAllAndCount
	 *
	 * Holt alle Berechtigungen inklusive zugehöriger Rollen mit Pagination.
	 *
	 * @param limit - Anzahl der Ergebnisse pro Seite
	 * @param skip - Offset für Pagination
	 * @returns Liste von Berechtigungen sowie Gesamtanzahl
	 */
	async findAllAndCount(
		limit: number,
		skip: number
	): Promise<{
		rows: Permission[];
		count: number;
	}> {
		try {
			const { rows, count } = await this.model.findAndCountAll();

			const data = await this.model.findAll({
				where: {
					id: { [Op.in]: rows.map((r) => r.id) },
				},
				include: [Role],
				limit,
				offset: skip,
			});

			return { rows: data, count };
		} catch (error) {
			this.logger.error(error, "Failed to find permissions");
			throw new InternalServerErrorException(Errors.INTERNAL_ERROR);
		}
	}

	/**
	 * Funktion: findById
	 *
	 * Sucht eine Berechtigung anhand der ID.
	 *
	 * @param id - ID der Berechtigung
	 * @returns Gefundene Berechtigung oder null
	 */
	async findById(id: number): Promise<Permission> {
		try {
			return await this.model.findOne({
				where: { id },
				include: [Role],
			});
		} catch (error) {
			this.logger.error(error, "Failed to find permission by Id $id", id);
			throw new InternalServerErrorException(Errors.INTERNAL_ERROR);
		}
	}

	/**
	 * Funktion: findByIds
	 *
	 * Sucht mehrere Berechtigungen anhand ihrer IDs.
	 *
	 * @param ids - Array von Berechtigungs-IDs
	 * @returns Liste der gefundenen Berechtigungen
	 */
	async findByIds(ids: number[]): Promise<Permission[]> {
		try {
			return await this.model.findAll({
				where: {
					id: { [Op.in]: ids },
				},
				include: [Role],
			});
		} catch (error) {
			this.logger.error(error, "Failed to find permission by Ids %s", ids);
			throw new InternalServerErrorException(Errors.INTERNAL_ERROR);
		}
	}

	/**
	 * Funktion: findByCodes
	 *
	 * Sucht Berechtigungen anhand ihrer Codes.
	 *
	 * @param codes - Array von Berechtigungscodes
	 * @returns Liste der gefundenen Berechtigungen
	 */
	async findByCodes(codes: string[]): Promise<Permission[]> {
		try {
			return await this.model.findAll({
				where: {
					code: { [Op.in]: codes },
				},
				include: [Role],
			});
		} catch (error) {
			this.logger.error(error, "Failed to find permission by codes %s", codes);
			throw new InternalServerErrorException(Errors.INTERNAL_ERROR);
		}
	}

	/**
	 * Funktion: updateById
	 *
	 * Aktualisiert eine Berechtigung anhand der ID.
	 *
	 * @param id - ID der zu aktualisierenden Berechtigung
	 * @param data - Neue Daten
	 * @returns Anzahl der betroffenen Datensätze
	 */
	async updateById(id: number, data: Partial<Permission>): Promise<[affectedCount: number]> {
		try {
			return await this.model.update(data, { where: { id } });
		} catch (error) {
			this.logger.error(error, "Failed to update permission by Id %s", id);
			throw new InternalServerErrorException(Errors.INTERNAL_ERROR);
		}
	}

	/**
	 * Funktion: deleteById
	 *
	 * Löscht eine Berechtigung anhand der ID.
	 *
	 * @param id - ID der zu löschenden Berechtigung
	 * @returns Anzahl der gelöschten Einträge
	 */
	async deleteById(id: number): Promise<number> {
		try {
			return await this.model.destroy({ where: { id } });
		} catch (error) {
			this.logger.error(error, "Failed to delete permission by Id %s", id);
			throw new InternalServerErrorException(Errors.INTERNAL_ERROR);
		}
	}
}
