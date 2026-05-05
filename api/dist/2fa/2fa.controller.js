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
exports.TwoFactorAuthenticationController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_api_decorators_decorator_1 = require("../common/decorators/jwt-api-decorators.decorator");
const jwt_two_factor_otp_guard_1 = require("../auth/guards/jwt-two-factor-otp.guard");
const _2fa_service_1 = require("./2fa.service");
const codes_1 = require("../permissions/enum/codes");
const clear_user_info_interceptor_1 = require("../caching/interceptors/clear-user-info.interceptor");
const code_dto_1 = require("./dto/code.dto");
let TwoFactorAuthenticationController = class TwoFactorAuthenticationController {
    constructor(twoFactorAuthenticationService) {
        this.twoFactorAuthenticationService = twoFactorAuthenticationService;
    }
    async generate(res, { user }) {
        return this.twoFactorAuthenticationService.generate2FASecret(user, res);
    }
    async authenticate({ user }, body) {
        return await this.twoFactorAuthenticationService.authenticate2FASecret(user, body);
    }
    async verify({ code }, { user }) {
        return this.twoFactorAuthenticationService.verify2FACode(user, code);
    }
    async disable({ user }, body) {
        return await this.twoFactorAuthenticationService.disable2FA(user.id, body.code);
    }
};
exports.TwoFactorAuthenticationController = TwoFactorAuthenticationController;
__decorate([
    (0, common_1.Post)("generate"),
    (0, jwt_api_decorators_decorator_1.UseJWTWithApiKeyAuthorization)({ permissions: [codes_1.PermissionCodes.GENERATE_2FA] }),
    (0, swagger_1.ApiOperation)({
        description: "Generates initial 2FA",
        summary: "Generates 2FA",
    }),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], TwoFactorAuthenticationController.prototype, "generate", null);
__decorate([
    (0, common_1.Post)("authenticate"),
    (0, common_1.UseGuards)(jwt_two_factor_otp_guard_1.JwtTwoFactorOtpGuard),
    (0, common_1.UseInterceptors)(clear_user_info_interceptor_1.ClearUserInfoCacheInterceptor),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, code_dto_1.TwoFactorAuthenticationCodeDTO]),
    __metadata("design:returntype", Promise)
], TwoFactorAuthenticationController.prototype, "authenticate", null);
__decorate([
    (0, common_1.Post)("verify"),
    (0, common_1.HttpCode)(200),
    (0, jwt_api_decorators_decorator_1.UseJWTWithApiKeyAuthorization)({ permissions: [codes_1.PermissionCodes.VERIFY_2FA] }),
    (0, common_1.UseInterceptors)(clear_user_info_interceptor_1.ClearUserInfoCacheInterceptor),
    (0, swagger_1.ApiOperation)({
        description: "Verifies the initial enabling of 2FA for the authenticated user.",
        summary: "Verifies 2FA",
    }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [code_dto_1.TwoFactorAuthenticationCodeDTO, Object]),
    __metadata("design:returntype", Promise)
], TwoFactorAuthenticationController.prototype, "verify", null);
__decorate([
    (0, common_1.Post)("disable"),
    (0, common_1.HttpCode)(200),
    (0, jwt_api_decorators_decorator_1.UseJWTWithApiKeyAuthorization)({ permissions: [codes_1.PermissionCodes.DISABLE_2FA] }),
    (0, common_1.UseInterceptors)(clear_user_info_interceptor_1.ClearUserInfoCacheInterceptor),
    (0, swagger_1.ApiOperation)({
        description: "Disables 2FA for the authenticated user",
        summary: "Disables 2FA",
    }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, code_dto_1.TwoFactorAuthenticationCodeDTO]),
    __metadata("design:returntype", Promise)
], TwoFactorAuthenticationController.prototype, "disable", null);
exports.TwoFactorAuthenticationController = TwoFactorAuthenticationController = __decorate([
    (0, swagger_1.ApiTags)("2-Factor Authentication"),
    (0, common_1.Controller)("2fa"),
    __metadata("design:paramtypes", [_2fa_service_1.TwoFactorAuthenticationService])
], TwoFactorAuthenticationController);
//# sourceMappingURL=2fa.controller.js.map