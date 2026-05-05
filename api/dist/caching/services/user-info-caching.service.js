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
exports.UserInfoCachingService = void 0;
const common_1 = require("@nestjs/common");
const cache_manager_1 = require("@nestjs/cache-manager");
const users_service_1 = require("../../users/users.service");
const caching_service_1 = require("../caching.service");
const caching_config_1 = require("../config/caching.config");
let UserInfoCachingService = class UserInfoCachingService extends caching_service_1.CachingService {
    constructor(config, cacheManager, userService) {
        super(cacheManager, "user", config.ttl);
        this.userService = userService;
    }
    async setUser(data) {
        await this.set(data.id.toString(), JSON.stringify(data));
    }
    async setUserByApiKey(data) {
        await this.set(data.apiKey, JSON.stringify(data));
    }
    async getUser(id) {
        const res = await this.get(id.toString());
        if (res) {
            return JSON.parse(res);
        }
        const user = await this.userService.findOneById(id);
        if (!user) {
            return;
        }
        await this.setUser(user);
        return user;
    }
    async getUserByApiKey(apiKey) {
        const res = await this.get(apiKey);
        if (res) {
            return JSON.parse(res);
        }
        const user = await this.userService.findOneByApiKey(apiKey);
        if (!user) {
            return;
        }
        await this.setUserByApiKey(user);
        return user;
    }
    async clearUser(data) {
        await this.del(data.id.toString());
    }
};
exports.UserInfoCachingService = UserInfoCachingService;
exports.UserInfoCachingService = UserInfoCachingService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(caching_config_1.default.KEY)),
    __param(1, (0, common_1.Inject)(cache_manager_1.CACHE_MANAGER)),
    __param(2, (0, common_1.Inject)((0, common_1.forwardRef)(() => users_service_1.UsersService))),
    __metadata("design:paramtypes", [void 0, Object, users_service_1.UsersService])
], UserInfoCachingService);
//# sourceMappingURL=user-info-caching.service.js.map