import { Controller, Get, Body, Patch, Param, Query } from "@nestjs/common";
import { ApiBadRequestResponse, ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";

import { ErrorResponseDTO } from "src/auth/dto/error-response.dto";
import { UseJWTWithApiKeyAuthorization } from "src/common/decorators/jwt-api-decorators.decorator";
import { PageOptionsDTO } from "src/common/dto";

import { PaginatedPermissionsDTO } from "./dto/paginated-permissions.dto";
import { PermissionInfoDTO } from "./dto/permission-info.dto";
import { UpdatePermissionDTO } from "./dto/update-permission.dto";
import { PermissionCodes } from "./enum/codes";
import { PermissionsService } from "./permissions.service";

/**
 * Klasse: PermissionsController
 *
 * Dieser Controller stellt REST-Endpoints für das Verwalten von Berechtigungen (Permissions) zur Verfügung.
 * Die Endpunkte sind mit einer JWT-basierten Autorisierung geschützt und erfordern bestimmte Berechtigungen.
 *
 * Verwendungszweck:
 * - Abrufen aller Berechtigungen (paginierter GET)
 * - Abrufen einer einzelnen Berechtigung nach ID
 * - Aktualisierung einer Berechtigung
 *
 * Autorisierung:
 * - Jeder Endpunkt verwendet das `UseJWTWithApiKeyAuthorization`-Dekorator, um Zugriff auf bestimmte Rollen/Berechtigungen zu beschränken.
 */
@ApiTags("Permissions")
@Controller("permissions")
export class PermissionsController {
	constructor(private readonly permissionsService: PermissionsService) {}

	/**
	 * Funktion: findAll
	 *
	 * Gibt eine paginierte Liste aller Berechtigungen zurück.
	 *
	 * @param pageOptions - Paginierungsoptionen wie page, limit, sort etc.
	 * @returns Liste mit Berechtigungen und Metadaten
	 */
	@Get()
	@UseJWTWithApiKeyAuthorization({ permissions: [PermissionCodes.GET_PERMISSION] })
	@ApiOperation({
		summary: "Get all permissions",
		description: `**PERMISSIONS: ${PermissionCodes.GET_PERMISSION}**`,
	})
	@ApiOkResponse({
		type: PaginatedPermissionsDTO,
		description: "Paginated list of permissions with pagination metadata.",
	})
	@ApiBadRequestResponse({ type: ErrorResponseDTO, description: "Invalid request data." })
	findAll(@Query() pageOptions: PageOptionsDTO): Promise<PaginatedPermissionsDTO> {
		return this.permissionsService.findAll(pageOptions);
	}

	/**
	 * Funktion: findOneById
	 *
	 * Gibt Details zu einer einzelnen Berechtigung zurück.
	 *
	 * @param id - ID der Berechtigung
	 * @returns Detaillierte Informationen zur Berechtigung
	 */
	@Get(":id")
	@UseJWTWithApiKeyAuthorization({ permissions: [PermissionCodes.GET_PERMISSION] })
	@ApiOperation({
		summary: "Get permission",
		description: `**PERMISSIONS: ${PermissionCodes.GET_PERMISSION}**`,
	})
	@ApiOkResponse({ type: PermissionInfoDTO, description: "Permission information" })
	findOneById(@Param("id") id: number): Promise<PermissionInfoDTO> {
		return this.permissionsService.findOneById(id);
	}

	/**
	 * Funktion: updatePermission
	 *
	 * Aktualisiert eine vorhandene Berechtigung anhand der ID.
	 *
	 * @param id - ID der zu aktualisierenden Berechtigung
	 * @param data - Neue Werte (DTO)
	 * @returns Aktualisierte Berechtigung
	 */
	@Patch(":id")
	@UseJWTWithApiKeyAuthorization({ permissions: [PermissionCodes.UPDATE_PERMISSION] })
	@ApiOperation({
		summary: "Update Permission data",
		description: `**PERMISSIONS: ${PermissionCodes.UPDATE_PERMISSION}**`,
	})
	@ApiOkResponse({ type: PermissionInfoDTO, description: "Permission information" })
	@ApiBadRequestResponse({ type: ErrorResponseDTO, description: "Invalid request data." })
	updatePermission(
		@Param("id") id: number,
		@Body() data: UpdatePermissionDTO
	): Promise<PermissionInfoDTO> {
		return this.permissionsService.update(id, data);
	}
}
