import { Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";

import Company from "./models/company.model";

/**
 * Klasse: CompanySeeder
 *
 * Dieser Seeder initialisiert vordefinierte Unternehmen in der Datenbank.
 * Wird verwendet, um Test- oder Standardfirmen beim Projektstart anzulegen.
 *
 * Vorgehen:
 * - Überprüft, ob die Firmen bereits existieren (nach Name)
 * - Falls nicht vorhanden, werden sie neu erstellt
 */
@Injectable()
export class CompanySeeder {
	private readonly logger = new Logger(CompanySeeder.name);

	constructor(
		@InjectModel(Company)
		private companyModel: typeof Company
	) {}

	/**
	 * Funktion: seed
	 *
	 * Führt das Anlegen von Default-Companies aus, wenn sie noch nicht existieren.
	 */
	async seed() {
		const companies = [
			{ name: "Browserbite EOOD" },
			{ name: "Testing company" },
		];

		try {
			this.logger.debug("Upserting companies");

			for (const company of companies) {
				const foundCompany = await this.companyModel.findOne({
					where: { name: company.name },
				});

				if (!foundCompany) {
					await this.companyModel.create(company);
				}
			}

			this.logger.debug("Finished upserting companies");
		} catch (error) {
			this.logger.error("Failed upserting companies: ", error);
		}
	}
}
