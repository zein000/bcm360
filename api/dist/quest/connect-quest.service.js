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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConnectQuestService = void 0;
const info_for_quest_caching_service_1 = require("../caching/services/info-for-quest-caching.service");
const common_1 = require("@nestjs/common");
let ConnectQuestService = class ConnectQuestService {
    constructor(infoCache) {
        this.infoCache = infoCache;
    }
    genPin() {
        return Math.floor(1000 + Math.random() * 9000).toString();
    }
    async packProgressIdTokenUserId() {
        const id = await this.infoCache.getProgressID();
        const token = await this.infoCache.getToken();
        const userId = await this.infoCache.getCurrentUserId();
        const pack = [token, id, userId];
        return pack.toString();
    }
    async cacheProgressIdUserId(progId, userId) {
        await this.infoCache.setProgressID(progId);
        await this.infoCache.setCurrentUserId(userId.toString());
    }
    async cacheToken(query) {
        const parsed = JSON.parse(query);
        const token = parsed.token;
        await this.infoCache.setToken(token);
    }
    async cachePinTokenProgIdUserId() {
        let pin = this.genPin();
        const packed = await this.packProgressIdTokenUserId();
        await this.infoCache.setPin(pin, packed);
    }
    async getPin() {
        await this.cachePinTokenProgIdUserId();
        return await this.infoCache.scanForPin();
    }
    async getPerPin(pin) {
        return await this.infoCache.getTokenID(pin);
    }
};
exports.ConnectQuestService = ConnectQuestService;
exports.ConnectQuestService = ConnectQuestService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [info_for_quest_caching_service_1.InfoForQuestCachingService])
], ConnectQuestService);
//# sourceMappingURL=connect-quest.service.js.map