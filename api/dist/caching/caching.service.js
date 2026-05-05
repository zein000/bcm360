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
var CachingService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CachingService = void 0;
const cache_manager_1 = require("@nestjs/cache-manager");
const common_1 = require("@nestjs/common");
let CachingService = CachingService_1 = class CachingService {
    constructor(cacheManager, cacheName, ttl) {
        this.cacheManager = cacheManager;
        this.cacheName = cacheName;
        this.ttl = ttl;
        this.logger = new common_1.Logger(CachingService_1.name);
    }
    async set(key, data) {
        try {
            await this.cacheManager.set(this.buildKey(this.cacheName, key), data, this.ttl * 1000);
        }
        catch (error) {
            this.logger.error(error, "Failed to save data to %s cache for %s", this.cacheName, key);
            return;
        }
        return data;
    }
    async get(key) {
        try {
            return await this.cacheManager.get(this.buildKey(this.cacheName, key));
        }
        catch (error) {
            this.logger.error(error, "Failed to get data from %s cache for %s", this.cacheName, key);
            return;
        }
    }
    async del(key) {
        try {
            await this.cacheManager.del(this.buildKey(this.cacheName, key));
        }
        catch (error) {
            this.logger.error(error, "Failed to delete data from %s cache for %s", this.cacheName, key);
        }
    }
    buildKey(name, uniqueKey) {
        return `${name}:${uniqueKey}`;
    }
};
exports.CachingService = CachingService;
exports.CachingService = CachingService = CachingService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(cache_manager_1.CACHE_MANAGER)),
    __metadata("design:paramtypes", [Object, String, Number])
], CachingService);
//# sourceMappingURL=caching.service.js.map