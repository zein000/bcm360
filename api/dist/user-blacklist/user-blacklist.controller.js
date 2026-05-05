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
exports.UserBlacklistController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const user_blacklist_jtw_request_dto_1 = require("./dto/user-blacklist-jtw-request.dto");
const error_response_dto_1 = require("../auth/dto/error-response.dto");
const jwt_api_decorators_decorator_1 = require("../common/decorators/jwt-api-decorators.decorator");
const base_response_dto_1 = require("../common/dto/base-response.dto");
const codes_1 = require("../permissions/enum/codes");
const user_blacklist_service_1 = require("./user-blacklist.service");
let UserBlacklistController = class UserBlacklistController {
    constructor(jwtService) {
        this.jwtService = jwtService;
    }
    async blacklistJwt(data) {
        return this.jwtService.blacklistJwt(data.jwt);
    }
};
exports.UserBlacklistController = UserBlacklistController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({
        description: `Endpoint to blacklist jwt token.**PERMISSIONS: ${codes_1.PermissionCodes.BLACKLIST_JWT}**`,
        summary: "Invalidate blacklist jwt token",
    }),
    (0, jwt_api_decorators_decorator_1.UseJWTWithApiKeyAuthorization)({ permissions: [codes_1.PermissionCodes.BLACKLIST_JWT] }),
    (0, swagger_1.ApiOkResponse)({ type: (base_response_dto_1.BaseResponseDTO) }),
    (0, swagger_1.ApiBadRequestResponse)({ type: error_response_dto_1.ErrorResponseDTO, description: "Invalid request data." }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_blacklist_jtw_request_dto_1.UserBlacklistJwtRequestDto]),
    __metadata("design:returntype", Promise)
], UserBlacklistController.prototype, "blacklistJwt", null);
exports.UserBlacklistController = UserBlacklistController = __decorate([
    (0, swagger_1.ApiTags)("UserBlacklist"),
    (0, common_1.Controller)("user_blacklist"),
    __metadata("design:paramtypes", [user_blacklist_service_1.UserBlacklistService])
], UserBlacklistController);
//# sourceMappingURL=user-blacklist.controller.js.map