import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";

import Permission from "../permissions/models/permission.model";
import { PermissionsModule } from "../permissions/permissions.module";
import RolePermission from "./models/role-permission.model";
import Role from "./models/role.model";

import { RoleRepository } from "./repositories/role.repository";
import { RolesController } from "./roles.controller";
import { RolesSeeder } from "./roles.seeder";
import { RolesService } from "./roles.service";

/**
 * Klasse: RolesModule
 *
 * Dieses Modul kapselt alle Funktionalitäten rund um das Rollen- und Berechtigungssystem.
 * Es dient der Verwaltung von Rollen, ihrer zugehörigen Berechtigungen sowie der Bereitstellung
 * entsprechender REST-Endpunkte und Seed-Daten.
 *
 * Verwendungszweck:
 * - Verwaltung von Benutzerrollen und deren Berechtigungen
 * - Initialisierung von Standardrollen beim Projektstart über Seeder
 * - Zugriff auf Rollen via Controller, Service und Repository
 *
 * Enthaltene Bestandteile:
 * - `RolesController`: REST-Endpunkte zur Rollenverwaltung
 * - `RolesService`: Geschäftlogik zur Erstellung, Aktualisierung und Verwaltung von Rollen
 * - `RoleRepository`: Datenbankoperationen für Rollen
 * - `RolesSeeder`: Seeder zum Befüllen der Datenbank mit Basisrollen
 *
 * Imports:
 * - `PermissionsModule`: Für Zugriff auf Berechtigungen
 * - `SequelizeModule.forFeature`: Registriert die Datenbankmodelle `Role`, `Permission`, `RolePermission`
 *
 * Exporte:
 * - Service, Repository und Seeder sind für andere Module verfügbar (z.B. Userverwaltung)
 */
@Module({
	imports: [PermissionsModule, SequelizeModule.forFeature([Role, Permission, RolePermission])],
	controllers: [RolesController],
	providers: [RolesService, RoleRepository, RolesSeeder],
	exports: [RolesService, RoleRepository, RolesSeeder],
})
export class RolesModule {}
