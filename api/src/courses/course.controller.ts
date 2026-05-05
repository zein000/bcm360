/**
 * Klasse: CourseController
 *
 * Dieser Controller stellt REST-API-Endpunkte für das Management von Kursen bereit.
 * Es sind Funktionen zum Erstellen, Bearbeiten, Löschen und Abfragen von Kursen vorhanden.
 * Außerdem unterstützt der Controller Datei-Uploads für Kursbilder und Materialien über AWS S3.
 * Der Zugriff ist rollenbasiert geregelt durch Permissions und JWT-Authentifizierung.
 */

import {
	Body,
	Controller,
	Delete,
	Get,
	Logger,
	Param,
	Patch,
	Post,
	Query,
	Request,
	UploadedFiles,
	UseInterceptors,
} from "@nestjs/common";
import {
	ApiBadRequestResponse,
	ApiBody,
	ApiConsumes,
	ApiCreatedResponse,
	ApiOkResponse,
	ApiOperation,
	ApiTags,
} from "@nestjs/swagger";
import { FileInterceptor, FilesInterceptor } from "@nestjs/platform-express";

import { UseJWTWithApiKeyAuthorization } from "src/common/decorators/jwt-api-decorators.decorator";
import { PermissionCodes } from "src/permissions/enum/codes";

import { FileUploadResponseDto } from "src/file/dtos/file-upload-response.dto";
import RequestWithUser from "src/interfaces/request-with-user.interface";
import { ErrorResponseDTO } from "src/auth/dto/error-response.dto";
import { PageDTO, PageOptionsDTO } from "src/common/dto";
import { FilesUploadDto } from "src/file/dtos/files-upload.dto";
import { FileValidationPipe } from "src/file/pipes/FileValidationPipe.pipe";

import { CourseService } from "./course.service";
import { CourseAdminInfoDTO } from "./dto/course-admin-info.dto";
import { CourseFileInfoDTO } from "./dto/course-file-info.dto";
import { CreateCourseDTO } from "./dto/create-course.dto";
import { UpdateCourseDTO } from "./dto/update-course.dto";
import { FileAssignment } from "./enums/FileAssignment.enum";
import { CourseTagInfoDTO } from "./dto/course-tag-info.dto";

@ApiTags("Scenario") // Dokumentiert die Swagger-Kategorie
@Controller("course")
export class CourseController {
	private readonly logger = new Logger(CourseController.name);

	constructor(private readonly courseService: CourseService) {}

	/**
	 * Funktion: createPerson
	 *
	 * Erstellt einen neuen Kurs.
	 *
	 * @param data - Kursinformationen
	 * @param user - Authentifizierter Benutzer
	 */
	@Post()
	@UseJWTWithApiKeyAuthorization({ permissions: [PermissionCodes.GLOBAL_ADMIN] })
	@UseInterceptors(FileInterceptor("file"))
	@ApiOperation({ description: "Receives image file and uploads it to AWS S3 bucket", summary: "Upload image" })
	createPerson(@Body() data: CreateCourseDTO, @Request() { user }: RequestWithUser) {
		return this.courseService.create(data, user);
	}

	/**
	 * Funktion: getall
	 *
	 * Gibt alle Kurse zurück, paginiert.
	 */
	@Get()
	@UseJWTWithApiKeyAuthorization({ permissions: [PermissionCodes.COURSES] })
	@ApiOperation({ summary: "Get courses", description: "Get all courses" })
	@ApiOkResponse({ type: CourseAdminInfoDTO, description: "company infos" })
	@ApiBadRequestResponse({ type: ErrorResponseDTO, description: "Invalid request data." })
	async getall(@Query() pageOptions: PageOptionsDTO, @Request() { user }: RequestWithUser): Promise<PageDTO<CourseAdminInfoDTO>> {
		return this.courseService.findAll(pageOptions, user);
	}

	/**
	 * Funktion: getAllTags
	 *
	 * Gibt alle Tags zurück, die bereits Kursen zugewiesen wurden.
	 */
	@Get("tags")
	@UseJWTWithApiKeyAuthorization({ permissions: [PermissionCodes.COURSES] })
	@ApiOperation({ summary: "Get all existed tags", description: "Get all existed tags for courses" })
	async getAllTags(@Request() { user }: RequestWithUser): Promise<CourseTagInfoDTO[]> {
		return this.courseService.findAllTags(user);
	}

	/**
	 * Funktion: getAllRelatedCourses
	 *
	 * Gibt Kurse zurück, die mit einem bestimmten Kurs verwandt sind.
	 */
	@Get(":id/related")
	@UseJWTWithApiKeyAuthorization({ permissions: [PermissionCodes.COURSES] })
	@ApiOperation({ summary: "Get all related courses", description: "Get all related courses for course" })
	async getAllRelatedCourses(@Param("id") id: string, @Request() { user }: RequestWithUser): Promise<CourseAdminInfoDTO[]> {
		return this.courseService.findAllRelatedCourses(+id, user);
	}

	/**
	 * Funktion: findOne
	 *
	 * Gibt einen bestimmten Kurs anhand seiner ID zurück.
	 */
	@Get(":id")
	@UseJWTWithApiKeyAuthorization({ permissions: [PermissionCodes.COURSES] })
	@ApiOperation({
		summary: "Get courses",
		description: `**PERMISSIONS: ${(PermissionCodes.GLOBAL_ADMIN, PermissionCodes.ADMIN)}**`,
	})
	async findOne(@Param("id") id: string): Promise<CourseAdminInfoDTO> {
		return this.courseService.findOne(+id);
	}

	/**
	 * Funktion: update
	 *
	 * Aktualisiert Kursdaten als Admin.
	 */
	@Patch(":id")
	@UseJWTWithApiKeyAuthorization({
		permissions: [PermissionCodes.GLOBAL_ADMIN, PermissionCodes.ADMIN],
	})
	@ApiOperation({ description: "Receives image file and uploads it to AWS S3 bucket", summary: "Upload image" })
	update(@Param() params: { id: number }, @Body() data: UpdateCourseDTO, @Request() { user }: RequestWithUser) {
		return this.courseService.updateAsAdmin(params.id, data, user);
	}

	/**
	 * Funktion: upload
	 *
	 * Aktualisiert ein Kursbild oder andere Informationen.
	 */
	@Patch()
	@UseJWTWithApiKeyAuthorization({ permissions: [PermissionCodes.COURSES] })
	@UseInterceptors(FileInterceptor("file"))
	@ApiOperation({ description: "Receives image file and uploads it to AWS S3 bucket", summary: "Upload image" })
	upload(@Request() { user }: RequestWithUser, @Body() data: UpdateCourseDTO) {
		return this.courseService.update(data, user);
	}

	/**
	 * Funktion: delete
	 *
	 * Löscht einen Kurs anhand seiner ID.
	 */
	@Delete(":id")
	@UseJWTWithApiKeyAuthorization({
		permissions: [PermissionCodes.COURSES, PermissionCodes.GLOBAL_ADMIN, PermissionCodes.ADMIN],
	})
	@ApiOperation({ description: "Receives image file and uploads it to AWS S3 bucket", summary: "Upload image" })
	delete(@Param() params: { id: number }, @Request() { user }: RequestWithUser) {
		return this.courseService.delete(params.id, user);
	}

	/**
	 * Funktion: uploadFiles
	 *
	 * Lädt mehrere Dateien (z. B. PDFs, Materialien) zu einem Kurs hoch.
	 */
	@Post("files/upload")
	@UseJWTWithApiKeyAuthorization({ permissions: [PermissionCodes.UPLOAD_FILES] })
	@UseInterceptors(FilesInterceptor("files"))
	@ApiOperation({ description: "Receives files and uploads them to AWS S3 bucket", summary: "Upload files" })
	@ApiConsumes("multipart/form-data")
	@ApiBody({
		description: "Files to upload",
		type: FilesUploadDto,
		isArray: true,
	})
	@ApiCreatedResponse({ type: CourseFileInfoDTO })
	uploadFiles(
		@UploadedFiles(FileValidationPipe) files: Express.Multer.File[],
		@Body("fileAssignment") fileAssignment: FileAssignment
	) {
		return this.courseService.uploadCourseFiles(files, fileAssignment);
	}

	/**
	 * Funktion: deleteFile
	 *
	 * Löscht eine Datei vom AWS S3 Bucket.
	 */
	@Delete("file/delete")
	@UseJWTWithApiKeyAuthorization({ permissions: [PermissionCodes.UPLOAD_FILES] })
	@ApiOperation({ description: "Receive file`s path and delete them from S3 bucket", summary: "Delete file" })
	@ApiConsumes("application/json")
	@ApiBody({ description: "File path", type: String })
	deleteFile(@Body("filePath") filePath: string) {
		return this.courseService.deleteCourseFile(filePath);
	}
}
