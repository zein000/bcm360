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
exports.JwtAndApiKeyGuard = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const user_info_caching_service_1 = require("../../caching/services/user-info-caching.service");
const scenario_progress_caching_service_1 = require("../../caching/services/scenario-progress-caching.service");
const jwt_two_factor_guard_1 = require("./jwt-two-factor.guard");
const base_roles_1 = require("../../roles/constants/base-roles");
const role_enum_1 = require("../../enums/role.enum");
const getUnique_1 = require("../../course-progress/utils/getUnique");
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
let JwtAndApiKeyGuard = class JwtAndApiKeyGuard {
    constructor(userInfoCachingService, scenarioProgressCachingService, jwtService) {
        this.userInfoCachingService = userInfoCachingService;
        this.scenarioProgressCachingService = scenarioProgressCachingService;
        this.jwtService = jwtService;
    }
    async canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const authHeader = request.headers["authorization"];
        if (authHeader && authHeader.startsWith("Bearer ")) {
            const jwtGuard = new jwt_two_factor_guard_1.JwtTwoFactorGuard();
            const isAllowed = await this.checkIfParticipant(authHeader, request);
            if (isAllowed)
                return true;
            const jwtCanActivate = await jwtGuard.canActivate(context);
            if (jwtCanActivate)
                return true;
            throw new common_1.UnauthorizedException("Invalid or expired JWT.");
        }
        const apiKey = request.headers["api-key"];
        if (!apiKey || !UUID_REGEX.test(apiKey)) {
            throw new common_1.UnauthorizedException("API key is missing or invalid.");
        }
        const user = await this.userInfoCachingService.getUserByApiKey(apiKey);
        if (!(user === null || user === void 0 ? void 0 : user.dataValues) && !(user === null || user === void 0 ? void 0 : user.id)) {
            throw new common_1.UnauthorizedException("Invalid API key.");
        }
        request.user = (user === null || user === void 0 ? void 0 : user.dataValues) ? user.dataValues : user;
        return true;
    }
    async checkIfParticipant(authHeader, request) {
        var _a, _b, _c, _d;
        const token = authHeader === null || authHeader === void 0 ? void 0 : authHeader.split(" ")[1];
        if (!token)
            return false;
        const payload = await this.jwtService.verifyAsync(token);
        if ((payload === null || payload === void 0 ? void 0 : payload.courseProgressId) && (payload === null || payload === void 0 ? void 0 : payload.id)) {
            const scenarioProgress = await this.scenarioProgressCachingService.getScenarioProgress(payload.courseProgressId, true);
            const participant = scenarioProgress.users.find((user) => user.id === payload.id && !user.isRemoved);
            if (participant) {
                request.user = {
                    id: payload.id,
                    firstName: (_a = participant.firstName) !== null && _a !== void 0 ? _a : "",
                    lastName: (_b = participant.lastName) !== null && _b !== void 0 ? _b : "",
                    email: (_c = participant.email) !== null && _c !== void 0 ? _c : "",
                    role: {
                        code: role_enum_1.ERole.PARTICIPANT,
                        permissions: (0, getUnique_1.getUnique)(base_roles_1.participantPermissionCodes, (_d = participant === null || participant === void 0 ? void 0 : participant.permissions) !== null && _d !== void 0 ? _d : []).map((code) => ({ code })),
                    },
                    isAccepted: !!participant.isAccepted,
                    isActive: !!participant.isActive,
                    courseProgressId: payload.courseProgressId,
                    isRemoved: !!participant.isRemoved,
                    token,
                };
                return true;
            }
        }
        return false;
    }
};
exports.JwtAndApiKeyGuard = JwtAndApiKeyGuard;
exports.JwtAndApiKeyGuard = JwtAndApiKeyGuard = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(user_info_caching_service_1.UserInfoCachingService)),
    __param(1, (0, common_1.Inject)(scenario_progress_caching_service_1.ScenarioProgressCachingService)),
    __param(2, (0, common_1.Inject)(jwt_1.JwtService)),
    __metadata("design:paramtypes", [user_info_caching_service_1.UserInfoCachingService,
        scenario_progress_caching_service_1.ScenarioProgressCachingService,
        jwt_1.JwtService])
], JwtAndApiKeyGuard);
//# sourceMappingURL=jwt-api-key.guard.js.map