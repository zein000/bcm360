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
exports.BlacklistJwtCachingService = void 0;
const common_1 = require("@nestjs/common");
const cache_manager_1 = require("@nestjs/cache-manager");
const caching_config_1 = require("../config/caching.config");
const caching_service_1 = require("../caching.service");
let BlacklistJwtCachingService = class BlacklistJwtCachingService extends caching_service_1.CachingService {
    constructor(config, cacheManager) {
        super(cacheManager, "bl_jwt", config.ttl);
    }
    async setBlacklistedJwt(data) {
        await this.set(data.value.toString(), JSON.stringify({
            userId: data.userId,
            issuedAt: data.issuedAt,
            expiresAt: data.expiresAt,
        }));
    }
    async getBlacklistedJwt(jwt) {
        const res = await this.get(jwt.toString());
        if (res) {
            return JSON.parse(res);
        }
        return null;
    }
    async deleteBlacklistedJwt(jwt) {
        await this.del(jwt);
    }
};
exports.BlacklistJwtCachingService = BlacklistJwtCachingService;
exports.BlacklistJwtCachingService = BlacklistJwtCachingService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(caching_config_1.default.KEY)),
    __param(1, (0, common_1.Inject)(cache_manager_1.CACHE_MANAGER)),
    __metadata("design:paramtypes", [void 0, Object])
], BlacklistJwtCachingService);
//# sourceMappingURL=blacklist-caching.service.js.map