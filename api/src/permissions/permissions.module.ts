import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";

import { DatabaseModule } from "src/database/database.module";

import Permission from "./models/permission.model";

import { PermissionsController } from "./permissions.controller";
import { PermissionsSeeder } from "./permissions.seeder";
import { PermissionsService } from "./permissions.service";
import { PermissionRepository } from "./repositories/permission.repository";

/**
 * Klasse: PermissionsModule
 *
 * Dieses Modul kapselt alle Funktionalitäten rund um das Thema Berechtigungen (Permissions).
 * Es stellt Controller, Services, Repository und Seeder bereit und bindet das entsprechende Datenbankmodell ein.
 *
 * Verwendungszweck:
 * - Verwaltung von Rollenrechten und Systemberechtigungen
 * - Bereitstellung von Endpunkten zum Abrufen und Aktualisieren von Berechtigungen
 * - Initiales Einfügen von Standardberechtigungen über den Seeder
 *
 * Bestandteile:
 * - `PermissionsController`: REST-Endpunkte zur Verwaltung von Berechtigungen
 * - `PermissionsService`: Geschäftslogik für das Arbeiten mit Berechtigungen
 * - `PermissionRepository`: Direkter Zugriff auf die Datenbanktabelle `Permission`
 * - `PermissionsSeeder`: Initiale Seed-Daten für das Berechtigungssystem
 *
 * Imports:
 * - `DatabaseModule`: Verbindet generische Datenbankkonfigurationen
 * - `SequelizeModule.forFeature([Permission])`: Bindet das `Permission`-Model für Dependency Injection ein
 *
 * Exporte:
 * - Service, Repository und Seeder werden exportiert, damit sie in anderen Modulen (z. B. Rollenverwaltung) genutzt werden können
 */
@Module({
	imports: [DatabaseModule, SequelizeModule.forFeature([Permission])],
	controllers: [PermissionsController],
	providers: [PermissionsService, PermissionRepository, PermissionsSeeder],
	exports: [PermissionsService, PermissionRepository, PermissionsSeeder],
})
export class PermissionsModule {}
