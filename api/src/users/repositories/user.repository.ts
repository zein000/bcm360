import {
	BadRequestException,
	Injectable,
	InternalServerErrorException,
	Logger,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Includeable, Op, Sequelize } from "sequelize";

import { UserSearchField } from "src/enums/user-search-field.enum";
import { Errors } from "src/enums/errors.enum";

import Company from "src/company/models/company.model";
import Role from "src/roles/models/role.model";
import Permission from "src/permissions/models/permission.model";
import Token from "src/tokens/models/token.model";
import { ETokenPurpose } from "src/tokens/enums/token-purpose.enum";
import User from "../models/user.model";

/**
 * Repository: UserRepository
 *
 * Verantwortlich für alle Benutzer-bezogenen Datenbankoperationen.
 * Unterstützt:
 * - Suchen nach Email, ID, API-Key (inkl. zugehöriger Firmen-, Rollen-, Rechte-Infos)
 * - Filter- und Sortierlogik für Admin-Panels
 * - Benutzer speichern, aktualisieren, löschen
 * - Rollen setzen
 */
@Injectable()
export class UserRepository {
	private readonly logger = new Logger(UserRepository.name);

	/** Token-Include-Konfiguration für Einladungszwecke */
	private readonly eagerLoadToken: Includeable = {
		model: Token,
		where: { purpose: ETokenPurpose.INVITATION },
		order: [["createdAt", "DESC"]],
		limit: 1,
		required: false,
	};

	constructor(
		@InjectModel(User)
		private model: typeof User,
		@InjectModel(Role)
		private roleModel: typeof Role
	) {}

	/**
	 * Funktion: findOneByEmail
	 *
	 * Sucht Benutzer anhand E-Mail. Optional mit gelöschten (paranoid = false).
	 */
	async findOneByEmail(email: string, includeDeleted = false): Promise<User> {
		try {
			return await this.model.findOne({
				where: { email },
				paranoid: !includeDeleted,
				include: [Company, this.eagerLoadToken],
			});
		} catch (error) {
			this.logger.error(error, `Failed to find user by email ${email}`);
			throw new InternalServerErrorException(Errors.INTERNAL_ERROR);
		}
	}

	/**
	 * Funktion: findAllAndCount
	 *
	 * Liefert paginierte Benutzerliste mit optionaler Filter-, Such- und Sortierfunktion.
	 * Unterstützt Filter auf Rolle, Name, E-Mail etc.
	 */
	async findAllAndCount(
		limit: number,
		skip: number,
		fieldName?: string,
		value?: string,
		companyId?: number,
		filters?: Record<string, string | string[]>,
		sortBy?: string,
		sortOrder?: "ASC" | "DESC"
	): Promise<{ rows: User[]; count: number }> {
		try {
			let where: any = {};
			let include: any[] = [];
			let order: any[] = [];

			// Freitextsuche
			if (fieldName && value) {
				switch (fieldName) {
					case UserSearchField.NAME:
						where = Sequelize.literal(this.buildMatchQuery(value));
						break;
					case UserSearchField.EMAIL:
						where[fieldName] = { [Op.like]: `%${value}%` };
						break;
				}
			}

			// Filter-Handling (z. B. Rolle, Name, Status)
			if (filters) {
				Object.entries(filters).forEach(([key, value]) => {
					switch (key) {
						case UserSearchField.NAME:
							if (!Array.isArray(value)) {
								where = Sequelize.literal(this.buildMatchQuery(value));
							}
							break;
						case UserSearchField.ROLE:
							if (value) {
								include.push({
									model: Role,
									where: { code: value },
									attributes: [],
								});
							}
							break;
						default:
							if (key in User.getAttributes()) {
								where[key] = Array.isArray(value)
									? { [Op.in]: value }
									: { [Op.like]: `%${value}%` };
							}
					}
				});
			}

			// Sortierung
			if (sortBy && sortOrder) {
				if (sortBy in User.getAttributes()) {
					order.push([sortBy, sortOrder]);
				} else if (sortBy === "name") {
					order.push([Sequelize.literal("CONCAT(firstName, ' ', lastName)"), sortOrder]);
				}
			} else {
				order.push(["lastName", "ASC"]);
			}

			// Initiale Abfrage (IDs & Count)
			const { rows, count } = await this.model.findAndCountAll({
				where: { [Op.and]: [where, companyId ? { companyId } : {}] },
				include,
				limit,
				offset: skip,
				order,
			});

			// Vollständige Daten für Pagination
			const data = await this.model.findAll({
				where: { id: { [Op.in]: rows.map((r) => r.id) } },
				include: [Company, { model: Role, include: [Permission] }, this.eagerLoadToken],
				order,
			});

			return { rows: data, count };
		} catch (error) {
			this.logger.error(error, "Failed to find users");
			throw new InternalServerErrorException(Errors.INTERNAL_ERROR);
		}
	}

	/** Benutzer mit Firmen- & Rolleninformationen über ID */
	async findById(id: number): Promise<User> {
		try {
			return await this.model.findOne({
				where: { id },
				include: [Company, { model: Role, include: [Permission] }, this.eagerLoadToken],
			});
		} catch (error) {
			this.logger.error(error, `Failed to find user by ID ${id}`);
			throw new InternalServerErrorException(Errors.INTERNAL_ERROR);
		}
	}

	/** Weist einem Benutzer neue Rolle(n) anhand der ID(s) zu */
	async updateRoleById(user: User, id: number): Promise<void> {
		try {
			const role = await this.roleModel.findAll({ where: { id: { [Op.in]: id } } });
			await user.$set("role", role);
		} catch (error) {
			this.logger.error(error, `Failed to update role by ID ${id}`);
			throw new InternalServerErrorException(Errors.INTERNAL_ERROR);
		}
	}

	/** Suche nach Benutzer + Firma anhand E-Mail */
	async findOneByEmailWithCompany(email: string): Promise<User> {
		try {
			return await this.model.findOne({
				where: { email },
				include: [Company, { model: Role, include: [Permission] }, this.eagerLoadToken],
			});
		} catch (error) {
			this.logger.error(error, `Failed to find user by email ${email}`);
			throw new InternalServerErrorException(Errors.INTERNAL_ERROR);
		}
	}

	/** Suche nach Benutzer + Firma + Rollen + Berechtigungen anhand E-Mail */
	async findOneByEmailWithCompanyAndPermissions(email: string): Promise<User> {
		try {
			return await this.model.findOne({
				where: { email },
				include: [Company, { model: Role, include: [Permission] }, this.eagerLoadToken],
			});
		} catch (error) {
			this.logger.error(error, `Failed to find user by email ${email}`);
			throw new InternalServerErrorException(Errors.INTERNAL_ERROR);
		}
	}

	/** Suche nach Benutzer + Berechtigungen anhand ID */
	async findOneByIdWithCompanyAndPermissions(id: number): Promise<User> {
		try {
			return await this.model.findOne({
				where: { id },
				include: [Company, { model: Role, include: [Permission] }, this.eagerLoadToken],
			});
		} catch (error) {
			this.logger.error(error, `Failed to find user by ID ${id}`);
			throw new InternalServerErrorException(Errors.INTERNAL_ERROR);
		}
	}

	/** Suche nach Benutzer anhand API-Key */
	async findOneByApiKeyWithCompanyAndPermissions(apiKey: string): Promise<User> {
		if (!apiKey) throw new BadRequestException("API key is required");
		try {
			return await this.model.findOne({
				where: { apiKey },
				include: [Company, { model: Role, include: [Permission] }, this.eagerLoadToken],
			});
		} catch (error) {
			this.logger.error(error, `Failed to find user by apiKey ${apiKey}`);
			throw new InternalServerErrorException(Errors.INTERNAL_ERROR);
		}
	}

	/** Speichert (persistiert) Änderungen am Benutzerobjekt */
	async save(user: User): Promise<User> {
		try {
			return await user.save();
		} catch (error) {
			this.logger.error(error, `Failed to save user ${user.id}`);
			throw new InternalServerErrorException(Errors.INTERNAL_ERROR);
		}
	}

	/** Aktualisiert Felder eines Benutzerobjekts */
	async update(user: User, data: Partial<User>): Promise<User> {
		try {
			return await user.update(data);
		} catch (error) {
			this.logger.error(error, `Failed to update user ${user.id}`);
			throw new InternalServerErrorException(Errors.INTERNAL_ERROR);
		}
	}

	/** Aktualisiert Benutzer per ID */
	async updateById(id: number, data: Partial<User>): Promise<[affectedCount: number]> {
		try {
			return await this.model.update(data, { where: { id } });
		} catch (error) {
			this.logger.error(error, `Failed to update user by ID ${id}`);
			throw new InternalServerErrorException(Errors.INTERNAL_ERROR);
		}
	}

	/** Löscht Benutzer anhand ID */
	async deleteById(id: number): Promise<number> {
		try {
			return await this.model.destroy({ where: { id } });
		} catch (error) {
			this.logger.error(error, `Failed to delete user by ID ${id}`);
			throw new InternalServerErrorException(Errors.INTERNAL_ERROR);
		}
	}

	/** Baut (aber speichert nicht) ein Benutzerobjekt */
	create(user: Partial<User>): User {
		try {
			return this.model.build(user);
		} catch (error) {
			this.logger.error(error, "Failed to build user");
			throw new InternalServerErrorException(Errors.INTERNAL_ERROR);
		}
	}

	/** 🔍 Hilfsfunktionen zur Volltextsuche mit MATCH ... AGAINST */
	private buildMatchQuery(search: string) {
		return `MATCH(firstName, lastName) AGAINST (REPLACE('${this.toPartialSearch(
			search
		)} ${this.toFullWordSearch(search)}', '@', '|') IN BOOLEAN MODE)`;
	}
	private toPartialSearch(search: string) {
		return this.cleanupWords(search)
			.map((w) => w && `${w}*`)
			.join(" ");
	}
	private toFullWordSearch(search: string) {
		return this.cleanupWords(search)
			.map((w) => w && `"${w}"`)
			.join(" ");
	}
	private cleanupWords(search: string) {
		return search.split(" ").map((w) =>
			w.replace(/^[-+=><()~*"]+|[-+=><()~*"]*$/g, "")
		);
	}
}
