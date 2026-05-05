import { Injectable, InternalServerErrorException, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Op } from "sequelize";

import { Errors } from "src/enums/errors.enum";
import { ERole } from "src/enums/role.enum";

import Permission from "../../permissions/models/permission.model";
import Role from "../models/role.model";

/**
 * Klasse: RoleRepository
 *
 * Dieses Repository kapselt alle direkten Datenbankzugriffe für das `Role`-Modell.
 * Es bietet Methoden zum Suchen, Erstellen, Aktualisieren und Löschen von Rollen
 * inklusive der zugehörigen Berechtigungen.
 *
 * Verwendungszweck:
 * - Wird im `RolesService` verwendet, um Datenbankoperationen getrennt von der Geschäftslogik auszuführen
 * - Automatisches Einbinden von Berechtigungen durch Sequelize `include`
 */
@Injectable()
export class RoleRepository {
	private readonly logger = new Logger(RoleRepository.name);

	constructor(
		@InjectModel(Role)
		private model: typeof Role
	) {}

	/**
	 * Gibt alle Rollen und ihre Gesamtanzahl mit Pagination zurück,
	 * gefiltert nach erlaubten Rollentypen.
	 */
	async findAllAndCount(
		limit: number,
		skip: number,
		types: ERole[]
	): Promise<{ rows: Role[]; count: number }> {
		try {
			const { rows, count } = await this.model.findAndCountAll({
				where: {
					code: { [Op.in]: types },
				},
				limit,
				offset: skip,
			});

			const data = await this.model.findAll({
				where: {
					id: { [Op.in]: rows.map((r) => r.id) },
				},
				include: [Permission],
			});

			return { rows: data, count };
		} catch (error) {
			this.logger.error(error, "Failed to find roles");
			throw new InternalServerErrorException(Errors.INTERNAL_ERROR);
		}
	}

	/**
	 * Findet eine Rolle anhand ihrer ID inkl. zugehöriger Berechtigungen.
	 */
	async findById(id: number): Promise<Role> {
		try {
			return await this.model.findOne({
				where: { id },
				include: { model: Permission },
			});
		} catch (error) {
			this.logger.error(error, "Failed to find role by Id %s", id);
			throw new InternalServerErrorException(Errors.INTERNAL_ERROR);
		}
	}

	/**
	 * Findet eine Rolle anhand ihres Codes inkl. Berechtigungen.
	 */
	async findOneByCode(code: string): Promise<Role> {
		try {
			return await this.model.findOne({
				where: { code },
				include: { model: Permission },
			});
		} catch (error) {
			this.logger.error(error, "Failed to find role by code %s", code);
			throw new InternalServerErrorException(Errors.INTERNAL_ERROR);
		}
	}

	/**
	 * Findet mehrere Rollen anhand einer Liste von Codes inkl. Berechtigungen.
	 */
	async findManyByCode(codes: string[]): Promise<Role[]> {
		try {
			return await this.model.findAll({
				where: {
					code: codes,
				},
				include: { model: Permission },
			});
		} catch (error) {
			this.logger.error(error, "Failed to find roles by codes %s", codes.join(", "));
			throw new InternalServerErrorException(Errors.INTERNAL_ERROR);
		}
	}

	/**
	 * Erstellt eine neue Rolleninstanz im Speicher (noch nicht gespeichert in der DB).
	 */
	build(role: Partial<Role>): Role {
		try {
			return this.model.build(role, { include: Permission });
		} catch (error) {
			this.logger.error(error, "Failed to build role");
			throw new InternalServerErrorException(Errors.INTERNAL_ERROR);
		}
	}

	/**
	 * Aktualisiert eine Rolle anhand der ID.
	 */
	async update(id: number, role: Partial<Role>): Promise<[affectedCount: number]> {
		try {
			return await this.model.update(role, { where: { id } });
		} catch (error) {
			this.logger.error(error, "Failed to update role by Id %s", id);
			throw new InternalServerErrorException(Errors.INTERNAL_ERROR);
		}
	}

	/**
	 * Speichert eine Rolle in der Datenbank.
	 */
	async save(role: Role): Promise<Role> {
		try {
			return await role.save();
		} catch (error) {
			this.logger.error(error, "Failed to save role");
			throw new InternalServerErrorException(Errors.INTERNAL_ERROR);
		}
	}

	/**
	 * Löscht eine Rolle aus der Datenbank.
	 */
	async delete(role: Role): Promise<void> {
		try {
			await role.destroy();
		} catch (error) {
			this.logger.error(error, "Failed to delete role with Id %s", role.id);
			throw new InternalServerErrorException(Errors.INTERNAL_ERROR);
		}
	}
}
