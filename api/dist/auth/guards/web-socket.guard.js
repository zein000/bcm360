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
exports.WebSocketGuard = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const scenario_progress_caching_service_1 = require("../../caching/services/scenario-progress-caching.service");
const user_info_caching_service_1 = require("../../caching/services/user-info-caching.service");
const getUnique_1 = require("../../course-progress/utils/getUnique");
const base_roles_1 = require("../../roles/constants/base-roles");
let WebSocketGuard = class WebSocketGuard {
    constructor(jwtService, userInfoCachingService, scenarioProgressCachingService) {
        this.jwtService = jwtService;
        this.userInfoCachingService = userInfoCachingService;
        this.scenarioProgressCachingService = scenarioProgressCachingService;
    }
    async canActivate(context) {
        const client = context.switchToWs().getClient();
        const token = client.handshake.query.token;
        if (!token) {
            return false;
        }
        try {
            const isAllowed = await this.checkIfParticipant(token, client);
            if (isAllowed)
                return true;
            const decoded = this.jwtService.verify(token);
            const user = await this.userInfoCachingService.getUser(decoded === null || decoded === void 0 ? void 0 : decoded.id);
            if (!(user === null || user === void 0 ? void 0 : user.dataValues) && !(user === null || user === void 0 ? void 0 : user.id))
                return false;
            client["user"] = (user === null || user === void 0 ? void 0 : user.dataValues) ? user.dataValues : user;
            return true;
        }
        catch (error) {
            return false;
        }
    }
    async checkIfParticipant(token, request) {
        var _a, _b, _c, _d;
        const payload = await this.jwtService.verifyAsync(token);
        if ((payload === null || payload === void 0 ? void 0 : payload.courseProgressId) && (payload === null || payload === void 0 ? void 0 : payload.id)) {
            const scenarioProgress = await this.scenarioProgressCachingService.getScenarioProgress(payload.courseProgressId, true);
            const participant = scenarioProgress.users.find((user) => user.id === payload.id && !user.isRemoved);
            if (participant) {
                request["user"] = {
                    id: payload.id,
                    firstName: (_a = participant.firstName) !== null && _a !== void 0 ? _a : "",
                    lastName: (_b = participant.lastName) !== null && _b !== void 0 ? _b : "",
                    email: (_c = participant.email) !== null && _c !== void 0 ? _c : "",
                    role: {
                        permissions: (0, getUnique_1.getUnique)(base_roles_1.participantPermissionCodes, (_d = participant === null || participant === void 0 ? void 0 : participant.permissions) !== null && _d !== void 0 ? _d : []).map((code) => ({ code })),
                    },
                    isAccepted: participant.isAccepted,
                    isActive: participant.isActive,
                    isRemoved: participant.isRemoved,
                };
                return true;
            }
        }
        return false;
    }
};
exports.WebSocketGuard = WebSocketGuard;
exports.WebSocketGuard = WebSocketGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [jwt_1.JwtService,
        user_info_caching_service_1.UserInfoCachingService,
        scenario_progress_caching_service_1.ScenarioProgressCachingService])
], WebSocketGuard);
//# sourceMappingURL=web-socket.guard.js.map