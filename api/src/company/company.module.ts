import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";

import { CachingModule } from "src/caching/caching.module";

import Company from "./models/company.model";

import { CompanyController } from "./company.controller";
import { CompanySeeder } from "./company.seeder";
import { CompanyService } from "./company.service";
import { CompanyRepository } from "./repositories/company.repository";

/**
 * Modul: CompanyModule
 *
 * Dieses Modul kapselt alle Funktionen zur Verwaltung von Unternehmen (Company).
 * Dazu gehören Erstellen, Aktualisieren, Löschen, Suchen und Initialisieren von Firmendaten.
 *
 * Enthaltene Bestandteile:
 * - `CompanyController`: REST-Endpunkte für Firmen
 * - `CompanyService`: Geschäftslogik rund um Firmenverwaltung
 * - `CompanyRepository`: Datenzugriffsschicht für das `Company`-Modell
 * - `CompanySeeder`: Initialbefüllung der Firmen in der Datenbank
 *
 * Exporte:
 * - Exportiert Service, Seeder und Repository zur Wiederverwendung in anderen Modulen (z.B. User)
 *
 * Imports:
 * - `SequelizeModule`: für Datenbankzugriff auf `Company`-Tabelle
 * - `CachingModule`: für mögliche Cache-Strategien
 */
@Module({
	imports: [SequelizeModule.forFeature([Company]), CachingModule],
	controllers: [CompanyController],
	providers: [CompanyRepository, CompanySeeder, CompanyService],
	exports: [CompanyRepository, CompanySeeder, CompanyService],
})
export class CompanyModule {}
