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
exports.JwtRefreshAuthStrategy = void 0;
const passport_jwt_1 = require("passport-jwt");
const passport_1 = require("@nestjs/passport");
const common_1 = require("@nestjs/common");
const user_info_caching_service_1 = require("../../caching/services/user-info-caching.service");
const jwt_config_1 = require("../config/jwt.config");
let JwtRefreshAuthStrategy = class JwtRefreshAuthStrategy extends (0, passport_1.PassportStrategy)(passport_jwt_1.Strategy, "jwt-refresh-auth") {
    constructor(config, userInfoCachingService) {
        super({
            jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: config.refreshSecret,
        });
        this.userInfoCachingService = userInfoCachingService;
    }
    async validate(payload) {
        return await this.userInfoCachingService.getUser(payload.id);
    }
};
exports.JwtRefreshAuthStrategy = JwtRefreshAuthStrategy;
exports.JwtRefreshAuthStrategy = JwtRefreshAuthStrategy = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(jwt_config_1.default.KEY)),
    __metadata("design:paramtypes", [void 0, user_info_caching_service_1.UserInfoCachingService])
], JwtRefreshAuthStrategy);
//# sourceMappingURL=jwt-refresh-auth-strategy.js.map