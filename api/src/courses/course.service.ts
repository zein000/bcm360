/**
 * Klasse: CourseService
 *
 * Diese Serviceklasse verwaltet alle Geschäftslogiken rund um Kurse.
 * Sie enthält Methoden zur Erstellung, Bearbeitung, Abfrage und Löschung von Kursen.
 * Zusätzlich unterstützt sie Dateiuploads, Tag-Verwaltung sowie periodische Bereinigung
 * nicht verwendeter Dateien per Cronjob.
 */

import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Op } from "sequelize";

import User from "src/users/models/user.model";
import { UserInfoCachingService } from "src/caching/services/user-info-caching.service";
import { PageDTO, PageMetaDTO, PageOptionsDTO } from "src/common/dto";

import { CourseAdminInfoDTO } from "./dto/course-admin-info.dto";
import Course from "./models/course.model";
import { CourseRepository } from "./repositories/course.repository";
import { FileService } from "src/file/file.service";
import CourseFile from "./models/course-file.model";
import { CourseFileInfoDTO } from "./dto/course-file-info.dto";
import { Cron, CronExpression } from "@nestjs/schedule";
import { FileAssignment } from "./enums/FileAssignment.enum";
import CourseTag from "./models/course-tag.model";
import { CourseTagInfoDTO } from "./dto/course-tag-info.dto";

@Injectable()
export class CourseService {
	private readonly logger = new Logger(CourseService.name);

	constructor(
		@InjectModel(Course) private readonly model: typeof Course,
		@InjectModel(CourseFile) private readonly courseFileModel: typeof CourseFile,
		@InjectModel(CourseTag) private readonly courseTag: typeof CourseTag,
		private readonly userInfoCachingService: UserInfoCachingService,
		private readonly courseRepository: CourseRepository,
		private readonly fileService: FileService
	) {}

	/**
	 * Funktion: handleCron
	 *
	 * Wird täglich um Mitternacht ausgeführt.
	 * Löscht ungenutzte Kursdateien automatisch.
	 */
	@Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
	async handleCron() {
		this.logger.debug("Running scheduled task to clear unused files");
		try {
			await this.handleFilesDeleting(null, false);
		} catch (error) {
			this.logger.error("Error running scheduled task:", error);
		}
	}

	/**
	 * Funktion: create
	 *
	 * Erstellt einen neuen Kurs inklusive Tag und verlinkter Dateien.
	 */
	async create(data: Partial<Course>, user: User) {
		let tag: CourseTagInfoDTO | null = null;
		if (data?.tag?.name) {
			tag = await this.addTagIfNotExist(data.tag.name, user);
		}

		const course = new Course();
		course.name = data.name;
		course.description = data.description;
		course.forWhom = data.forWhom;
		course.json = typeof data.json === "string" ? JSON.parse(data.json) : data.json;
		course.tagId = tag?.id;
		course.companyId = user?.companyId;

		await course.save();

		// Verlinkt hochgeladene Dateien mit dem Kurs
		if (data?.courseFiles?.length) {
			await Promise.all(
				data.courseFiles.map((file) =>
					this.courseFileModel.update(
						{ courseId: course.id },
						{ where: { fullFilePath: file.fullFilePath } }
					)
				)
			);
		}

		return new CourseAdminInfoDTO(course);
	}

	/**
	 * Funktion: updateAsAdmin
	 *
	 * Aktualisiert einen Kurs mit Adminrechten.
	 */
	async updateAsAdmin(id: number, data: Partial<Course>, user: User) {
		let tag: CourseTagInfoDTO | null = null;
		if (data?.tag?.name) {
			tag = await this.addTagIfNotExist(data.tag.name, user);
		}

		const course = await this.model.findByPk(id);
		if (!course) throw new NotFoundException("Course not found");

		course.name = data.name;
		course.description = data.description;
		course.forWhom = data.forWhom;
		course.json = typeof data.json === "string" ? JSON.parse(data.json) : data.json;
		course.tagId = tag?.id;
		course.companyId = user?.companyId;

		await course.save();

		if (data?.courseFiles?.length) {
			await Promise.all(
				data.courseFiles.map((file) =>
					this.courseFileModel.update(
						{ courseId: course.id },
						{ where: { fullFilePath: file.fullFilePath } }
					)
				)
			);
		}
		return course.id;
	}

	/**
	 * Funktion: update
	 *
	 * Aktualisiert Kursdaten für normale Nutzer.
	 */
	async update(data: Partial<Course>, user: User) {
		let tag: CourseTagInfoDTO | null = null;
		if (data?.tag?.name) {
			tag = await this.addTagIfNotExist(data.tag.name, user);
		}

		const course = await this.model.findByPk(data.id);
		if (!course) throw new NotFoundException("Course not found");

		course.name = data.name;
		course.description = data.description;
		course.forWhom = data.forWhom;
		course.json = typeof data.json === "string" ? JSON.parse(data.json) : data.json;
		course.tagId = tag?.id;
		course.companyId = user?.companyId;

		await course.save();

		if (data?.courseFiles?.length) {
			await Promise.all(
				data.courseFiles.map((file) =>
					this.courseFileModel.update(
						{ courseId: course.id },
						{ where: { fullFilePath: file.fullFilePath } }
					)
				)
			);
		}

		return course.id;
	}

	/**
	 * Funktion: addTagIfNotExist
	 *
	 * Erstellt ein Tag, falls es noch nicht existiert.
	 */
	async addTagIfNotExist(tagName: string, user: User) {
		let tag = await this.courseTag.findOne({ where: { name: tagName } });

		if (!tag) {
			tag = new CourseTag();
			tag.name = tagName;
			tag.companyId = user?.companyId;
			await tag.save();
		}

		return new CourseTagInfoDTO(tag);
	}

	/**
	 * Funktion: findAllTags
	 *
	 * Gibt alle Tags zurück, die zur Firma des Nutzers gehören.
	 */
	async findAllTags(user: User): Promise<CourseTagInfoDTO[]> {
		const tags = await this.courseTag.findAll({ where: { companyId: user.companyId } });
		return tags.map((tag) => new CourseTagInfoDTO(tag));
	}

	/**
	 * Funktion: findOne
	 *
	 * Gibt einen Kurs mit zugehörigen Dateien und Tags anhand der ID zurück.
	 */
	async findOne(id: number): Promise<CourseAdminInfoDTO> {
		const course = await this.model.findByPk(id, { include: [CourseFile, CourseTag] });
		if (!course) throw new NotFoundException("Course not found");
		return new CourseAdminInfoDTO(course);
	}

	/**
	 * Funktion: findAllRelatedCourses
	 *
	 * Gibt verwandte Kurse mit gleichem Tag zurück.
	 */
	async findAllRelatedCourses(id: number, user: User): Promise<CourseAdminInfoDTO[]> {
		const course = await this.findOne(id);
		if (!course?.tag?.id) return [];
		const related = await this.courseRepository.findAllWithTag(course.tag.id, id, user);
		return related.map((c) => new CourseAdminInfoDTO(c));
	}

	/**
	 * Funktion: findAll
	 *
	 * Gibt alle Kurse paginiert zurück.
	 */
	async findAll(pageOptions: PageOptionsDTO, user: User): Promise<PageDTO<CourseAdminInfoDTO>> {
		const { rows, count } = await this.courseRepository.findAllAndCount(
			pageOptions.limit || 1000,
			pageOptions.skip,
			pageOptions.searchValue || null,
			user
		);

		const pageMeta = new PageMetaDTO({ itemCount: count, pageOptions });

		return new PageDTO(rows.map((course) => new CourseAdminInfoDTO(course)), pageMeta);
	}

	/**
	 * Funktion: delete
	 *
	 * Löscht einen Kurs (inkl. Dateien), wenn Nutzer Berechtigung hat.
	 */
	async delete(id: number, user: User) {
		const course = await this.model.findByPk(id, { include: [CourseFile] });
		if (!course) throw new NotFoundException("Course not found");

		// Nur Firma selbst oder Admin (companyId = 1) darf löschen
		if (course.companyId !== user.companyId && user.companyId !== 1) {
			throw new NotFoundException("You are not allowed to delete this course");
		}

		// Löscht Dateien des Kurses
		if (course?.courseFiles?.length) {
			await this.handleFilesDeleting(id);
		}

		course.deletedById = user.id;
		await course.save();
		await course.destroy();

		return course.id;
	}

	/**
	 * Funktion: uploadCourseFiles
	 *
	 * Lädt Dateien hoch und speichert Metadaten in der Datenbank.
	 */
	async uploadCourseFiles(
		files: Express.Multer.File[],
		fileAssignment: FileAssignment = FileAssignment.Content
	) {
		const filePaths = await this.fileService.uploadFiles(files);
		const courseFiles = filePaths.map((fileInfo) => ({
			fileType: fileInfo.fileType,
			fullFilePath: fileInfo.fullFilePath,
			fileLength: fileInfo.fileLength,
			fileName: fileInfo.fileName,
			fileAssignment: fileAssignment,
		}));

		const fileEntries = await this.courseFileModel.bulkCreate(courseFiles);
		return fileEntries.map((entry) => new CourseFileInfoDTO(entry));
	}

	/**
	 * Funktion: deleteCourseFile
	 *
	 * Löscht eine Datei eines Kurses.
	 */
	async deleteCourseFile(fullFilePath: string) {
		const existedFile = await this.courseFileModel.findOne({ where: { fullFilePath } });
		if (!existedFile) throw new NotFoundException("File was not found");

		await existedFile.destroy();
		await this.fileService.deleteFile(fullFilePath);
	}

	/**
	 * Funktion: handleFilesDeleting
	 *
	 * Löscht verwaiste oder explizit zu löschende Dateien eines Kurses.
	 * Wird auch vom Cronjob genutzt.
	 */
	async handleFilesDeleting(courseId: number | null, safeDelete: boolean = true) {
		const unUsedFiles = await this.courseFileModel.findAll({ where: { courseId } });

		const deleteResults = await Promise.allSettled(
			unUsedFiles.map((file) => this.fileService.deleteFile(file.fullFilePath))
		);

		if (!safeDelete) {
			const successfullyDeleted = unUsedFiles.filter(
				(_, index) => deleteResults[index].status === "fulfilled"
			);

			const failedDeletions = deleteResults
				.map((result, index) => (result.status === "rejected" ? unUsedFiles[index] : null))
				.filter(Boolean);

			if (failedDeletions.length) {
				this.logger.error(`Failed to delete ${failedDeletions.length} course files from bucket`);
				if (courseId !== null) {
					await this.courseFileModel.update(
						{ courseId: null },
						{ where: { id: failedDeletions.map((file) => file!.id) } }
					);
				}
			}

			if (successfullyDeleted.length) {
				await this.courseFileModel.destroy({
					where: { id: successfullyDeleted.map((file) => file.id) },
				});

				this.logger.debug(`Successfully deleted ${successfullyDeleted.length} unused files from the database`);
			}
		}
	}
}
