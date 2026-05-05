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
exports.FeaturesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const error_response_dto_1 = require("../auth/dto/error-response.dto");
const jwt_api_decorators_decorator_1 = require("../common/decorators/jwt-api-decorators.decorator");
const features_response_dto_1 = require("./dtos/features-response.dto");
const features_service_1 = require("./features.service");
let FeaturesController = class FeaturesController {
    constructor(featuresService) {
        this.featuresService = featuresService;
    }
    getFeatures({ user }) {
        return this.featuresService.getFeatures(user);
    }
    getFeaturesWithoutPermission() {
        return this.featuresService.getFeatures();
    }
};
exports.FeaturesController = FeaturesController;
__decorate([
    (0, common_1.Get)(),
    (0, jwt_api_decorators_decorator_1.UseJWTWithApiKeyAuthorization)({}),
    (0, swagger_1.ApiOperation)({
        summary: "Get Features",
    }),
    (0, swagger_1.ApiOkResponse)({ type: features_response_dto_1.FeaturesResponseDto, description: "KPI data" }),
    (0, swagger_1.ApiNotFoundResponse)({ type: error_response_dto_1.ErrorResponseDTO, description: "Data not found" }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], FeaturesController.prototype, "getFeatures", null);
__decorate([
    (0, common_1.Get)("UNAUTHENTICATED"),
    (0, swagger_1.ApiOperation)({
        summary: "Get Features",
    }),
    (0, swagger_1.ApiOkResponse)({ type: features_response_dto_1.FeaturesResponseDto, description: "KPI data" }),
    (0, swagger_1.ApiNotFoundResponse)({ type: error_response_dto_1.ErrorResponseDTO, description: "Data not found" }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], FeaturesController.prototype, "getFeaturesWithoutPermission", null);
exports.FeaturesController = FeaturesController = __decorate([
    (0, common_1.Controller)("features"),
    __metadata("design:paramtypes", [features_service_1.FeaturesService])
], FeaturesController);
//# sourceMappingURL=features.controller.js.map