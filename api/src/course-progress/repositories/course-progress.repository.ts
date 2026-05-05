import {
	Injectable,
	InternalServerErrorException,
	Logger,
	NotFoundException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";

import { Op, Sequelize } from "sequelize";
import Course from "src/courses/models/course.model";
import { Errors } from "../../enums/errors.enum";
import CourseProgressUsers from "../models/course-progress-users.model";
import CourseProgress from "../models/course-progress.model";
import ProtocolDecisions from "../models/protocol-decisions.model";
import ProtocolHistories from "../models/protocol-histories.model";
import ProtocolMessages from "../models/protocol-messages.model";
import CourseFile from "src/courses/models/course-file.model";
import { FileAssignment } from "src/courses/enums/FileAssignment.enum";
import CourseTag from "src/courses/models/course-tag.model";
import User from "src/users/models/user.model";
import CourseProgressContent from "../models/course-progress-content.model";
import { CourseProgressEnum } from "../enum/Status";

/**
 * Repository: CourseProgressRepository
 *
 * Diese Klasse stellt zentrale Methoden bereit, um auf Kursfortschritte (`CourseProgress`)
 * und deren Beziehungen zuzugreifen. Sie wird in Services verwendet, um Datenbanklogik
 * vom Business-Logik-Teil zu trennen.
 */
@Injectable()
export class CourseProgressRepository {
	/** Logger-Instanz für Fehlermeldungen und Debugging */
	private readonly logger = new Logger(CourseProgressRepository.name);

	constructor(
		@InjectModel(CourseProgress)
		private model: typeof CourseProgress
	) {}

	/**
	 * Gibt alle Kursfortschritte inklusive zugehörigem Kurs zurück.
	 */
	async findAll(): Promise<CourseProgress[]> {
		try {
			return this.model.findAll({ include: Course });
		} catch (error) {
			this.logger.error(error, "Failed to find course progress");
			throw new InternalServerErrorException(Errors.INTERNAL_ERROR);
		}
	}

	/**
	 * Findet alle Szenarien, die aktuell aktiv sind (Status = InProgress).
	 */
	async findAllScenariosInProgress(): Promise<CourseProgress[]> {
		try {
			return this.model.findAll({
				where: {
					status: CourseProgressEnum.InProgress,
				}
			});
		} catch (error) {
			this.logger.error(error, "Failed to find course progress");
			throw new InternalServerErrorException(Errors.INTERNAL_ERROR);
		}
	}

	/**
	 * Findet alle Szenarien mit Status „InProgress“, die zu einem bestimmten Nutzer gehören.
	 */
	async findAllScenariosInProgressForUser(userId: number): Promise<CourseProgress[]> {
		try {
			return this.model.findAll({
				where: {
					status: CourseProgressEnum.InProgress,
					userId: userId,
				}
			});
		} catch (error) {
			this.logger.error(error, "Failed to find course progress");
			throw new InternalServerErrorException(Errors.INTERNAL_ERROR);
		}
	}

	/**
	 * Findet einen einzelnen Kursfortschritt anhand der ID (inkl. Kurs, Tags und Benutzer).
	 */
	async findOneCourseProgress(id: string): Promise<CourseProgress> {
		try {
			return await this.model.findByPk(id, {
				include: [
					{
						model: Course,
						include: [CourseTag],
					},
					{
						model: User,
						as: "user",
					},
				],
			});
		} catch (error) {
			this.logger.error(error, "Failed to find course progress by id %s", id);
			throw new InternalServerErrorException(Errors.INTERNAL_ERROR);
		}
	}

	/**
	 * Speichert (oder aktualisiert) einen Kursfortschritt.
	 */
	async saveCourseProgress(course: CourseProgress): Promise<CourseProgress> {
		try {
			return course.save();
		} catch (error) {
			this.logger.error(error, "Failed to save course progress");
			throw new InternalServerErrorException(Errors.INTERNAL_ERROR);
		}
	}

	/**
	 * Gibt das zuletzt gestartete Szenario eines Nutzers zurück.
	 */
	async findLastScenarioInProgress(userId: number) {
		try {
			return this.model.findOne({
				where: {
					userId,
					status: CourseProgressEnum.InProgress,
				},
				order: [["createdAt", "DESC"]],
			});
		} catch (error) {
			this.logger.error(error, "Failed to find scenario in progress");
			throw new InternalServerErrorException(Errors.INTERNAL_ERROR);
		}
	}

	/**
	 * Gibt einen Kursfortschritt samt aller zugehörigen Daten zurück –
	 * für Report-Erzeugung oder Analyse.
	 */
	async findCourseProgressWithRelatedDataForReport(
		id: string,
		user: User
	): Promise<CourseProgress> {
		try {
			return this.model.findByPk(id, {
				include: [
					Course,
					CourseProgressUsers,
					CourseProgressContent,
					{
						model: User,
						as: "user",
						where: {
							companyId: user.companyId,
						},
						required: true,
					},
					{
						model: ProtocolHistories,
						include: [
							{
								model: ProtocolDecisions,
								include: [CourseProgressUsers],
							},
							ProtocolMessages,
							CourseProgressUsers,
						],
					},
				],
			});
		} catch (error) {
			this.logger.error(error, "Failed to find course progress data with all relations for report");
			throw new InternalServerErrorException(Errors.INTERNAL_ERROR);
		}
	}

	/**
	 * Gibt eine paginierte Liste von Fortschritten zurück (z. B. für Admin-Übersicht).
	 * Optional mit Suchbegriff, filtert auf Nutzer derselben Firma.
	 */
	async findAllAndCount(
		limit: number,
		skip: number,
		searchValue: string | null,
		user: User
	): Promise<{
		rows: CourseProgress[];
		count: number;
	}> {
		try {
			const where = searchValue
				? {
						name: {
							[Op.like]: Sequelize.literal('CONCAT("%", :searchValue, "%")'),
						},
					}
				: {};

			const { rows, count } = await this.model.findAndCountAll({
				where: {
					...where,
				},
				order: ["status"],
				limit,
				offset: skip,
				include: [
					{
						model: User,
						as: "user",
						where: {
							companyId: user.companyId,
						},
						required: true,
					},
				],
			});

			const data = await this.model.findAll({
				where: {
					id: { [Op.in]: rows.map((r) => r.id) },
				},
				include: [
					{
						model: ProtocolHistories,
						include: [
							{
								model: ProtocolMessages,
							},
							{
								model: ProtocolDecisions,
							},
						],
					},
					{
						model: Course,
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
					},
					{
						model: CourseProgressUsers,
						where: {
							isAccepted: true,
						},
						required: false,
					},
					{
						model: User,
						as: "user",
					},
					CourseProgressContent,
				],
			});

			return { rows: data, count };
		} catch (error) {
			this.logger.error(error, "Failed to find course progresses");

			throw new InternalServerErrorException(Errors.INTERNAL_ERROR);
		}
	}

	/**
	 * Löscht einen Kursfortschritt (Soft Delete) – nur, wenn derselbe Firmenkontext besteht.
	 */
	async deleteCourseProgress(id: string, deletedByUser: User): Promise<void> {
		try {
			const scenarioProgress = await this.model.findByPk(id, {
				include: [
					{
						model: User,
						as: "user",
					},
				],
			});

			if (!scenarioProgress) {
				throw new NotFoundException("Scenario progress not found");
			}

			if (scenarioProgress?.user?.companyId !== deletedByUser.companyId) {
				throw new NotFoundException("You are not allowed to delete this scenario progress");
			}

			scenarioProgress.deletedById = deletedByUser.id;
			await scenarioProgress.save();

			await scenarioProgress.destroy();
		} catch (error) {
			this.logger.error(error, "Failed to delete course progress by id %s", id);
			throw new InternalServerErrorException(Errors.INTERNAL_ERROR);
		}
	}
}
