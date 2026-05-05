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
exports.PermissionsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const error_response_dto_1 = require("../auth/dto/error-response.dto");
const jwt_api_decorators_decorator_1 = require("../common/decorators/jwt-api-decorators.decorator");
const dto_1 = require("../common/dto");
const paginated_permissions_dto_1 = require("./dto/paginated-permissions.dto");
const permission_info_dto_1 = require("./dto/permission-info.dto");
const update_permission_dto_1 = require("./dto/update-permission.dto");
const codes_1 = require("./enum/codes");
const permissions_service_1 = require("./permissions.service");
let PermissionsController = class PermissionsController {
    constructor(permissionsService) {
        this.permissionsService = permissionsService;
    }
    findAll(pageOptions) {
        return this.permissionsService.findAll(pageOptions);
    }
    findOneById(id) {
        return this.permissionsService.findOneById(id);
    }
    updatePermission(id, data) {
        return this.permissionsService.update(id, data);
    }
};
exports.PermissionsController = PermissionsController;
__decorate([
    (0, common_1.Get)(),
    (0, jwt_api_decorators_decorator_1.UseJWTWithApiKeyAuthorization)({ permissions: [codes_1.PermissionCodes.GET_PERMISSION] }),
    (0, swagger_1.ApiOperation)({
        summary: "Get all permissions",
        description: `**PERMISSIONS: ${codes_1.PermissionCodes.GET_PERMISSION}**`,
    }),
    (0, swagger_1.ApiOkResponse)({
        type: paginated_permissions_dto_1.PaginatedPermissionsDTO,
        description: "Paginated list of permissions with pagination metadata.",
    }),
    (0, swagger_1.ApiBadRequestResponse)({ type: error_response_dto_1.ErrorResponseDTO, description: "Invalid request data." }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.PageOptionsDTO]),
    __metadata("design:returntype", Promise)
], PermissionsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(":id"),
    (0, jwt_api_decorators_decorator_1.UseJWTWithApiKeyAuthorization)({ permissions: [codes_1.PermissionCodes.GET_PERMISSION] }),
    (0, swagger_1.ApiOperation)({
        summary: "Get permission",
        description: `**PERMISSIONS: ${codes_1.PermissionCodes.GET_PERMISSION}**`,
    }),
    (0, swagger_1.ApiOkResponse)({ type: permission_info_dto_1.PermissionInfoDTO, description: "Permission information" }),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], PermissionsController.prototype, "findOneById", null);
__decorate([
    (0, common_1.Patch)(":id"),
    (0, jwt_api_decorators_decorator_1.UseJWTWithApiKeyAuthorization)({ permissions: [codes_1.PermissionCodes.UPDATE_PERMISSION] }),
    (0, swagger_1.ApiOperation)({
        summary: "Update Permission data",
        description: `**PERMISSIONS: ${codes_1.PermissionCodes.UPDATE_PERMISSION}**`,
    }),
    (0, swagger_1.ApiOkResponse)({ type: permission_info_dto_1.PermissionInfoDTO, description: "Permission information" }),
    (0, swagger_1.ApiBadRequestResponse)({ type: error_response_dto_1.ErrorResponseDTO, description: "Invalid request data." }),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_permission_dto_1.UpdatePermissionDTO]),
    __metadata("design:returntype", Promise)
], PermissionsController.prototype, "updatePermission", null);
exports.PermissionsController = PermissionsController = __decorate([
    (0, swagger_1.ApiTags)("Permissions"),
    (0, common_1.Controller)("permissions"),
    __metadata("design:paramtypes", [permissions_service_1.PermissionsService])
], PermissionsController);
//# sourceMappingURL=permissions.controller.js.map