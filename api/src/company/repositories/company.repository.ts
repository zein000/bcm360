import { Injectable, InternalServerErrorException, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Op } from "sequelize";

import Role from "src/roles/models/role.model";
import { ERole } from "src/enums/role.enum";
import { Errors } from "../../enums/errors.enum";
import User from "../../users/models/user.model";
import Company from "../models/company.model";

/**
 * Klasse: CompanyRepository
 *
 * Dieses Repository stellt die Datenbankoperationen für das `Company`-Modell bereit.
 * Es wird verwendet, um Unternehmen zu erstellen, zu suchen und zu filtern.
 *
 * Verwendet:
 * - Sequelize-Modelle für die Interaktion mit der Datenbank
 * - Sucht Unternehmen basierend auf verschiedenen Parametern wie Filter und Paginierung
 */
@Injectable()
export class CompanyRepository {
	private readonly logger = new Logger(CompanyRepository.name);

	constructor(
		@InjectModel(Company)
		private model: typeof Company
	) {}

	/**
	 * Findet alle Unternehmen und gibt sie zurück.
	 */
	async findAll(): Promise<Company[]> {
		try {
			return this.model.findAll({ include: User });
		} catch (error) {
			this.logger.error(error, "Failed to find companies");
			throw new InternalServerErrorException(Errors.INTERNAL_ERROR);
		}
	}

	/**
	 * Findet alle Unternehmen basierend auf Paginierung und optionalen Filtern.
	 * Gibt die Anzahl der gefundenen Unternehmen und die Unternehmen selbst zurück.
	 *
	 * @param limit - Maximale Anzahl der Ergebnisse
	 * @param skip - Anzahl der übersprungenen Ergebnisse (Offset)
	 * @param searchValue - Wert, nach dem in den Unternehmen gesucht wird
	 * @param filters - Zusätzliche Filteroptionen
	 * @returns Eine Liste der Unternehmen und deren Anzahl
	 */
	async findAllAndCount(
		limit: number,
		skip: number,
		searchValue: string | null,
		filters?: Record<string, string | string[]>
	): Promise<{
		rows: Company[];
		count: number;
	}> {
		try {
			let where: any = {};

			// Anwenden der Filter auf die Suchabfrage
			if (filters) {
				Object.entries(filters).forEach(([key, value]) => {
					if (key in Company.getAttributes()) {
						if (!Array.isArray(value)) {
							where[key] = { [Op.like]: `%${value}%` };
						} else {
							where[key] = { [Op.in]: value };
						}
					}
				});
			}

			// Suchen der Unternehmen mit Paginierung und Filtern
			const { rows, count } = await this.model.findAndCountAll({
				where: { ...where },
				order: ["name"],
				limit,
				offset: skip,
			});

			// Ergänzen von User- und Rollen-Daten
			const data = await this.model.findAll({
				where: { id: { [Op.in]: rows.map((r) => r.id) } },
				include: [
					{
						model: User,
						as: "admins",
						include: [
							{
								model: Role,
								where: {
									code: {
										[Op.in]: [ERole.ADMIN, ERole.GLOBAL_ADMIN],
									},
								},
								required: true,
							},
						],
					},
					{
						model: User,
						as: "users",
						include: [
							{
								model: Role,
								where: {
									code: {
										[Op.in]: [ERole.USER],
									},
								},
								required: true,
							},
						],
					},
				],
			});

			return { rows: data, count };
		} catch (error) {
			this.logger.error(error, "Failed to find companies with filters");
			throw new InternalServerErrorException(Errors.INTERNAL_ERROR);
		}
	}

	/**
	 * Findet ein Unternehmen anhand der ID.
	 */
	async findOneCompany(id: number): Promise<Company> {
		try {
			return await this.model.findOne({
				where: { id },
			});
		} catch (error) {
			this.logger.error(error, "Failed to find company by companyId %s", id);
			throw new InternalServerErrorException(Errors.INTERNAL_ERROR);
		}
	}

	/**
	 * Erstellt ein neues Unternehmen.
	 */
	async createCompany(company: Company): Promise<Company> {
		try {
			return await company.save();
		} catch (error) {
			this.logger.error(error, "Failed to save company");
			throw new InternalServerErrorException(Errors.INTERNAL_ERROR);
		}
	}
}
