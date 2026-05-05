import { Body, Controller, Post, UploadedFiles, UseInterceptors } from "@nestjs/common";
import { FilesInterceptor } from "@nestjs/platform-express";
import { ApiOperation, ApiConsumes, ApiBody, ApiCreatedResponse } from "@nestjs/swagger";

import { FileService } from "./file.service";
import { FilesUploadDto } from "./dtos/files-upload.dto";
import { FileValidationPipe } from "./pipes/FileValidationPipe.pipe";
import { UseJWTWithApiKeyAuthorization } from "src/common/decorators/jwt-api-decorators.decorator";
import { PermissionCodes } from "src/permissions/enum/codes";

/**
 * Controller: FileController
 *
 * Bietet Endpunkte zum Hochladen und Löschen von Dateien über einen S3-kompatiblen Speicher (z. B. MinIO oder AWS S3).
 * Die Uploads erfolgen über multipart/form-data, das Löschen über einen einfachen JSON-Body.
 *
 * Zugriff nur mit gültigem JWT und Berechtigung `UPLOAD_FILES`.
 */
@Controller("files")
export class FileController {
	constructor(private readonly fileService: FileService) {}

	/**
	 * POST /files/upload
	 *
	 * Akzeptiert mehrere Dateien über multipart/form-data, validiert sie mittels `FileValidationPipe`
	 * (Größe & Typ) und lädt sie anschließend in den S3-Bucket.
	 *
	 * @param files - Vom Client hochgeladene Dateien (nach Validierung)
	 * @returns Ein Array mit Informationen oder URLs der gespeicherten Dateien
	 */
	@Post("upload")
	@UseJWTWithApiKeyAuthorization({ permissions: [PermissionCodes.UPLOAD_FILES] })
	@UseInterceptors(FilesInterceptor("files"))
	@ApiOperation({
		summary: "Upload files",
		description: "Receives files and uploads them to AWS S3 bucket",
	})
	@ApiConsumes("multipart/form-data")
	@ApiBody({
		description: "Files to upload",
		type: FilesUploadDto,
		isArray: true,
	})
	@ApiCreatedResponse({ description: "Images link on AWS" })
	uploadFiles(@UploadedFiles(FileValidationPipe) files: Express.Multer.File[]) {
		return this.fileService.uploadFiles(files, true);
	}

	/**
	 * POST /files/delete
	 *
	 * Löscht eine Datei aus dem Bucket anhand ihres Pfads.
	 * Der Pfad muss im Request-Body unter `filePath` übergeben werden.
	 *
	 * @param filePath - Der Pfad der Datei im S3-Bucket
	 * @returns Ergebnis des Löschvorgangs
	 */
	@Post("delete")
	@UseJWTWithApiKeyAuthorization({ permissions: [PermissionCodes.UPLOAD_FILES] })
	@ApiOperation({
		summary: "Delete file",
		description: "Receive file's path and delete them from S3 bucket",
	})
	@ApiConsumes("application/json")
	@ApiBody({
		description: "File path",
		type: String,
	})
	deleteFile(@Body("filePath") filePath: string) {
		return this.fileService.deleteFile(filePath);
	}
}
