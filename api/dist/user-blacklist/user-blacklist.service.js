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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserBlacklistService = void 0;
const common_1 = require("@nestjs/common");
const jwt_util_1 = require("../common/jwt.util");
const users_service_1 = require("../users/users.service");
const blacklist_caching_service_1 = require("../caching/services/blacklist-caching.service");
const jwt_exceptions_1 = require("../exceptions/jwt.exceptions");
const user_blacklist_repository_1 = require("./repositories/user-blacklist.repository");
let UserBlacklistService = class UserBlacklistService {
    constructor(blacklistRepository, userService, blacklistJwtCachingService) {
        this.blacklistRepository = blacklistRepository;
        this.userService = userService;
        this.blacklistJwtCachingService = blacklistJwtCachingService;
    }
    async blacklistJwt(jwt) {
        const existingUserBlacklist = await this.blacklistRepository.findOneByValue(jwt);
        if (existingUserBlacklist) {
            throw new jwt_exceptions_1.JwtAlreadyBlacklisted();
        }
        const jwtPayload = (0, jwt_util_1.extractJwtPayload)(jwt);
        const user = await this.userService.findOneById(jwtPayload.id);
        const newUserBlacklist = await this.blacklistRepository.create({
            userId: user.id,
            value: jwt,
            expiresAt: new Date(jwtPayload.exp * 1000),
            issuedAt: new Date(jwtPayload.iat * 1000),
        });
        await this.blacklistJwtCachingService.setBlacklistedJwt(newUserBlacklist);
        await this.blacklistRepository.save(newUserBlacklist);
        return {
            status: "ok",
        };
    }
    async findOneByValue(value) {
        return this.blacklistRepository.findOneByValue(value);
    }
    async deleteExpiredJwts() {
        var _a, e_1, _b, _c;
        const deletedUserBlacklists = await this.blacklistRepository.deleteExpired();
        try {
            for (var _d = true, deletedUserBlacklists_1 = __asyncValues(deletedUserBlacklists), deletedUserBlacklists_1_1; deletedUserBlacklists_1_1 = await deletedUserBlacklists_1.next(), _a = deletedUserBlacklists_1_1.done, !_a; _d = true) {
                _c = deletedUserBlacklists_1_1.value;
                _d = false;
                const blacklist = _c;
                await this.blacklistJwtCachingService.deleteBlacklistedJwt(blacklist.value);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (!_d && !_a && (_b = deletedUserBlacklists_1.return)) await _b.call(deletedUserBlacklists_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
    }
};
exports.UserBlacklistService = UserBlacklistService;
exports.UserBlacklistService = UserBlacklistService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, common_1.Inject)((0, common_1.forwardRef)(() => users_service_1.UsersService))),
    __param(2, (0, common_1.Inject)((0, common_1.forwardRef)(() => blacklist_caching_service_1.BlacklistJwtCachingService))),
    __metadata("design:paramtypes", [user_blacklist_repository_1.UserBlacklistRepo,
        users_service_1.UsersService,
        blacklist_caching_service_1.BlacklistJwtCachingService])
], UserBlacklistService);
//# sourceMappingURL=user-blacklist.service.js.map