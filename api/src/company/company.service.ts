import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Op } from "sequelize";

import User from "src/users/models/user.model";
import { UserInfoCachingService } from "src/caching/services/user-info-caching.service";
import { PageDTO, PageMetaDTO, PageOptionsDTO } from "src/common/dto";

import { CompanyAdminInfoDTO } from "./dto/company-admin-info.dto";
import Company from "./models/company.model";
import { CompanyRepository } from "./repositories/company.repository";

/**
 * Klasse: CompanyService
 *
 * Dieser Service enthält die Geschäftslogik zur Verwaltung von Unternehmen,
 * einschließlich der Erstellung, Aktualisierung, Löschung und Abruf von Unternehmensdaten.
 *
 * Funktionen:
 * - Unternehmen erstellen, aktualisieren, löschen
 * - Paginierte Suche und Abruf einzelner Unternehmen
 * - Löschen von Unternehmen, die mehr als 30 Tage inaktiv sind
 */
@Injectable()
export class CompanyService {
	private readonly logger = new Logger(CompanyService.name);

	constructor(
		@InjectModel(Company)
		private readonly model: typeof Company,
		private readonly userInfoCachingService: UserInfoCachingService,
		private readonly companyRepository: CompanyRepository
	) {}

	/**
	 * Erstellt ein neues Unternehmen.
	 *
	 * @param data - Daten des zu erstellenden Unternehmens
	 * @returns DTO des erstellten Unternehmens
	 */
	async create(data: Partial<Company>) {
		const company = new Company();
		company.name = data.name;

		await company.save();

		company.startDay = company.createdAt.getDate();
		await company.save();

		return new CompanyAdminInfoDTO(company);
	}

	/**
	 * Aktualisiert ein Unternehmen als Admin oder Global Admin.
	 *
	 * @param id - ID des zu aktualisierenden Unternehmens
	 * @param data - Die zu aktualisierenden Unternehmensdaten
	 * @returns Die ID des aktualisierten Unternehmens
	 */
	async updateAsAdmin(id: number, data: Partial<Company>) {
		const company = await this.model.findByPk(id, {
			include: [
				{ model: User, as: "admins" },
				{ model: User, as: "users" },
			],
		});

		if (!company) {
			throw new NotFoundException("Company not found");
		}

		company.name = data.name;

		await company.save();

		// Cache-Invalidierung der Benutzer, die das Unternehmen betreffen
		await Promise.all(
			[...company.admins, ...company.users].map(async (user) => {
				await this.userInfoCachingService.clearUser(user);
			})
		);

		return company.id;
	}

	/**
	 * Aktualisiert das Unternehmen für den angemeldeten Benutzer.
	 *
	 * @param data - Unternehmensdaten, die aktualisiert werden sollen
	 * @param user - Der aktuell angemeldete Benutzer
	 * @returns Die ID des aktualisierten Unternehmens
	 */
	async update(data: Partial<Company>, user: User) {
		const company = await this.model.findByPk(user.companyId);

		if (!company) {
			throw new NotFoundException("Company not found");
		}

		company.name = data.name;

		await company.save();

		// Cache-Invalidierung der Benutzer, die das Unternehmen betreffen
		await Promise.all(
			[...company.admins, ...company.users].map(async (user) => {
				await this.userInfoCachingService.clearUser(user);
			})
		);

		return company.id;
	}

	/**
	 * Speichert API-Schlüssel für das Unternehmen.
	 *
	 * @param data - Unternehmensdaten, die aktualisiert werden sollen
	 * @param user - Der aktuell angemeldete Benutzer
	 * @returns Die ID des aktualisierten Unternehmens
	 */
	async saveApiKeys(data: Partial<Company>, user: User) {
		const company = await this.model.findByPk(user.companyId);

		if (!company) {
			throw new NotFoundException("Company not found");
		}

		await company.save();

		// Cache-Invalidierung des Benutzers
		await this.userInfoCachingService.clearUser(user);

		return company.id;
	}

	/**
	 * Gibt ein Unternehmen anhand seiner ID zurück.
	 *
	 * @param id - ID des Unternehmens
	 * @returns Das Unternehmen als DTO
	 */
	async findOne(id: number): Promise<CompanyAdminInfoDTO> {
		const company = await this.model.findByPk(id, {
			include: [
				{ model: User, as: "admins" },
				{ model: User, as: "users" },
			],
		});

		if (!company) {
			throw new NotFoundException("Company not found");
		}

		return new CompanyAdminInfoDTO(company);
	}

	/**
	 * Gibt eine Liste von Unternehmen mit Paginierung zurück.
	 *
	 * @param pageOptions - Paginierungsoptionen
	 * @returns Paginierte Liste von Unternehmen
	 */
	async findAll(pageOptions: PageOptionsDTO): Promise<PageDTO<CompanyAdminInfoDTO>> {
		const { rows, count } = await this.companyRepository.findAllAndCount(
			pageOptions.limit || 1000,
			pageOptions.skip,
			pageOptions.searchValue || null,
			pageOptions?.filters
		);

		const pageMeta = new PageMetaDTO({ itemCount: count, pageOptions });

		return new PageDTO(
			rows.map((company) => new CompanyAdminInfoDTO(company)),
			pageMeta
		);
	}

	/**
	 * Löscht ein Unternehmen.
	 *
	 * @param id - ID des zu löschenden Unternehmens
	 * @param user - Der aktuell angemeldete Benutzer
	 * @returns Die ID des gelöschten Unternehmens
	 */
	async delete(id: number, user: User) {
		const company = await this.model.findByPk(id);

		if (!company) {
			throw new NotFoundException("Company not found");
		}

		// Nur das Unternehmen löschen, das dem Benutzer gehört, oder wenn der Benutzer ein Admin ist
		if (company.id !== user.companyId && user.companyId !== 1) {
			throw new NotFoundException("You are not allowed to delete this company");
		}

		company.deletedById = user.id;
		await company.save();

		// Löschen des Unternehmens
		await company.destroy();

		return company.id;
	}

	/**
	 * Löscht Unternehmen, die vor mehr als 30 Tagen gelöscht wurden.
	 */
	async hardDeleteCompaniesThatWereDeleted30DaysAgo() {
		const companies = await this.model.findAll({
			where: {
				deletedAt: {
					[Op.lt]: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 Tage
				},
			},
			include: [
				{ model: User, as: "admins" },
				{ model: User, as: "users" },
			],
			paranoid: false,
		});

		// Löschen der betroffenen Unternehmen und deren Benutzer
		await Promise.all(
			companies.map(async (company) => {
				await Promise.all(
					company.admins.map(async (user) => {
						user.destroy({
							force: true,
						});
					})
				);

				await Promise.all(
					company.users.map(async (user) => {
						user.destroy({
							force: true,
						});
					})
				);

				company.destroy({
					force: true,
				});
			})
		);
	}
}
