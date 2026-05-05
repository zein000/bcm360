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
exports.InfoForQuestCachingService = void 0;
const caching_service_1 = require("../caching.service");
const common_1 = require("@nestjs/common");
const caching_config_1 = require("../config/caching.config");
const cache_manager_1 = require("@nestjs/cache-manager");
const ioredis_1 = require("ioredis");
let InfoForQuestCachingService = class InfoForQuestCachingService extends caching_service_1.CachingService {
    constructor(config, cacheManager) {
        super(cacheManager, "pin", 60 * 60);
        this.redisClient = new ioredis_1.default({
            host: "localhost",
            port: 6379,
            password: config.password,
        });
    }
    async scanForPin() {
        var _a, _b, _c;
        const keys = [];
        let cursor = "0";
        do {
            const [newCursor, foundKeys] = await this.redisClient.scan(cursor, "MATCH", "pin:*", "COUNT", 100);
            cursor = newCursor;
            const numericKeys = foundKeys.filter((key) => /^pin:\d+$/.test(key));
            keys.push(...numericKeys);
        } while (cursor !== "0");
        if (keys.length > 1) {
            const pinsWithTimestamps = await Promise.all(keys.map(async (key) => {
                let timestamp = await this.redisClient.get(`${key}:createdAt`);
                timestamp = timestamp.replace(/"/g, "");
                return { key, timestamp: parseInt(timestamp, 10) };
            }));
            pinsWithTimestamps.sort((a, b) => b.timestamp - a.timestamp);
            const newest = (_a = pinsWithTimestamps[0]) === null || _a === void 0 ? void 0 : _a.key;
            return newest ? newest.split(":")[1] : null;
        }
        else
            return (_c = (_b = keys[0]) === null || _b === void 0 ? void 0 : _b.split(":")[1]) !== null && _c !== void 0 ? _c : null;
    }
    async setPin(pin, pack) {
        await this.set(pin, pack);
        await this.set(`${pin}:createdAt`, Date.now().toString());
    }
    async setProgressID(id) {
        await this.set("progressId", id);
    }
    async getProgressID() {
        return await this.get("progressId");
    }
    async setCurrentUserId(id) {
        return await this.set("currentUserId", id);
    }
    async getCurrentUserId() {
        return await this.get("currentUserId");
    }
    async setToken(token) {
        await this.set("token", token);
    }
    async getToken() {
        return await this.get("token");
    }
    async getTokenID(pin) {
        return await this.get(pin.toString());
    }
};
exports.InfoForQuestCachingService = InfoForQuestCachingService;
exports.InfoForQuestCachingService = InfoForQuestCachingService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(caching_config_1.default.KEY)),
    __param(1, (0, common_1.Inject)(cache_manager_1.CACHE_MANAGER)),
    __metadata("design:paramtypes", [void 0, Object])
], InfoForQuestCachingService);
//# sourceMappingURL=info-for-quest-caching.service.js.map