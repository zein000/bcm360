import { Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";

import { PermissionCodes } from "./enum/codes";
import Permission from "./models/permission.model";

/**
 * Klasse: PermissionsSeeder
 *
 * Diese Klasse dient zum Initialisieren (Seed) der `permissions`-Tabelle in der Datenbank mit einer
 * vordefinierten Liste von Berechtigungen. Sie wird meist beim Projektstart oder Deployment verwendet.
 *
 * Verwendungszweck:
 * - Einmaliges oder wiederholtes Einfügen aller Berechtigungen in die Datenbank
 * - Verwendung von `bulkCreate` mit `updateOnDuplicate`, um vorhandene Einträge zu aktualisieren
 *
 * Besondere Merkmale:
 * - Alle Berechtigungen stammen aus dem `PermissionCodes` Enum
 * - Ausführliches Logging zur Nachverfolgung im Seed-Prozess
 */
@Injectable()
export class PermissionsSeeder {
	private readonly logger = new Logger(PermissionsSeeder.name);

	constructor(
		@InjectModel(Permission)
		private model: typeof Permission
	) {}

	/**
	 * Funktion: seed
	 *
	 * Führt das Hochladen bzw. Aktualisieren der Standardberechtigungen in die Datenbank durch.
	 * Bereits vorhandene Berechtigungen werden dabei anhand des `code` aktualisiert.
	 */
	async seed() {
		const permissions = [
			{ name: "Create role", code: PermissionCodes.CREATE_ROLE, description: "Create role" },
			{ name: "Read roles", code: PermissionCodes.READ_ROLES, description: "Read roles" },
			{ name: "Update role", code: PermissionCodes.UPDATE_ROLE, description: "Update role" },
			{ name: "Delete role", code: PermissionCodes.DELETE_ROLE, description: "Delete role" },
			{ name: "Invite user", code: PermissionCodes.INVITE_USER, description: "Invite user" },
			{ name: "Get user", code: PermissionCodes.GET_USER, description: "Get user" },
			{ name: "Get self", code: PermissionCodes.GET_ME, description: "Get self" },
			{ name: "Delete user", code: PermissionCodes.DELETE_USER, description: "Delete user" },
			{ name: "Change password", code: PermissionCodes.CHANGE_PASSWORD, description: "Change password" },
			{ name: "Update me", code: PermissionCodes.UPDATE_ME, description: "Update me" },
			{ name: "Update user", code: PermissionCodes.UPDATE_USER, description: "Update user" },
			{ name: "Update user role", code: PermissionCodes.UPDATE_USER_ROLE, description: "Update user role" },
			{ name: "Generate 2FA", code: PermissionCodes.GENERATE_2FA, description: "Generate 2FA" },
			{ name: "Get permission", code: PermissionCodes.GET_PERMISSION, description: "Get permission" },
			{ name: "Update permission", code: PermissionCodes.UPDATE_PERMISSION, description: "Update permission" },
			{ name: "Manage configuration", code: PermissionCodes.MANAGE_CONFIGURATION, description: "Manage configuration" },
			{ name: "Blacklist jwt", code: PermissionCodes.BLACKLIST_JWT, description: "Blacklist json web token" },
			{ name: "Logout", code: PermissionCodes.LOGOUT, description: "Logout the user and blacklist their json web token" },
			{ name: "Disable 2FA", code: PermissionCodes.DISABLE_2FA, description: "Disable 2FA for the authenticated user" },
			{ name: "Verify 2FA", code: PermissionCodes.VERIFY_2FA, description: "Verifies 2FA for the authenticated user" },
			{ name: "All Cookie", code: PermissionCodes.COOKIE, description: "All Cookie" },
			{ name: "All UPLOAD_FILES", code: PermissionCodes.UPLOAD_FILES, description: "All UPLOAD_FILES" },
			{ name: "All DESKTOP", code: PermissionCodes.DESKTOP, description: "All DESKTOP" },
			{ name: "All COMPANY", code: PermissionCodes.COMPANY, description: "All COMPANY" },
			{ name: "All COURSES", code: PermissionCodes.COURSES, description: "All COURSES" },
			{ name: "Global Admin", code: PermissionCodes.GLOBAL_ADMIN, description: "GLOBAL_ADMIN" },
			{ name: "Admin", code: PermissionCodes.ADMIN, description: "ADMIN" },
			{ name: "User", code: PermissionCodes.USER, description: "USER" },
			{ name: "Participant", code: PermissionCodes.PARTICIPANT, description: "PARTICIPANT" },
			{ name: "All MANAGE_COURSES", code: PermissionCodes.MANAGE_COURSES, description: "All MANAGE_COURSES" },
			{ name: "PROTOCOL_WRITER", code: PermissionCodes.PROTOCOL_WRITER, description: "PROTOCOL_WRITER" },
		];

		try {
			this.logger.debug("Upserting permissions");

			await this.model.bulkCreate(permissions, {
				updateOnDuplicate: ["name", "description", "code"],
			});

			this.logger.debug("Finished upserting permissions");
		} catch (error) {
			this.logger.error(error.message, error.stack);
		}
	}
}
