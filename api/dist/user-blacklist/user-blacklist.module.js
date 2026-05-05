"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserBlacklistModule = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const users_module_1 = require("../users/users.module");
const caching_module_1 = require("../caching/caching.module");
const user_blacklist_model_1 = require("./models/user-blacklist.model");
const user_blacklist_repository_1 = require("./repositories/user-blacklist.repository");
const user_blacklist_controller_1 = require("./user-blacklist.controller");
const user_blacklist_service_1 = require("./user-blacklist.service");
let UserBlacklistModule = class UserBlacklistModule {
};
exports.UserBlacklistModule = UserBlacklistModule;
exports.UserBlacklistModule = UserBlacklistModule = __decorate([
    (0, common_1.Module)({
        imports: [
            sequelize_1.SequelizeModule.forFeature([user_blacklist_model_1.default]),
            (0, common_1.forwardRef)(() => users_module_1.UsersModule),
            (0, common_1.forwardRef)(() => caching_module_1.CachingModule),
        ],
        controllers: [user_blacklist_controller_1.UserBlacklistController],
        providers: [user_blacklist_service_1.UserBlacklistService, user_blacklist_repository_1.UserBlacklistRepo],
        exports: [user_blacklist_service_1.UserBlacklistService],
    })
], UserBlacklistModule);
//# sourceMappingURL=user-blacklist.module.js.map