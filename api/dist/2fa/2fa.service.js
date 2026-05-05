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
exports.TwoFactorAuthenticationService = void 0;
const common_1 = require("@nestjs/common");
const otplib_1 = require("otplib");
const qrcode_1 = require("qrcode");
const auth_service_1 = require("../auth/auth.service");
const user_exceptions_1 = require("../exceptions/user.exceptions");
const users_service_1 = require("../users/users.service");
const errors_enum_1 = require("../enums/errors.enum");
let TwoFactorAuthenticationService = class TwoFactorAuthenticationService {
    constructor(usersService, authService) {
        this.usersService = usersService;
        this.authService = authService;
    }
    async generate2FASecret(user, res) {
        const secret = otplib_1.authenticator.generateSecret();
        const otpAuthUrl = otplib_1.authenticator.keyuri(user.email, process.env.TWO_FACTOR_AUTHENTICATION_APP_NAME, secret);
        await this.usersService.set2FASecret(user.id, secret);
        return this.pipeQrCodeStream(res, otpAuthUrl);
    }
    pipeQrCodeStream(stream, otpAuthUrl) {
        return (0, qrcode_1.toFileStream)(stream, otpAuthUrl);
    }
    async is2FACodeValid(code, userId) {
        const user = await this.usersService.findOneById(userId);
        if (!user.twoFactorAuthSecret) {
            throw new user_exceptions_1.IncorrectInputDataException("Invalid two factor authentication secret");
        }
        return otplib_1.authenticator.verify({ token: code, secret: user.twoFactorAuthSecret });
    }
    async disable2FA(userId, code) {
        const isCodeValid = await this.is2FACodeValid(code, userId);
        if (!isCodeValid) {
            throw new user_exceptions_1.InvalidTokenException(errors_enum_1.Errors.INVALID_OTP_AUTH_CODE);
        }
        return this.usersService.disable2FA(userId);
    }
    async verify2FACode(user, code) {
        const isCodeValid = await this.is2FACodeValid(code, user.id);
        if (!isCodeValid) {
            throw new user_exceptions_1.InvalidTokenException(errors_enum_1.Errors.INVALID_OTP_AUTH_CODE);
        }
        return this.usersService.enable2FA(user.id);
    }
    async authenticate2FASecret(user, body) {
        const { code } = body;
        const isCodeValid = await this.is2FACodeValid(code, user.id);
        if (!isCodeValid) {
            throw new user_exceptions_1.InvalidTokenException(errors_enum_1.Errors.INVALID_OTP_AUTH_CODE);
        }
        return this.authService.login(user);
    }
};
exports.TwoFactorAuthenticationService = TwoFactorAuthenticationService;
exports.TwoFactorAuthenticationService = TwoFactorAuthenticationService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)((0, common_1.forwardRef)(() => users_service_1.UsersService))),
    __param(1, (0, common_1.Inject)((0, common_1.forwardRef)(() => auth_service_1.AuthService))),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        auth_service_1.AuthService])
], TwoFactorAuthenticationService);
//# sourceMappingURL=2fa.service.js.map