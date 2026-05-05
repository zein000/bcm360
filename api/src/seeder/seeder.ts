import { Injectable, Logger } from "@nestjs/common";

import { UsersSeeder } from "src/users/users.seeder";
import { CompanySeeder } from "src/company/company.seeder";
import { FeaturesSeeder } from "src/features/features.seeder";
import { PermissionsSeeder } from "src/permissions/permissions.seeder";
import { RolesSeeder } from "src/roles/roles.seeder";
import { CourseSeeder } from "src/courses/course.seeder";

/**
 * Klasse: Seeder
 *
 * Diese Klasse ist für das Befüllen der Datenbank mit initialen Daten zuständig.
 * Je nach Umgebung (Entwicklung oder Produktion) werden unterschiedliche Seeder ausgeführt.
 *
 * Vorgehen:
 * - Lädt Standarddaten für Benutzer, Rollen, Berechtigungen, Unternehmen, Kurse und Funktionen
 * - In der Produktionsumgebung wird das Seedern von einer Reihe von Seeder-Instanzen aufgerufen
 * - In der Entwicklungsumgebung wird das Seedern für Testzwecke ebenfalls durchgeführt
 */
@Injectable()
export class Seeder {
	private readonly logger = new Logger();

	constructor(
		private readonly permissionsSeeder: PermissionsSeeder,
		private readonly rolesSeeder: RolesSeeder,
		private readonly usersSeeder: UsersSeeder,
		private readonly companySeeder: CompanySeeder,
		private readonly coursesSeeder: CourseSeeder,
		private readonly featuresSeeder: FeaturesSeeder
	) {}

	/**
	 * Diese Methode wird beim Initialisieren des Moduls aufgerufen.
	 * Sie unterscheidet sich je nach Umgebung:
	 * - In der Entwicklungsumgebung werden Daten initialisiert.
	 * - In der Produktionsumgebung wird das Seedern mit einer anderen Logik durchgeführt.
	 */
	onModuleInit() {
		if (process.env.NODE_ENV === "test") {
			// Wenn in der Testumgebung, keine Daten einfügen
			return;
		}

		if (process.env.NODE_ENV === "development") {
			// Für die Entwicklungsumgebung wird das normale Seed-Verfahren verwendet
			this.seed();
		} else {
			// In der Produktionsumgebung werden Daten sicher gesetzt
			this.productionSeed();
		}
	}

	/**
	 * Seedet die Datenbank mit den erforderlichen Entitäten in der Produktionsumgebung.
	 * Ruft die Seeder für Berechtigungen, Rollen, Unternehmen, Benutzer, Funktionen und Kurse auf.
	 */
	async productionSeed() {
		try {
			await this.permissionsSeeder.seed();
			await this.rolesSeeder.seed();
			await this.companySeeder.seed();
			await this.usersSeeder.seed();
			await this.featuresSeeder.seed();
			await this.coursesSeeder.seed();

			this.logger.debug("Seeding passed!");
		} catch (error) {
			this.logger.warn("Seeding failed!");
			this.logger.error(error.message, error.stack);
		}
	}

	/**
	 * Seedet die Datenbank mit den erforderlichen Entitäten für die Entwicklungsumgebung.
	 * Dies entspricht der `productionSeed` Methode, jedoch für Entwicklungszwecke.
	 */
	async seed() {
		try {
			await this.permissionsSeeder.seed();
			await this.rolesSeeder.seed();
			await this.companySeeder.seed();
			await this.usersSeeder.seed();
			await this.featuresSeeder.seed();
			await this.coursesSeeder.seed();

			this.logger.debug("Seeding passed!");
		} catch (error) {
			this.logger.warn("Seeding failed!");
			this.logger.error(error.message, error.stack);
		}
	}
}
