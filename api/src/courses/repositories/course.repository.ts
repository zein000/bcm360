/**
 * Klasse: CourseRepository
 *
 * Diese Repository-Klasse kapselt den Zugriff auf die Kurs-Datenbanktabelle.
 * Sie enthält Methoden zur Abfrage, Filterung und Speicherung von Kursdaten.
 * Zusätzlich wird das zugehörige Logging sowie einheitliches Fehlerhandling über `InternalServerErrorException` umgesetzt.
 *
 * Verwendet wird Sequelize ORM sowie NestJS Dependency Injection.
 */

import { Injectable, InternalServerErrorException, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Op } from "sequelize";

import { Errors } from "../../enums/errors.enum";
import User from "../../users/models/user.model";
import Course from "../models/course.model";
import CourseFile from "../models/course-file.model";
import { FileAssignment } from "../enums/FileAssignment.enum";
import CourseTag from "../models/course-tag.model";

@Injectable()
export class CourseRepository {
	private readonly logger = new Logger(CourseRepository.name);

	constructor(
		@InjectModel(Course)
		private model: typeof Course // Injectiertes Sequelize-Modell für Kurs
	) {}

	/**
	 * Funktion: findAll
	 *
	 * Gibt alle Kurse mit zugehörigem Nutzer zurück.
	 */
	async findAll(): Promise<Course[]> {
		try {
			return this.model.findAll({ include: User });
		} catch (error) {
			this.logger.error(error, "Failed to find companies");
			throw new InternalServerErrorException(Errors.INTERNAL_ERROR);
		}
	}

	/**
	 * Funktion: findAllAndCount
	 *
	 * Gibt eine paginierte Liste von Kursen zurück, inklusive zugehöriger Dateien und Tags.
	 * Optional kann nach Kursnamen gefiltert werden.
	 *
	 * @param limit - Anzahl pro Seite
	 * @param skip - Offset (z. B. Seite * limit)
	 * @param searchValue - Suchbegriff (optional)
	 * @param user - aktueller Benutzer (für Company-Kontext)
	 */
	async findAllAndCount(
		limit: number,
		skip: number,
		searchValue: string | null,
		user: User,
	): Promise<{ rows: Course[]; count: number }> {
		try {
			const where: any = searchValue
				? { name: { [Op.like]: `%${searchValue}%` } }
				: {};

			if (user?.companyId) {
				where["companyId"] = user.companyId;
			}

			// Erst Grundstruktur holen (für count)
			const { rows, count } = await this.model.findAndCountAll({
				where,
				order: ["name"],
				limit,
				offset: skip,
			});

			// Dann Details wie Dateien und Tags mit separater Abfrage (optimierter Include)
			const data = await this.model.findAll({
				where: {
					id: { [Op.in]: rows.map((r) => r.id) },
				},
				include: [
					{
						model: CourseFile,
						where: {
							fileAssignment: { [Op.ne]: FileAssignment.Content },
						},
						required: false,
					},
					CourseTag,
				],
			});

			return { rows: data, count };
		} catch (error) {
			this.logger.error(error, "Failed to find permissions");
			throw new InternalServerErrorException(Errors.INTERNAL_ERROR);
		}
	}

	/**
	 * Funktion: findOneCourse
	 *
	 * Gibt einen einzelnen Kurs anhand seiner ID zurück.
	 */
	async findOneCourse(id: number): Promise<Course> {
		try {
			return await this.model.findOne({ where: { id } });
		} catch (error) {
			this.logger.error(error, `Failed to find course by courseId ${id}`);
			throw new InternalServerErrorException(Errors.INTERNAL_ERROR);
		}
	}

	/**
	 * Funktion: findAllWithTag
	 *
	 * Gibt alle Kurse zurück, die denselben Tag besitzen wie der übergebene Kurs,
	 * aber nicht identisch sind (z. B. zur Anzeige verwandter Szenarien).
	 */
	async findAllWithTag(tagId: number, currentCourseId: number, user: User): Promise<Course[]> {
		try {
			return await this.model.findAll({
				where: {
					tagId,
					id: { [Op.ne]: currentCourseId },
					companyId: user.companyId,
				},
				include: [CourseFile, CourseTag],
			});
		} catch (error) {
			this.logger.error(error, `Failed to find courses by tagId ${tagId}`);
			throw new InternalServerErrorException(Errors.INTERNAL_ERROR);
		}
	}

	/**
	 * Funktion: createCourse
	 *
	 * Speichert ein neues Kurs-Objekt in der Datenbank.
	 */
	async createCourse(course: Course): Promise<Course> {
		try {
			return await course.save();
		} catch (error) {
			this.logger.error(error, "Failed to save course");
			throw new InternalServerErrorException(Errors.INTERNAL_ERROR);
		}
	}
}
