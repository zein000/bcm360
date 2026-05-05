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
	UseInterceptors,
} from "@nestjs/common";
import {
	ApiBadRequestResponse,
	ApiCreatedResponse,
	ApiOkResponse,
	ApiOperation,
} from "@nestjs/swagger";
import { FileInterceptor } from "@nestjs/platform-express";

import { UseJWTWithApiKeyAuthorization } from "src/common/decorators/jwt-api-decorators.decorator";
import { PermissionCodes } from "src/permissions/enum/codes";

import { FileUploadResponseDto } from "src/file/dtos/file-upload-response.dto";
import RequestWithUser from "src/interfaces/request-with-user.interface";
import { ErrorResponseDTO } from "src/auth/dto/error-response.dto";
import { PageDTO, PageOptionsDTO } from "src/common/dto";

import { CompanyService } from "./company.service";
import { CompanyAdminInfoDTO } from "./dto/company-admin-info.dto";
import { CreateCompanyDTO } from "./dto/create-company.dto";
import { UpdateCompanyDTO } from "./dto/update-company.dto";

/**
 * Controller: CompanyController
 *
 * Dieser Controller behandelt alle Endpunkte rund um die Verwaltung von Unternehmen.
 * Berechtigungsgeschützt durch verschiedene Rollen wie GLOBAL_ADMIN, ADMIN oder COMPANY.
 *
 * Features:
 * - Unternehmen erstellen, lesen, aktualisieren und löschen
 * - Datei-Upload für Unternehmenslogos oder Bilder
 * - Unterstützung für Paginierung beim Abruf aller Firmen
 */
@Controller("company")
export class CompanyController {
	private readonly logger = new Logger(CompanyController.name);

	constructor(private readonly companyService: CompanyService) {}

	/**
	 * POST /company
	 *
	 * Erstellt ein neues Unternehmen.
	 */
	@Post()
	@UseJWTWithApiKeyAuthorization({ permissions: [PermissionCodes.GLOBAL_ADMIN] })
	@UseInterceptors(FileInterceptor("file"))
	@ApiOperation({
		summary: "Upload image",
		description: "Receives image file and uploads it to AWS S3 bucket",
	})
	createPerson(@Body() data: CreateCompanyDTO) {
		return this.companyService.create(data);
	}

	/**
	 * GET /company
	 *
	 * Gibt eine paginierte Liste aller Unternehmen zurück.
	 */
	@Get()
	@UseJWTWithApiKeyAuthorization({ permissions: [PermissionCodes.GLOBAL_ADMIN] })
	@ApiOperation({
		summary: "Get companies",
		description: `**PERMISSIONS: ${PermissionCodes.GLOBAL_ADMIN}**`,
	})
	@ApiOkResponse({ type: CompanyAdminInfoDTO, description: "Company info list" })
	@ApiBadRequestResponse({ type: ErrorResponseDTO, description: "Invalid request data." })
	async getAll(@Query() pageOptions: PageOptionsDTO): Promise<PageDTO<CompanyAdminInfoDTO>> {
		return this.companyService.findAll(pageOptions);
	}

	/**
	 * GET /company/:id
	 *
	 * Gibt ein einzelnes Unternehmen anhand seiner ID zurück.
	 */
	@Get(":id")
	@UseJWTWithApiKeyAuthorization({ permissions: [PermissionCodes.GLOBAL_ADMIN, PermissionCodes.ADMIN] })
	@ApiOperation({
		summary: "Get company by ID",
		description: `**PERMISSIONS: GLOBAL_ADMIN, ADMIN**`,
	})
	@ApiOkResponse({ type: CompanyAdminInfoDTO, description: "Company info" })
	@ApiBadRequestResponse({ type: ErrorResponseDTO, description: "Invalid request data." })
	async findOne(@Param("id") id: string): Promise<CompanyAdminInfoDTO> {
		return this.companyService.findOne(+id);
	}

	/**
	 * PATCH /company/:id
	 *
	 * Aktualisiert ein Unternehmen als Admin/Global Admin.
	 */
	@Patch(":id")
	@UseJWTWithApiKeyAuthorization({ permissions: [PermissionCodes.GLOBAL_ADMIN, PermissionCodes.ADMIN] })
	@ApiOperation({
		summary: "Upload image",
		description: "Receives image file and uploads it to AWS S3 bucket",
	})
	@ApiCreatedResponse({ type: FileUploadResponseDto })
	update(@Param() params: { id: number }, @Body() data: UpdateCompanyDTO) {
		return this.companyService.updateAsAdmin(params.id, data);
	}

	/**
	 * PATCH /company
	 *
	 * Aktualisiert die eigene Firma (durch Rolle COMPANY).
	 */
	@Patch()
	@UseJWTWithApiKeyAuthorization({ permissions: [PermissionCodes.COMPANY] })
	@UseInterceptors(FileInterceptor("file"))
	@ApiOperation({
		summary: "Upload image",
		description: "Receives image file and uploads it to AWS S3 bucket",
	})
	@ApiCreatedResponse({ type: FileUploadResponseDto })
	upload(@Request() { user }: RequestWithUser, @Body() data: UpdateCompanyDTO) {
		return this.companyService.update(data, user);
	}

	/**
	 * DELETE /company/:id
	 *
	 * Löscht ein Unternehmen anhand der ID.
	 */
	@Delete(":id")
	@UseJWTWithApiKeyAuthorization({
		permissions: [PermissionCodes.COMPANY, PermissionCodes.GLOBAL_ADMIN, PermissionCodes.ADMIN],
	})
	@UseInterceptors(FileInterceptor("file"))
	@ApiOperation({
		summary: "Upload image",
		description: "Receives image file and uploads it to AWS S3 bucket",
	})
	@ApiCreatedResponse({ type: FileUploadResponseDto })
	delete(@Param() params: { id: number }, @Request() { user }: RequestWithUser) {
		return this.companyService.delete(params.id, user);
	}
}
