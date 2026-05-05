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
var CompanyController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompanyController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const platform_express_1 = require("@nestjs/platform-express");
const jwt_api_decorators_decorator_1 = require("../common/decorators/jwt-api-decorators.decorator");
const codes_1 = require("../permissions/enum/codes");
const file_upload_response_dto_1 = require("../file/dtos/file-upload-response.dto");
const error_response_dto_1 = require("../auth/dto/error-response.dto");
const dto_1 = require("../common/dto");
const company_service_1 = require("./company.service");
const company_admin_info_dto_1 = require("./dto/company-admin-info.dto");
const create_company_dto_1 = require("./dto/create-company.dto");
const update_company_dto_1 = require("./dto/update-company.dto");
let CompanyController = CompanyController_1 = class CompanyController {
    constructor(companyService) {
        this.companyService = companyService;
        this.logger = new common_1.Logger(CompanyController_1.name);
    }
    createPerson(data) {
        return this.companyService.create(data);
    }
    async getAll(pageOptions) {
        return this.companyService.findAll(pageOptions);
    }
    async findOne(id) {
        return this.companyService.findOne(+id);
    }
    update(params, data) {
        return this.companyService.updateAsAdmin(params.id, data);
    }
    upload({ user }, data) {
        return this.companyService.update(data, user);
    }
    delete(params, { user }) {
        return this.companyService.delete(params.id, user);
    }
};
exports.CompanyController = CompanyController;
__decorate([
    (0, common_1.Post)(),
    (0, jwt_api_decorators_decorator_1.UseJWTWithApiKeyAuthorization)({ permissions: [codes_1.PermissionCodes.GLOBAL_ADMIN] }),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)("file")),
    (0, swagger_1.ApiOperation)({
        summary: "Upload image",
        description: "Receives image file and uploads it to AWS S3 bucket",
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_company_dto_1.CreateCompanyDTO]),
    __metadata("design:returntype", void 0)
], CompanyController.prototype, "createPerson", null);
__decorate([
    (0, common_1.Get)(),
    (0, jwt_api_decorators_decorator_1.UseJWTWithApiKeyAuthorization)({ permissions: [codes_1.PermissionCodes.GLOBAL_ADMIN] }),
    (0, swagger_1.ApiOperation)({
        summary: "Get companies",
        description: `**PERMISSIONS: ${codes_1.PermissionCodes.GLOBAL_ADMIN}**`,
    }),
    (0, swagger_1.ApiOkResponse)({ type: company_admin_info_dto_1.CompanyAdminInfoDTO, description: "Company info list" }),
    (0, swagger_1.ApiBadRequestResponse)({ type: error_response_dto_1.ErrorResponseDTO, description: "Invalid request data." }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.PageOptionsDTO]),
    __metadata("design:returntype", Promise)
], CompanyController.prototype, "getAll", null);
__decorate([
    (0, common_1.Get)(":id"),
    (0, jwt_api_decorators_decorator_1.UseJWTWithApiKeyAuthorization)({ permissions: [codes_1.PermissionCodes.GLOBAL_ADMIN, codes_1.PermissionCodes.ADMIN] }),
    (0, swagger_1.ApiOperation)({
        summary: "Get company by ID",
        description: `**PERMISSIONS: GLOBAL_ADMIN, ADMIN**`,
    }),
    (0, swagger_1.ApiOkResponse)({ type: company_admin_info_dto_1.CompanyAdminInfoDTO, description: "Company info" }),
    (0, swagger_1.ApiBadRequestResponse)({ type: error_response_dto_1.ErrorResponseDTO, description: "Invalid request data." }),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CompanyController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(":id"),
    (0, jwt_api_decorators_decorator_1.UseJWTWithApiKeyAuthorization)({ permissions: [codes_1.PermissionCodes.GLOBAL_ADMIN, codes_1.PermissionCodes.ADMIN] }),
    (0, swagger_1.ApiOperation)({
        summary: "Upload image",
        description: "Receives image file and uploads it to AWS S3 bucket",
    }),
    (0, swagger_1.ApiCreatedResponse)({ type: file_upload_response_dto_1.FileUploadResponseDto }),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, update_company_dto_1.UpdateCompanyDTO]),
    __metadata("design:returntype", void 0)
], CompanyController.prototype, "update", null);
__decorate([
    (0, common_1.Patch)(),
    (0, jwt_api_decorators_decorator_1.UseJWTWithApiKeyAuthorization)({ permissions: [codes_1.PermissionCodes.COMPANY] }),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)("file")),
    (0, swagger_1.ApiOperation)({
        summary: "Upload image",
        description: "Receives image file and uploads it to AWS S3 bucket",
    }),
    (0, swagger_1.ApiCreatedResponse)({ type: file_upload_response_dto_1.FileUploadResponseDto }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, update_company_dto_1.UpdateCompanyDTO]),
    __metadata("design:returntype", void 0)
], CompanyController.prototype, "upload", null);
__decorate([
    (0, common_1.Delete)(":id"),
    (0, jwt_api_decorators_decorator_1.UseJWTWithApiKeyAuthorization)({
        permissions: [codes_1.PermissionCodes.COMPANY, codes_1.PermissionCodes.GLOBAL_ADMIN, codes_1.PermissionCodes.ADMIN],
    }),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)("file")),
    (0, swagger_1.ApiOperation)({
        summary: "Upload image",
        description: "Receives image file and uploads it to AWS S3 bucket",
    }),
    (0, swagger_1.ApiCreatedResponse)({ type: file_upload_response_dto_1.FileUploadResponseDto }),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], CompanyController.prototype, "delete", null);
exports.CompanyController = CompanyController = CompanyController_1 = __decorate([
    (0, common_1.Controller)("company"),
    __metadata("design:paramtypes", [company_service_1.CompanyService])
], CompanyController);
//# sourceMappingURL=company.controller.js.map