/**
 * Klasse: CourseSeeder
 *
 * Diese Klasse dient dem Initialisieren der Datenbank mit vordefinierten Kursen.
 * Sie wird typischerweise in Entwicklungs- oder Testumgebungen verwendet, um Beispielkurse
 * bereitzustellen. Die Methode `seed()` prüft, ob die Kurse bereits existieren, und legt sie andernfalls an.
 */

import { Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";

import Course from "./models/course.model"; // Sequelize-Datenbankmodell für Kurs

@Injectable()
export class CourseSeeder {
	private readonly logger = new Logger(CourseSeeder.name);

	constructor(
		@InjectModel(Course)
		private courseModel: typeof Course // Injected Sequelize Model für Kurs-Operationen
	) {}

	/**
	 * Funktion: seed
	 *
	 * Legt initial zwei Beispielkurse in der Datenbank an, falls sie noch nicht existieren.
	 * Diese Kurse sind mit einer `companyId` von `1` verknüpft und enthalten leere JSON-Inhalte.
	 */
	async seed() {
		// Beispielkurse zur Initialisierung
		const courses = [
			{
				name: "Browserbite Test Course",
				json: {}, // Platzhalter für Szenario-Struktur
				companyId: 1,
			},
			{
				name: "Browserbite Test 2 Course",
				json: {},
				companyId: 1,
			},
		];

		try {
			this.logger.debug("Upserting courses"); // Log-Ausgabe zur Übersicht

			for (const course of courses) {
				// Prüft, ob ein Kurs mit gleichem Namen bereits existiert
				const foundCourse = await this.courseModel.findOne({
					where: {
						name: course.name,
					},
				});

				// Falls nicht vorhanden → neu anlegen
				if (!foundCourse) {
					await this.courseModel.create(course);
				}
			}

			this.logger.debug("Finished upserting courses");
		} catch (error) {
			console.log(error);
			this.logger.error("Failed upserting courses: ", error);
		}
	}
}
