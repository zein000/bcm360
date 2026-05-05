import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Request } from "@nestjs/common";
import { ApiBadRequestResponse, ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";

import { ErrorResponseDTO } from "src/auth/dto/error-response.dto";
import { UseJWTWithApiKeyAuthorization } from "src/common/decorators/jwt-api-decorators.decorator";
import { PageOptionsDTO } from "src/common/dto";

import RequestWithUser from "src/interfaces/request-with-user.interface";
import { RoleInfoDTO } from "./dto/role-info.dto";
import { RolesService } from "./roles.service";
import { CreateRoleDTO } from "./dto/create-role.dto";
import { PaginatedRolesDTO } from "./dto/paginated-roles.dto";
import { UpdateRoleDTO } from "./dto/update-role.dto";
import { PermissionCodes } from "../permissions/enum/codes";
import { AssignUnassignPermissionsDTO } from "./dto/assign-unassign-permissions.dto";
import { RoleIdDTO } from "./dto/role-id.dto";

/**
 * Klasse: RolesController
 *
 * Dieser Controller verwaltet die REST-Endpunkte für Rollen (roles) im System.
 * Rollen sind zentrale Bestandteile des Berechtigungssystems und können mit verschiedenen
 * Permissions ausgestattet werden.
 *
 * Autorisierung:
 * - Alle Endpunkte sind mit `@UseJWTWithApiKeyAuthorization` geschützt und verlangen passende Berechtigungen.
 *
 * Unterstützte Operationen:
 * - Erstellen, Lesen, Aktualisieren und Löschen von Rollen
 * - Zuweisung und Entfernung von Berechtigungen zu einer Rolle
 */
@ApiTags("Roles")
@Controller("roles")
export class RolesController {
	constructor(private readonly rolesService: RolesService) {}

	/**
	 * POST /roles
	 *
	 * Erstellt eine neue Rolle.
	 */
	@Post()
	@UseJWTWithApiKeyAuthorization({ permissions: [PermissionCodes.CREATE_ROLE] })
	@ApiOperation({
		summary: "Create role",
		description: `**PERMISSIONS: ${PermissionCodes.CREATE_ROLE}**`,
	})
	@ApiOkResponse({ type: RoleInfoDTO, description: "Role information" })
	@ApiBadRequestResponse({ type: ErrorResponseDTO, description: "Invalid request data." })
	createRole(@Body() data: CreateRoleDTO): Promise<RoleInfoDTO> {
		return this.rolesService.create(data);
	}

	/**
	 * GET /roles
	 *
	 * Gibt alle Rollen paginiert zurück.
	 */
	@Get()
	@UseJWTWithApiKeyAuthorization({ permissions: [PermissionCodes.READ_ROLES] })
	@ApiOperation({
		summary: "Get all roles",
		description: `**PERMISSIONS: ${PermissionCodes.CREATE_ROLE}**\n\nAdmin gets all roles`,
	})
	@ApiOkResponse({
		type: PaginatedRolesDTO,
		description: "Paginated list of roles with pagination metadata.",
	})
	@ApiBadRequestResponse({ type: ErrorResponseDTO, description: "Invalid request data." })
	findAll(
		@Request() { user }: RequestWithUser,
		@Query() pageOptions: PageOptionsDTO
	): Promise<PaginatedRolesDTO> {
		return this.rolesService.findAll(user, pageOptions);
	}

	/**
	 * GET /roles/:id
	 *
	 * Gibt eine einzelne Rolle anhand der ID zurück.
	 */
	@Get(":id")
	@UseJWTWithApiKeyAuthorization({ permissions: [PermissionCodes.READ_ROLES] })
	@ApiOperation({
		summary: "Get role",
		description: `**PERMISSIONS: ${PermissionCodes.READ_ROLES}**`,
	})
	@ApiOkResponse({ type: RoleInfoDTO, description: "Role information" })
	findOneById(@Param() { id }: RoleIdDTO): Promise<RoleInfoDTO> {
		return this.rolesService.findOneById(id);
	}

	/**
	 * PATCH /roles/:id
	 *
	 * Aktualisiert eine Rolle.
	 */
	@Patch(":id")
	@UseJWTWithApiKeyAuthorization({ permissions: [PermissionCodes.UPDATE_ROLE] })
	@ApiOperation({
		summary: "Update Role data",
		description: `**PERMISSIONS: ${PermissionCodes.UPDATE_ROLE}**`,
	})
	@ApiOkResponse({ type: RoleInfoDTO, description: "Role information" })
	@ApiBadRequestResponse({ type: ErrorResponseDTO, description: "Invalid request data." })
	updateRole(@Param() { id }: RoleIdDTO, @Body() data: UpdateRoleDTO): Promise<RoleInfoDTO> {
		return this.rolesService.update(id, data);
	}

	/**
	 * DELETE /roles/:id
	 *
	 * Löscht eine Rolle anhand ihrer ID.
	 */
	@Delete(":id")
	@UseJWTWithApiKeyAuthorization({ permissions: [PermissionCodes.DELETE_ROLE] })
	@ApiOperation({
		summary: "Delete role",
		description: `**PERMISSIONS: ${PermissionCodes.DELETE_ROLE}**`,
	})
	@ApiOkResponse({ type: RolesService["delete"], description: "Role information" })
	@ApiBadRequestResponse({ type: ErrorResponseDTO, description: "Invalid request data." })
	deleteRole(@Param() { id }: RoleIdDTO): ReturnType<RolesService["delete"]> {
		return this.rolesService.delete(id);
	}

	/**
	 * POST /roles/:id/permissions
	 *
	 * Weist einer Rolle eine Liste von Berechtigungen zu.
	 */
	@Post(":id/permissions")
	@UseJWTWithApiKeyAuthorization({ permissions: [PermissionCodes.UPDATE_ROLE] })
	@ApiOperation({
		summary: "Assign permissions to role",
		description: `**PERMISSIONS: ${PermissionCodes.UPDATE_ROLE}**`,
	})
	@ApiOkResponse({ type: RoleInfoDTO, description: "Role information" })
	@ApiBadRequestResponse({ type: ErrorResponseDTO, description: "Invalid request data." })
	assignPermissions(
		@Param() { id }: RoleIdDTO,
		@Body() data: AssignUnassignPermissionsDTO
	): Promise<RoleInfoDTO> {
		return this.rolesService.assignPermissions(id, data);
	}

	/**
	 * DELETE /roles/:id/permissions
	 *
	 * Entfernt bestimmte Berechtigungen von einer Rolle.
	 */
	@Delete(":id/permissions")
	@UseJWTWithApiKeyAuthorization({ permissions: [PermissionCodes.UPDATE_ROLE] })
	@ApiOperation({
		summary: "Unassign permissions from role",
		description: `**PERMISSIONS: ${PermissionCodes.UPDATE_ROLE}**`,
	})
	@ApiOkResponse({ type: RoleInfoDTO, description: "Role information" })
	@ApiBadRequestResponse({ type: ErrorResponseDTO, description: "Invalid request data." })
	unassignPermissions(
		@Param() { id }: RoleIdDTO,
		@Body() data: AssignUnassignPermissionsDTO
	): Promise<RoleInfoDTO> {
		return this.rolesService.unassignPermissions(id, data);
	}
}
