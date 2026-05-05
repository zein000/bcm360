"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UseJWTWithApiKeyAuthorization = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const permission_guard_1 = require("../guards/permission.guard");
const features_guard_1 = require("../../features/guards/features.guard");
const error_response_dto_1 = require("../../auth/dto/error-response.dto");
const role_guard_1 = require("../guards/role.guard");
const jwt_api_key_guard_1 = require("../../auth/guards/jwt-api-key.guard");
const UseJWTWithApiKeyAuthorization = ({ roles, permissions, description, feature, }) => {
    return (0, common_1.applyDecorators)((0, common_1.UseGuards)(jwt_api_key_guard_1.JwtAndApiKeyGuard), (0, common_1.UseGuards)(...[
        roles ? (0, role_guard_1.RoleGuard)(roles) : null,
        permissions ? (0, permission_guard_1.PermissionGuard)(permissions) : null,
        feature ? (0, features_guard_1.FeaturesGuard)(feature) : null,
    ].filter((record) => record)), (0, swagger_1.ApiBearerAuth)(), (0, swagger_1.ApiUnauthorizedResponse)({ type: error_response_dto_1.ErrorResponseDTO, description: "Invalid JWT token" }), (0, swagger_1.ApiForbiddenResponse)({
        type: error_response_dto_1.ErrorResponseDTO,
        description: "Endpoint access forbidden for role.",
    }), (0, swagger_1.ApiNotFoundResponse)({ type: error_response_dto_1.ErrorResponseDTO, description: description || "User not found." }));
};
exports.UseJWTWithApiKeyAuthorization = UseJWTWithApiKeyAuthorization;
//# sourceMappingURL=jwt-api-decorators.decorator.js.map