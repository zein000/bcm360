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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const _2fa_enabled_dto_1 = require("../users/dto/2fa-enabled.dto");
const user_info_dto_1 = require("../users/dto/user-info.dto");
const users_service_1 = require("../users/users.service");
const jwt_config_1 = require("./config/jwt.config");
const auth_response_dto_1 = require("./dto/auth-response.dto");
const bcrypt = require("bcryptjs");
let AuthService = class AuthService {
    constructor(usersService, jwtService, config) {
        this.usersService = usersService;
        this.jwtService = jwtService;
        this.config = config;
    }
    async validateUser(email, password) {
        const user = await this.usersService.findOneByEmail(email);
        if (user && user.password) {
            const isPasswordValid = await bcrypt.compare(password, user.password);
            return isPasswordValid ? user : null;
        }
        return null;
    }
    loginWith2fa(user, isRememberMe) {
        return new _2fa_enabled_dto_1.TwoFAEnabledDTO({
            user: new user_info_dto_1.UserInfoDTO(user),
            otpToken: this.jwtService.sign({ email: user.email }, {
                expiresIn: this.config.otpJWTExpiration || "5m",
                secret: this.config.otpSecret,
            }),
            isRememberMe,
        });
    }
    login(user, isRememberMe = false) {
        return new auth_response_dto_1.AuthResponseDTO({
            user: new user_info_dto_1.UserInfoDTO(user),
            accessToken: this.jwtService.sign({
                id: user.id,
            }),
            refreshToken: this.jwtService.sign({ id: user.id }, {
                secret: this.config.refreshSecret,
                expiresIn: this.config.refreshExpiration,
            }),
            isRememberMe,
        });
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)((0, common_1.forwardRef)(() => users_service_1.UsersService))),
    __param(2, (0, common_1.Inject)(jwt_config_1.default.KEY)),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        jwt_1.JwtService, void 0])
], AuthService);
//# sourceMappingURL=auth.service.js.map