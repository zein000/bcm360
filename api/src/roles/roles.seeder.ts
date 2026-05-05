import { Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Op } from "sequelize";

import { ERole } from "src/enums/role.enum";
import { PermissionCodes } from "src/permissions/enum/codes";

import Permission from "../permissions/models/permission.model";
import Role from "./models/role.model";
import { participantPermissionCodes, userPermissionCodes } from "./constants/base-roles";

/**
 * Klasse: RolesSeeder
 *
 * Dieser Seeder initialisiert die Basisrollen in der Datenbank inklusive ihrer zugehörigen Berechtigungen.
 * Er wird verwendet, um das System mit den wichtigsten Rollen wie "Admin", "User", "Participant" und "Global Admin"
 * auszustatten und diese mit den entsprechenden Permissions zu verbinden.
 *
 * Besonderheiten:
 * - `bulkCreate` zur performanten Erstellung/Update der Rollen
 * - Nachträgliche Verknüpfung der Rollen mit Berechtigungen über `$add("permissions")`
 * - Nutzt `participantPermissionCodes` und `userPermissionCodes` aus der Konstantendatei
 */
@Injectable()
export class RolesSeeder {
	private readonly logger = new Logger(RolesSeeder.name);

	constructor(
		@InjectModel(Role)
		private roleModel: typeof Role,
		@InjectModel(Permission)
		private permissionModel: typeof Permission
	) {}

	/**
	 * Funktion: seed
	 *
	 * Führt den gesamten Seed-Vorgang aus:
	 * 1. Holt alle verfügbaren Berechtigungen
	 * 2. Erstellt oder aktualisiert Systemrollen (Admin, User, Participant, Global Admin)
	 * 3. Verknüpft die Rollen mit den passenden Berechtigungen
	 */
	async seed() {
		const permissions = await this.permissionModel.findAll();

		const adminPermissions = permissions.filter(
			(permission) => permission.code !== PermissionCodes.GLOBAL_ADMIN
		);

		const roles = [
			{
				name: "Global Admin",
				code: ERole.GLOBAL_ADMIN,
				description: "Global Admin role for all organizations",
				permissions: permissions,
			},
			{
				name: "Admin",
				code: ERole.ADMIN,
				description: "Admin role for organization",
				permissions: adminPermissions,
			},
			{
				name: "User",
				code: ERole.USER,
				description: "User role",
				permissions: permissions.filter((permission) =>
					userPermissionCodes.includes(permission.code as PermissionCodes)
				),
			},
			{
				name: "Participant",
				code: ERole.PARTICIPANT,
				description: "Participant role",
				permissions: permissions.filter((permission) =>
					participantPermissionCodes.includes(permission.code as PermissionCodes)
				),
			},
		];

		try {
			this.logger.debug("Upserting roles");
			await this.roleModel.bulkCreate(roles, {
				updateOnDuplicate: ["name", "description", "code"],
			});
			this.logger.debug("Finished upserting roles");
		} catch (error) {
			this.logger.error("Failed upserting roles: ", error);
		}

		try {
			this.logger.debug("Mapping permissions to roles");

			const newRoles = await this.roleModel.findAll({
				where: {
					code: { [Op.in]: roles.map((role) => role.code) },
				},
				include: Permission,
			});

			await Promise.all(
				newRoles.map((record) =>
					record.$add(
						"permissions",
						roles.find((role) => role.code === record.code)?.permissions || []
					)
				)
			);

			this.logger.debug("Finished mapping permissions to roles");
		} catch (error) {
			this.logger.error(
				"Failed mapping permissions to roles: ",
				(error as Error).message,
				error.stack
			);
		}
	}
}
