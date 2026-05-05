"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const jwt_1 = require("@nestjs/jwt");
const passport_1 = require("@nestjs/passport");
const users_module_1 = require("../users/users.module");
const jwt_config_1 = require("./config/jwt.config");
const auth_service_1 = require("./auth.service");
const email_strategy_1 = require("./strategies/email.strategy");
const jwt_two_factor_strategy_1 = require("./strategies/jwt-two-factor.strategy");
const jwt_strategy_1 = require("./strategies/jwt.strategy");
const caching_module_1 = require("../caching/caching.module");
const jwt_api_key_guard_1 = require("./guards/jwt-api-key.guard");
const jwt_options_service_1 = require("./jwt-options.service");
const jwt_refresh_auth_strategy_1 = require("./strategies/jwt-refresh-auth-strategy");
const jwt_two_factor_otp_strategy_1 = require("./strategies/jwt-two-factor-otp.strategy");
let AuthModule = class AuthModule {
};
exports.AuthModule = AuthModule;
exports.AuthModule = AuthModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                load: [jwt_config_1.default],
            }),
            passport_1.PassportModule,
            config_1.ConfigModule,
            (0, common_1.forwardRef)(() => users_module_1.UsersModule),
            jwt_1.JwtModule.registerAsync({
                imports: [
                    config_1.ConfigModule.forRoot({
                        load: [jwt_config_1.default],
                    }),
                ],
                global: true,
                useClass: jwt_options_service_1.JWTOptionsService,
            }),
            (0, common_1.forwardRef)(() => caching_module_1.CachingModule),
        ],
        providers: [
            auth_service_1.AuthService,
            email_strategy_1.EmailStrategy,
            jwt_strategy_1.JwtStrategy,
            jwt_two_factor_strategy_1.JwtTwoFactorStrategy,
            jwt_api_key_guard_1.JwtAndApiKeyGuard,
            jwt_refresh_auth_strategy_1.JwtRefreshAuthStrategy,
            jwt_two_factor_otp_strategy_1.JwtTwoFactorOtpStrategy,
        ],
        exports: [auth_service_1.AuthService, jwt_1.JwtModule],
    })
], AuthModule);
//# sourceMappingURL=auth.module.js.map