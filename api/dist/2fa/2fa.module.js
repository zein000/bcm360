"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TwoFactorAuthenticationModule = void 0;
const common_1 = require("@nestjs/common");
const users_module_1 = require("../users/users.module");
const auth_module_1 = require("../auth/auth.module");
const _2fa_service_1 = require("./2fa.service");
const _2fa_controller_1 = require("./2fa.controller");
const caching_module_1 = require("../caching/caching.module");
let TwoFactorAuthenticationModule = class TwoFactorAuthenticationModule {
};
exports.TwoFactorAuthenticationModule = TwoFactorAuthenticationModule;
exports.TwoFactorAuthenticationModule = TwoFactorAuthenticationModule = __decorate([
    (0, common_1.Module)({
        imports: [
            (0, common_1.forwardRef)(() => users_module_1.UsersModule),
            (0, common_1.forwardRef)(() => auth_module_1.AuthModule),
            (0, common_1.forwardRef)(() => caching_module_1.CachingModule),
        ],
        controllers: [_2fa_controller_1.TwoFactorAuthenticationController],
        providers: [_2fa_service_1.TwoFactorAuthenticationService],
        exports: [_2fa_service_1.TwoFactorAuthenticationService],
    })
], TwoFactorAuthenticationModule);
//# sourceMappingURL=2fa.module.js.map