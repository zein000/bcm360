import { Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Op } from "sequelize";

import { ERole } from "src/enums/role.enum";

import Company from "src/company/models/company.model";

import Role from "../roles/models/role.model";
import User from "./models/user.model";
import { v4 } from "uuid";

/**
 * Klasse: UsersSeeder
 *
 * Diese Klasse ist ein Seeder, der initiale Benutzerdaten in die Datenbank einfügt.
 * Sie stellt sicher, dass bestimmte Benutzer (z. B. Admins oder Testnutzer) existieren.
 * Falls ein Benutzer bereits vorhanden ist (basierend auf der E-Mail-Adresse), wird er aktualisiert.
 * Andernfalls wird er neu angelegt.
 *
 * Diese Klasse verwendet Sequelize-Modelle für Benutzer, Rollen und Firmen.
 */
@Injectable()
export class UsersSeeder {
	private readonly logger = new Logger(UsersSeeder.name);

	constructor(
		@InjectModel(User)
		private userModel: typeof User,
		@InjectModel(Company)
		private readonly modelCompany: typeof Company,
		@InjectModel(Role)
		private roleModel: typeof Role
	) {}

	/**
	 * Funktion: seed
	 *
	 * Diese Funktion übernimmt das Erstellen oder Aktualisieren vordefinierter Benutzer.
	 * Zunächst werden alle Rollen geladen sowie eine bestimmte Firma gesucht.
	 * Anschließend werden Benutzer mit entsprechenden Rollen und API-Schlüsseln vorbereitet.
	 * Für jeden dieser Benutzer wird überprüft, ob er bereits existiert. Falls ja, wird er aktualisiert, andernfalls neu erstellt.
	 *
	 * @throws Fehler, wenn die ADMIN-Rolle nicht gefunden wird.
	 */
	async seed() {
		// Alle Rollen abrufen (für spätere Zuweisung an Benutzer)
		const roles = await this.roleModel.findAll();

		// Eine Firma mit dem Namen "Testing company" laden
		const company = await this.modelCompany.findOne({
			where: {
				name: "Testing company",
			},
		});

		// Die jeweiligen Rollen anhand ihrer Codes finden
		const adminRole = roles.find((role) => role.code === ERole.ADMIN);
		const userRole = roles.find((role) => role.code === ERole.USER);
		const globalAdminRole = roles.find((role) => role.code === ERole.GLOBAL_ADMIN);

		if (!adminRole) {
			const errorMessage = "Couldn't find admin role";
			this.logger.error(errorMessage);
			throw new Error(errorMessage);
		}

		// Liste vordefinierter Benutzer
		const users = [
			{
				email: "globaladmin@browserbite.io",
				firstName: "super",
				lastName: "admin",
				password: "iOpCELkS2hhuWEM",
				companyId: 1,
				roleId: globalAdminRole.id,
				apiKey: v4(),
			},
			{
				email: "admin@browserbite.io",
				firstName: "admin",
				lastName: "admin",
				password: "iOpCELkS2hhuWEM",
				companyId: 1,
				roleId: adminRole.id,
				apiKey: v4(),
			},
			{
				email: "user@browserbite.io",
				firstName: "user",
				lastName: "user",
				password: "iOpCELkS2hhuWEM",
				companyId: 1,
				roleId: userRole.id,
				apiKey: v4(),
			},
			{
				email: "globaladmin2@browserbite.io",
				firstName: "test",
				lastName: "user",
				password: "iOpCELkS2hhuWEM",
				companyId: company.id,
				roleId: globalAdminRole.id,
				apiKey: v4(),
			},
			{
				email: "testuser@browserbite.io",
				firstName: "test",
				lastName: "user",
				password: "iOpCELkS2hhuWEM",
				companyId: company.id,
				roleId: adminRole.id,
				apiKey: v4(),
			},
			{
				email: "testcolleague@browserbite.io",
				firstName: "test",
				lastName: "colleague",
				password: "iOpCELkS2hhuWEM",
				companyId: company.id,
				roleId: adminRole.id,
				apiKey: v4(),
			},
		];

		try {
			this.logger.debug("Upserting users");

			// Für jeden Benutzer: existiert er bereits? Dann update, sonst create
			for (const user of users) {
				const foundUser = await this.userModel.findOne({
					where: {
						email: user.email,
					},
				});

				if (foundUser) {
					await foundUser.update(user);
				} else {
					await this.userModel.create(user);
				}
			}

			this.logger.debug("Finished upserting users");
		} catch (error) {
			this.logger.error("Failed upserting users: ", error);
		}
	}
}
