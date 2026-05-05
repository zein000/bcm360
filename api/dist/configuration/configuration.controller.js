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
exports.ConfigurationController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_api_decorators_decorator_1 = require("../common/decorators/jwt-api-decorators.decorator");
const codes_1 = require("../permissions/enum/codes");
const configuration_service_1 = require("./configuration.service");
const add_configuration_request_dto_1 = require("./dtos/add-configuration-request.dto");
const configuration_param_request_dto_1 = require("./dtos/configuration-param-request.dto");
const configuration_response_dto_1 = require("./dtos/configuration-response.dto");
const update_configuration_request_dto_1 = require("./dtos/update-configuration-request.dto");
let ConfigurationController = class ConfigurationController {
    constructor(configService) {
        this.configService = configService;
    }
    findAll() {
        return this.configService.findAll();
    }
    find({ name }, { user }) {
        return this.configService.find(name, user.companyId);
    }
    createConfig({ user }, { name, value }) {
        return this.configService.create(user, name, value);
    }
    upsertConfig({ name }, { user }, { value }) {
        return this.configService.upsert(user, name, value);
    }
    updateConfig({ name }, { user }, { value }) {
        return this.configService.update(user, name, value);
    }
    deleteConfig({ name }, { user }) {
        return this.configService.delete(user, name);
    }
};
exports.ConfigurationController = ConfigurationController;
__decorate([
    (0, common_1.Get)(),
    (0, jwt_api_decorators_decorator_1.UseJWTWithApiKeyAuthorization)({ permissions: [codes_1.PermissionCodes.MANAGE_CONFIGURATION] }),
    (0, swagger_1.ApiOperation)({
        description: "Admin gets all configurations",
        summary: "Get all configurations",
    }),
    (0, swagger_1.ApiOkResponse)({
        type: configuration_response_dto_1.ConfigurationResponseDTO,
        isArray: true,
        description: "Configuration data",
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ConfigurationController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(":name"),
    (0, jwt_api_decorators_decorator_1.UseJWTWithApiKeyAuthorization)({ permissions: [codes_1.PermissionCodes.MANAGE_CONFIGURATION] }),
    (0, swagger_1.ApiOperation)({
        description: "Admin gets configuration by name",
        summary: "Get configuration by name",
    }),
    (0, swagger_1.ApiOkResponse)({ type: configuration_response_dto_1.ConfigurationResponseDTO, description: "Configuration data" }),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [configuration_param_request_dto_1.ConfigurationParamRequestDTO, Object]),
    __metadata("design:returntype", void 0)
], ConfigurationController.prototype, "find", null);
__decorate([
    (0, common_1.Post)(),
    (0, jwt_api_decorators_decorator_1.UseJWTWithApiKeyAuthorization)({ permissions: [codes_1.PermissionCodes.MANAGE_CONFIGURATION] }),
    (0, swagger_1.ApiOperation)({
        description: "Admin creates configuration",
        summary: "Create configuration",
    }),
    (0, swagger_1.ApiCreatedResponse)({ type: configuration_response_dto_1.ConfigurationResponseDTO, description: "Configuration data" }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, add_configuration_request_dto_1.AddConfigurationRequestDTO]),
    __metadata("design:returntype", void 0)
], ConfigurationController.prototype, "createConfig", null);
__decorate([
    (0, common_1.Put)(":name"),
    (0, jwt_api_decorators_decorator_1.UseJWTWithApiKeyAuthorization)({ permissions: [codes_1.PermissionCodes.MANAGE_CONFIGURATION] }),
    (0, swagger_1.ApiOperation)({
        description: "Admin creates or updates configuration",
        summary: "Create or update configuration",
    }),
    (0, swagger_1.ApiOkResponse)({ type: configuration_response_dto_1.ConfigurationResponseDTO, description: "Configuration data" }),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [configuration_param_request_dto_1.ConfigurationParamRequestDTO, Object, update_configuration_request_dto_1.UpdateConfigurationRequestDTO]),
    __metadata("design:returntype", void 0)
], ConfigurationController.prototype, "upsertConfig", null);
__decorate([
    (0, common_1.Patch)(":name"),
    (0, jwt_api_decorators_decorator_1.UseJWTWithApiKeyAuthorization)({ permissions: [codes_1.PermissionCodes.MANAGE_CONFIGURATION] }),
    (0, swagger_1.ApiOperation)({
        description: "Admin updates configuration",
        summary: "Update configuration",
    }),
    (0, swagger_1.ApiOkResponse)({ type: configuration_response_dto_1.ConfigurationResponseDTO, description: "Configuration data" }),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [configuration_param_request_dto_1.ConfigurationParamRequestDTO, Object, update_configuration_request_dto_1.UpdateConfigurationRequestDTO]),
    __metadata("design:returntype", void 0)
], ConfigurationController.prototype, "updateConfig", null);
__decorate([
    (0, common_1.Delete)(":name"),
    (0, jwt_api_decorators_decorator_1.UseJWTWithApiKeyAuthorization)({ permissions: [codes_1.PermissionCodes.MANAGE_CONFIGURATION] }),
    (0, swagger_1.ApiOperation)({
        description: "Admin deletes configuration",
        summary: "Delete configuration",
    }),
    (0, swagger_1.ApiOkResponse)({ type: configuration_response_dto_1.ConfigurationResponseDTO, description: "Configuration data" }),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [configuration_param_request_dto_1.ConfigurationParamRequestDTO, Object]),
    __metadata("design:returntype", void 0)
], ConfigurationController.prototype, "deleteConfig", null);
exports.ConfigurationController = ConfigurationController = __decorate([
    (0, swagger_1.ApiTags)("Configurations"),
    (0, common_1.Controller)("configurations"),
    __metadata("design:paramtypes", [configuration_service_1.ConfigurationService])
], ConfigurationController);
//# sourceMappingURL=configuration.controller.js.map