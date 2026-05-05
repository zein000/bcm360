"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RolesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const error_response_dto_1 = require("../auth/dto/error-response.dto");
const jwt_api_decorators_decorator_1 = require("../common/decorators/jwt-api-decorators.decorator");
const dto_1 = require("../common/dto");
const role_info_dto_1 = require("./dto/role-info.dto");
const roles_service_1 = require("./roles.service");
const create_role_dto_1 = require("./dto/create-role.dto");
const paginated_roles_dto_1 = require("./dto/paginated-roles.dto");
const update_role_dto_1 = require("./dto/update-role.dto");
const codes_1 = require("../permissions/enum/codes");
const assign_unassign_permissions_dto_1 = require("./dto/assign-unassign-permissions.dto");
const role_id_dto_1 = require("./dto/role-id.dto");
let RolesController = class RolesController {
    constructor(rolesService) {
        this.rolesService = rolesService;
    }
    createRole(data) {
        return this.rolesService.create(data);
    }
    findAll({ user }, pageOptions) {
        return this.rolesService.findAll(user, pageOptions);
    }
    findOneById({ id }) {
        return this.rolesService.findOneById(id);
    }
    updateRole({ id }, data) {
        return this.rolesService.update(id, data);
    }
    deleteRole({ id }) {
        return this.rolesService.delete(id);
    }
    assignPermissions({ id }, data) {
        return this.rolesService.assignPermissions(id, data);
    }
    unassignPermissions({ id }, data) {
        return this.rolesService.unassignPermissions(id, data);
    }
};
exports.RolesController = RolesController;
__decorate([
    (0, common_1.Post)(),
    (0, jwt_api_decorators_decorator_1.UseJWTWithApiKeyAuthorization)({ permissions: [codes_1.PermissionCodes.CREATE_ROLE] }),
    (0, swagger_1.ApiOperation)({
        summary: "Create role",
        description: `**PERMISSIONS: ${codes_1.PermissionCodes.CREATE_ROLE}**`,
    }),
    (0, swagger_1.ApiOkResponse)({ type: role_info_dto_1.RoleInfoDTO, description: "Role information" }),
    (0, swagger_1.ApiBadRequestResponse)({ type: error_response_dto_1.ErrorResponseDTO, description: "Invalid request data." }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_role_dto_1.CreateRoleDTO]),
    __metadata("design:returntype", Promise)
], RolesController.prototype, "createRole", null);
__decorate([
    (0, common_1.Get)(),
    (0, jwt_api_decorators_decorator_1.UseJWTWithApiKeyAuthorization)({ permissions: [codes_1.PermissionCodes.READ_ROLES] }),
    (0, swagger_1.ApiOperation)({
        summary: "Get all roles",
        description: `**PERMISSIONS: ${codes_1.PermissionCodes.CREATE_ROLE}**\n\nAdmin gets all roles`,
    }),
    (0, swagger_1.ApiOkResponse)({
        type: paginated_roles_dto_1.PaginatedRolesDTO,
        description: "Paginated list of roles with pagination metadata.",
    }),
    (0, swagger_1.ApiBadRequestResponse)({ type: error_response_dto_1.ErrorResponseDTO, description: "Invalid request data." }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, dto_1.PageOptionsDTO]),
    __metadata("design:returntype", Promise)
], RolesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(":id"),
    (0, jwt_api_decorators_decorator_1.UseJWTWithApiKeyAuthorization)({ permissions: [codes_1.PermissionCodes.READ_ROLES] }),
    (0, swagger_1.ApiOperation)({
        summary: "Get role",
        description: `**PERMISSIONS: ${codes_1.PermissionCodes.READ_ROLES}**`,
    }),
    (0, swagger_1.ApiOkResponse)({ type: role_info_dto_1.RoleInfoDTO, description: "Role information" }),
    __param(0, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [role_id_dto_1.RoleIdDTO]),
    __metadata("design:returntype", Promise)
], RolesController.prototype, "findOneById", null);
__decorate([
    (0, common_1.Patch)(":id"),
    (0, jwt_api_decorators_decorator_1.UseJWTWithApiKeyAuthorization)({ permissions: [codes_1.PermissionCodes.UPDATE_ROLE] }),
    (0, swagger_1.ApiOperation)({
        summary: "Update Role data",
        description: `**PERMISSIONS: ${codes_1.PermissionCodes.UPDATE_ROLE}**`,
    }),
    (0, swagger_1.ApiOkResponse)({ type: role_info_dto_1.RoleInfoDTO, description: "Role information" }),
    (0, swagger_1.ApiBadRequestResponse)({ type: error_response_dto_1.ErrorResponseDTO, description: "Invalid request data." }),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [role_id_dto_1.RoleIdDTO, update_role_dto_1.UpdateRoleDTO]),
    __metadata("design:returntype", Promise)
], RolesController.prototype, "updateRole", null);
__decorate([
    (0, common_1.Delete)(":id"),
    (0, jwt_api_decorators_decorator_1.UseJWTWithApiKeyAuthorization)({ permissions: [codes_1.PermissionCodes.DELETE_ROLE] }),
    (0, swagger_1.ApiOperation)({
        summary: "Delete role",
        description: `**PERMISSIONS: ${codes_1.PermissionCodes.DELETE_ROLE}**`,
    }),
    (0, swagger_1.ApiOkResponse)({ type: roles_service_1.RolesService["delete"], description: "Role information" }),
    (0, swagger_1.ApiBadRequestResponse)({ type: error_response_dto_1.ErrorResponseDTO, description: "Invalid request data." }),
    __param(0, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [role_id_dto_1.RoleIdDTO]),
    __metadata("design:returntype", void 0)
], RolesController.prototype, "deleteRole", null);
__decorate([
    (0, common_1.Post)(":id/permissions"),
    (0, jwt_api_decorators_decorator_1.UseJWTWithApiKeyAuthorization)({ permissions: [codes_1.PermissionCodes.UPDATE_ROLE] }),
    (0, swagger_1.ApiOperation)({
        summary: "Assign permissions to role",
        description: `**PERMISSIONS: ${codes_1.PermissionCodes.UPDATE_ROLE}**`,
    }),
    (0, swagger_1.ApiOkResponse)({ type: role_info_dto_1.RoleInfoDTO, description: "Role information" }),
    (0, swagger_1.ApiBadRequestResponse)({ type: error_response_dto_1.ErrorResponseDTO, description: "Invalid request data." }),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [role_id_dto_1.RoleIdDTO,
        assign_unassign_permissions_dto_1.AssignUnassignPermissionsDTO]),
    __metadata("design:returntype", Promise)
], RolesController.prototype, "assignPermissions", null);
__decorate([
    (0, common_1.Delete)(":id/permissions"),
    (0, jwt_api_decorators_decorator_1.UseJWTWithApiKeyAuthorization)({ permissions: [codes_1.PermissionCodes.UPDATE_ROLE] }),
    (0, swagger_1.ApiOperation)({
        summary: "Unassign permissions from role",
        description: `**PERMISSIONS: ${codes_1.PermissionCodes.UPDATE_ROLE}**`,
    }),
    (0, swagger_1.ApiOkResponse)({ type: role_info_dto_1.RoleInfoDTO, description: "Role information" }),
    (0, swagger_1.ApiBadRequestResponse)({ type: error_response_dto_1.ErrorResponseDTO, description: "Invalid request data." }),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [role_id_dto_1.RoleIdDTO,
        assign_unassign_permissions_dto_1.AssignUnassignPermissionsDTO]),
    __metadata("design:returntype", Promise)
], RolesController.prototype, "unassignPermissions", null);
exports.RolesController = RolesController = __decorate([
    (0, swagger_1.ApiTags)("Roles"),
    (0, common_1.Controller)("roles"),
    __metadata("design:paramtypes", [roles_service_1.RolesService])
], RolesController);
//# sourceMappingURL=roles.controller.js.map