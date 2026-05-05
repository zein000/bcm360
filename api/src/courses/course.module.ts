/**
 * Klasse: CourseModule
 *
 * Dieses Modul kapselt alle Funktionalitäten rund um das Kursmanagement.
 * Es beinhaltet:
 * - Datenbankmodelle für Kurse, Kursdateien und Kurstags
 * - Controller für HTTP-Endpunkte
 * - Services & Repositories zur Verarbeitung und Datenhaltung
 * - Seeder für das initiale Befüllen mit Kursdaten
 *
 * Das Modul nutzt zusätzlich andere Module wie:
 * - FileModule: für Dateiuploads und Dateiverwaltung (z. B. Kursbilder, PDFs)
 * - CachingModule: zur Performance-Optimierung durch Zwischenspeichern
 * - ScheduleModule: zur geplanten Ausführung von Hintergrundprozessen (optional)
 */

import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";

import { CachingModule } from "src/caching/caching.module"; // für Redis oder ähnliche Cache-Systeme

import Course from "./models/course.model"; // Kursmodell
import CourseFile from "./models/course-file.model"; // Dateizuordnung zu Kurs
import CourseTag from "./models/course-tag.model"; // Tags wie z. B. „Pflege“, „IT“, etc.

import { CourseController } from "./course.controller"; // REST-API für Kurse
import { CourseSeeder } from "./course.seeder"; // Initiale Daten für Dev/Staging
import { CourseService } from "./course.service"; // Business-Logik
import { CourseRepository } from "./repositories/course.repository"; // Datenbankzugriff

import { FileModule } from "src/file/file.module"; // Datei-Uploads (z. B. über S3)
import { ScheduleModule } from "@nestjs/schedule"; // z. B. für geplante Exporte oder Archivierungen

@Module({
	imports: [
		// Registriert alle relevanten Sequelize-Modelle
		SequelizeModule.forFeature([Course, CourseFile, CourseTag]),

		// Integriert externe Module für Dateihandling, Caching und Zeitplanung
		CachingModule,
		FileModule,
		ScheduleModule.forRoot(),
	],

	// REST-Controller für Kurs-Endpunkte
	controllers: [CourseController],

	// Bereitgestellte Dienste für die Kursverarbeitung
	providers: [CourseRepository, CourseSeeder, CourseService],

	// Macht zentrale Komponenten auch in anderen Modulen nutzbar
	exports: [CourseRepository, CourseSeeder, CourseService],
})
export class CourseModule {}
