import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";

import { DatabaseModule } from "src/database/database.module";

import { PermissionsModule } from "src/permissions/permissions.module";
import { RolesModule } from "src/roles/roles.module";

import { UsersModule } from "src/users/users.module";
import { CompanyModule } from "src/company/company.module";
import { FeaturesModule } from "src/features/features.module";
import { CourseModule } from "src/courses/course.module";

import Migration from "./models/migration.model";
import Seed from "./models/seed.model";
import { Seeder } from "./seeder";

/**
 * Modul: SeederModule
 *
 * Dieses Modul ist für das Seedern und Migration von Daten verantwortlich.
 * Es stellt sicher, dass die Datenbank in der richtigen Konfiguration ist
 * und initialisiert wird, wenn das Projekt läuft.
 *
 * Komponenten:
 * - `Seeder`: Enthält die Logik zum Befüllen der Datenbank mit Standardwerten
 * - `Migration`: Modell für die Verwaltung von Migrationen in der Datenbank
 * - `Seed`: Modell zur Verwaltung von Seed-Daten
 *
 * Importierte Module:
 * - `DatabaseModule`: Verbindet mit der Datenbank und stellt die Grundoperationen bereit
 * - `RolesModule`, `PermissionsModule`, `UsersModule`, `CompanyModule`, `CourseModule`, `FeaturesModule`: Für das Seedern der verschiedenen Entitäten wie Rollen, Benutzer, Firmen, Kurse, Funktionen
 */
@Module({
	imports: [
		SequelizeModule.forFeature([Seed, Migration]),
		DatabaseModule,
		RolesModule,
		UsersModule,
		PermissionsModule,
		CompanyModule,
		CourseModule,
		FeaturesModule,
	],
	providers: [Seeder], // Stellt den Seeder bereit, der beim Initialisieren verwendet wird
})
export class SeederModule {}
