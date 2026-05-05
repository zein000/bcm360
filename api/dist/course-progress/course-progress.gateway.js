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
var CourseProgressGateway_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CourseProgressGateway = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const web_socket_guard_1 = require("../auth/guards/web-socket.guard");
const scenario_progress_caching_service_1 = require("../caching/services/scenario-progress-caching.service");
const codes_1 = require("../permissions/enum/codes");
const uuid_1 = require("uuid");
const course_progress_service_1 = require("./course-progress.service");
const AdditionalStatusInfoTags_enum_1 = require("./enum/AdditionalStatusInfoTags.enum");
const ScenarioActionTypes_enum_1 = require("./enum/ScenarioActionTypes.enum");
const ScenarioMessageTypes_enum_1 = require("./enum/ScenarioMessageTypes.enum");
const ServiceMessageType_enum_1 = require("./enum/ServiceMessageType.enum");
const SocketEvents_enum_1 = require("./enum/SocketEvents.enum");
const Status_1 = require("./enum/Status");
const connect_quest_service_1 = require("../quest/connect-quest.service");
let CourseProgressGateway = CourseProgressGateway_1 = class CourseProgressGateway {
    constructor(courseProgressService, scenarioProgressCachingService, connectQuestService) {
        this.courseProgressService = courseProgressService;
        this.scenarioProgressCachingService = scenarioProgressCachingService;
        this.connectQuestService = connectQuestService;
        this.logger = new common_1.Logger(CourseProgressGateway_1.name);
    }
    onModuleInit() {
        this.stageEndTimers = setInterval(async () => {
            await this.checkACtiveScenariosTimeBasedContent();
            await this.checkActiveScenariosTimers();
        }, 1000);
    }
    onModuleDestroy() {
        if (this.stageEndTimers) {
            clearInterval(this.stageEndTimers);
        }
    }
    emitSocketEvent(courseProgressId, action, data) {
        if (typeof courseProgressId === "string" && courseProgressId.trim()) {
            if (data) {
                return this.server.to(courseProgressId).emit(action, data);
            }
            else {
                return this.server.to(courseProgressId).emit(action);
            }
        }
        return this.server.emit(action);
    }
    async handleConnection(client) {
        this.logger.log(`Client connected: ${client.id}`);
        this.logger.log(`Headers: ${JSON.stringify(client.handshake.headers)}`);
        this.logger.log(`Client Query: ${JSON.stringify(client.handshake.query)}`);
        await this.connectQuestService.cacheToken(JSON.stringify(client.handshake.query));
        client.on("disconnect", (reason) => {
            this.logger.log(`Client Disconnected. ID: ${client.id}, Reason: ${reason}`);
        });
    }
    async handleJoinRoom(courseId, client) {
        if (!courseId) {
            client.emit(SocketEvents_enum_1.SocketEvents.ERROR, "Course ID is required");
            this.logger.error(`SOCKET EVENT:${SocketEvents_enum_1.SocketEvents.JOIN_ROOM} - Course ID is required`);
            return;
        }
        client.join(courseId);
        client["courseId"] = courseId;
        const user = client["user"];
        if (user === null || user === void 0 ? void 0 : user.id) {
            await this.scenarioProgressCachingService.updateUserExitTimeStamp(courseId, user, null);
        }
        const connectedUsers = await this.getConnectedUsersInRoom(courseId);
        client.to(courseId).emit(SocketEvents_enum_1.SocketEvents.UPDATE_CONNECTED_USERS, connectedUsers);
        client.emit(SocketEvents_enum_1.SocketEvents.UPDATE_CONNECTED_USERS, connectedUsers);
    }
    async handleDisconnect(client) {
        this.logger.log(`Client disconnected: ${client.id}`);
        const user = client["user"];
        const courseProgressId = client["courseId"];
        if (user === null || user === void 0 ? void 0 : user.id) {
            await this.scenarioProgressCachingService.updateUserExitTimeStamp(courseProgressId, user);
        }
        const connectedUsers = await this.getConnectedUsersInRoom(courseProgressId);
        client.to(courseProgressId).emit(SocketEvents_enum_1.SocketEvents.UPDATE_CONNECTED_USERS, connectedUsers);
    }
    async handleChatMessage(data, client) {
        if (!(data === null || data === void 0 ? void 0 : data.message) || !(data === null || data === void 0 ? void 0 : data.courseId)) {
            client.emit(SocketEvents_enum_1.SocketEvents.ERROR, "Message and courseId are required");
            this.logger.error(`SOCKET EVENT:${SocketEvents_enum_1.SocketEvents.SEND_CHAT} - Message and courseId are required`);
            return;
        }
        const user = client["user"];
        const messageBody = {
            id: (0, uuid_1.v4)(),
            data: {
                userId: user === null || user === void 0 ? void 0 : user.id,
                firstName: user === null || user === void 0 ? void 0 : user.firstName,
                lastName: user === null || user === void 0 ? void 0 : user.lastName,
                email: user === null || user === void 0 ? void 0 : user.email,
                message: data.message,
            },
            type: ScenarioMessageTypes_enum_1.ScenarioMessageTypes.MESSAGE,
            timestamp: Date.now(),
        };
        await this.scenarioProgressCachingService.saveChatMessage(data.courseId, messageBody);
        client.to(data.courseId).emit(SocketEvents_enum_1.SocketEvents.CHAT, messageBody);
        client.emit(SocketEvents_enum_1.SocketEvents.CHAT, messageBody);
    }
    async handleProtocolMessage({ type, data, courseId }, client) {
        var _a;
        if (!data || !courseId || !type) {
            client.emit(SocketEvents_enum_1.SocketEvents.ERROR, "Data, course id and type are required");
            this.logger.error(`SOCKET EVENT:${SocketEvents_enum_1.SocketEvents.SEND_PROTOCOL} - Data, course id and type are required`);
            return;
        }
        const user = client["user"];
        let protocolMessageData;
        if (type === ScenarioMessageTypes_enum_1.ScenarioMessageTypes.MESSAGE) {
            if (!(data === null || data === void 0 ? void 0 : data.message)) {
                client.emit(SocketEvents_enum_1.SocketEvents.ERROR, "Message is required");
                this.logger.error(`SOCKET EVENT:${SocketEvents_enum_1.SocketEvents.SEND_PROTOCOL} - Message is required`);
                return;
            }
            protocolMessageData = {
                id: (0, uuid_1.v4)(),
                data: {
                    userId: user === null || user === void 0 ? void 0 : user.id,
                    firstName: user === null || user === void 0 ? void 0 : user.firstName,
                    lastName: user === null || user === void 0 ? void 0 : user.lastName,
                    email: user === null || user === void 0 ? void 0 : user.email,
                    message: data === null || data === void 0 ? void 0 : data.message,
                },
                type: ScenarioMessageTypes_enum_1.ScenarioMessageTypes.MESSAGE,
                timestamp: Date.now(),
            };
        }
        else if (type === ScenarioMessageTypes_enum_1.ScenarioMessageTypes.DECISION) {
            if (!(data === null || data === void 0 ? void 0 : data.confirmationRequired) || !((_a = data === null || data === void 0 ? void 0 : data.decisionOptions) === null || _a === void 0 ? void 0 : _a.length)) {
                client.emit(SocketEvents_enum_1.SocketEvents.ERROR, "Name, confirmation type and options are required");
                this.logger.error(`SOCKET EVENT:${SocketEvents_enum_1.SocketEvents.SEND_PROTOCOL} - Name, confirmation type and options are required`);
                return;
            }
            protocolMessageData = {
                id: (0, uuid_1.v4)(),
                data,
                type: ScenarioMessageTypes_enum_1.ScenarioMessageTypes.DECISION,
                timestamp: Date.now(),
            };
        }
        await this.scenarioProgressCachingService.saveProtocolMessage(courseId, protocolMessageData);
        client.to(courseId).emit(SocketEvents_enum_1.SocketEvents.PROTOCOL, protocolMessageData);
        client.emit(SocketEvents_enum_1.SocketEvents.PROTOCOL, protocolMessageData);
    }
    async handleUpdateProtocolMessage({ messageId, type, data, courseId, }, client) {
        if (!data || !courseId || !type || !messageId) {
            client.emit(SocketEvents_enum_1.SocketEvents.ERROR, "Message id, data, course id and type are required");
            this.logger.error(`SOCKET EVENT:${SocketEvents_enum_1.SocketEvents.UPDATE_PROTOCOL} - Message id, data, course id and type are required`);
            return;
        }
        const user = client["user"];
        let protocolMessageData;
        if (type === ScenarioMessageTypes_enum_1.ScenarioMessageTypes.MESSAGE) {
            if (!(data === null || data === void 0 ? void 0 : data.message)) {
                client.emit(SocketEvents_enum_1.SocketEvents.ERROR, "Message is required");
                return;
            }
            protocolMessageData = {
                id: messageId,
                data: {
                    userId: user === null || user === void 0 ? void 0 : user.id,
                    firstName: user === null || user === void 0 ? void 0 : user.firstName,
                    lastName: user === null || user === void 0 ? void 0 : user.lastName,
                    email: user === null || user === void 0 ? void 0 : user.email,
                    message: data === null || data === void 0 ? void 0 : data.message,
                },
                type: ScenarioMessageTypes_enum_1.ScenarioMessageTypes.MESSAGE,
                timestamp: Date.now(),
            };
        }
        else if (type === ScenarioMessageTypes_enum_1.ScenarioMessageTypes.DECISION) {
            protocolMessageData = {
                id: messageId,
                data,
                type: ScenarioMessageTypes_enum_1.ScenarioMessageTypes.DECISION,
                timestamp: Date.now(),
            };
        }
        await this.scenarioProgressCachingService.saveProtocolMessage(courseId, protocolMessageData);
        client.to(courseId).emit(SocketEvents_enum_1.SocketEvents.PROTOCOL, protocolMessageData);
        client.emit(SocketEvents_enum_1.SocketEvents.PROTOCOL, protocolMessageData);
    }
    async handleGetCurrentProtocolHistory({ courseId }, client) {
        if (!courseId) {
            client.emit(SocketEvents_enum_1.SocketEvents.ERROR, "Course Id is required");
            this.logger.error(`SOCKET EVENT:${SocketEvents_enum_1.SocketEvents.GET_ACTUAL_SCENARIO_DATA} - Course Id is required`);
            return;
        }
        const actualScenarioData = await this.scenarioProgressCachingService.getScenarioProgress(courseId, true);
        client.to(courseId).emit(SocketEvents_enum_1.SocketEvents.ACTUAL_SCENARIO_DATA, actualScenarioData);
        client.emit(SocketEvents_enum_1.SocketEvents.ACTUAL_SCENARIO_DATA, actualScenarioData);
    }
    async handleScenarioAction({ type, data, courseId }, client) {
        var _a, _b;
        if (!data || !courseId || !type) {
            client.emit(SocketEvents_enum_1.SocketEvents.ERROR, "Data, course id and type are required");
            this.logger.error(`SOCKET EVENT:${SocketEvents_enum_1.SocketEvents.SCENARIO_ACTION} - Data, course id and type are required`);
            return;
        }
        let actualScenarioData;
        if (type === ScenarioActionTypes_enum_1.ScenarioActionTypes.NEW_STAGE && (data === null || data === void 0 ? void 0 : data.nextStageId)) {
            actualScenarioData = await this.goToNewStageHandler(courseId, data.nextStageId);
        }
        else if (type === ScenarioActionTypes_enum_1.ScenarioActionTypes.FINISH_SCENARIO) {
            await this.finalizeSession(courseId);
            return;
        }
        else if (type === ScenarioActionTypes_enum_1.ScenarioActionTypes.SHOW_SPOILER && (data === null || data === void 0 ? void 0 : data.requesterEmail)) {
            const { existedProgress, spoilerContent } = await this.scenarioProgressCachingService.showCurrentStageSpoiler(courseId, data.requesterEmail);
            actualScenarioData = existedProgress;
            client.emit(SocketEvents_enum_1.SocketEvents.ACTION, {
                type: ScenarioActionTypes_enum_1.ScenarioActionTypes.SHOW_SPOILER,
                content: spoilerContent,
            });
        }
        else if (type === ScenarioActionTypes_enum_1.ScenarioActionTypes.REMOVE_USER && ((_a = data === null || data === void 0 ? void 0 : data.user) === null || _a === void 0 ? void 0 : _a.id)) {
            actualScenarioData = await this.scenarioProgressCachingService.removeUserFromScenario(courseId, data.user, client["user"]);
            const socketsInRoom = this.server.sockets.adapter.rooms.get(courseId);
            const targetSocketId = Array.from(socketsInRoom).find((socketId) => {
                var _a, _b;
                const socket = this.server.sockets.sockets.get(socketId);
                return ((_a = socket["user"]) === null || _a === void 0 ? void 0 : _a.id) === ((_b = data === null || data === void 0 ? void 0 : data.user) === null || _b === void 0 ? void 0 : _b.id);
            });
            if (targetSocketId) {
                this.server
                    .to(targetSocketId)
                    .emit(SocketEvents_enum_1.SocketEvents.ACTION, {
                    type: ScenarioActionTypes_enum_1.ScenarioActionTypes.LOGOUT,
                    userId: (_b = data === null || data === void 0 ? void 0 : data.user) === null || _b === void 0 ? void 0 : _b.id,
                });
            }
            else {
                const connectedUsers = await this.getConnectedUsersInRoom(courseId);
                client.emit(SocketEvents_enum_1.SocketEvents.UPDATE_CONNECTED_USERS, connectedUsers);
            }
        }
        if (actualScenarioData) {
            client.to(courseId).emit(SocketEvents_enum_1.SocketEvents.ACTUAL_SCENARIO_DATA, actualScenarioData);
            client.emit(SocketEvents_enum_1.SocketEvents.ACTUAL_SCENARIO_DATA, actualScenarioData);
        }
    }
    async handleUpdateUser({ updatedPermissions, courseId, userId, }, client) {
        var _a;
        if (!updatedPermissions || !courseId || !userId) {
            this.logger.error(`SOCKET EVENT:${SocketEvents_enum_1.SocketEvents.UPDATE_USER} - Updated permissions, course progress id and user id are required`);
            client.emit(SocketEvents_enum_1.SocketEvents.ERROR, "Updated permissions, course progress id and user id are required");
            return;
        }
        const targetUser = await this.scenarioProgressCachingService.updateUserPermissions(courseId, userId, updatedPermissions);
        const socketsInRoom = this.server.sockets.adapter.rooms.get(courseId);
        const targetSocketId = Array.from(socketsInRoom).find((socketId) => {
            var _a;
            const socket = this.server.sockets.sockets.get(socketId);
            return ((_a = socket["user"]) === null || _a === void 0 ? void 0 : _a.id) === userId;
        });
        this.server
            .to(client.id)
            .emit(SocketEvents_enum_1.SocketEvents.UPDATE_USER_INFO, Object.assign(Object.assign({}, targetUser), { isActive: !!targetSocketId }));
        if (targetSocketId && targetUser) {
            this.server
                .to(targetSocketId)
                .emit(SocketEvents_enum_1.SocketEvents.UPDATE_PERMISSIONS, { permissions: (_a = targetUser === null || targetUser === void 0 ? void 0 : targetUser.permissions) !== null && _a !== void 0 ? _a : [] });
        }
    }
    async goToNewStageHandler(courseProgressId, nextStageId) {
        var _a, _b, _c, _d, _e;
        try {
            await this.scenarioProgressCachingService.goToNewStage(courseProgressId, nextStageId);
        }
        catch (error) {
            this.server
                .to(courseProgressId)
                .emit(SocketEvents_enum_1.SocketEvents.ERROR, { message: (_a = error === null || error === void 0 ? void 0 : error.message) !== null && _a !== void 0 ? _a : "Failed to go to new stage" });
            return;
        }
        let actualScenarioData = await this.scenarioProgressCachingService.getScenarioProgress(courseProgressId, true);
        const currentStageData = (_c = (_b = actualScenarioData.json) === null || _b === void 0 ? void 0 : _b.Content) === null || _c === void 0 ? void 0 : _c[actualScenarioData === null || actualScenarioData === void 0 ? void 0 : actualScenarioData.currentStage];
        if (currentStageData &&
            ((_d = currentStageData === null || currentStageData === void 0 ? void 0 : currentStageData.decisionOptions) === null || _d === void 0 ? void 0 : _d.length) &&
            (currentStageData === null || currentStageData === void 0 ? void 0 : currentStageData.confirmationRequired)) {
            await this.scenarioProgressCachingService.pushNewDecision(courseProgressId, currentStageData);
        }
        if ((_e = currentStageData.timeDelayedContent) === null || _e === void 0 ? void 0 : _e.length) {
            await this.scenarioProgressCachingService.addTemporaryContent(courseProgressId, Date.now(), currentStageData.timeDelayedContent, currentStageData.id);
        }
        if (this.checkIfFinalPhase(actualScenarioData)) {
            let protocolMessageData = {
                id: (0, uuid_1.v4)(),
                data: {},
                type: ScenarioMessageTypes_enum_1.ScenarioMessageTypes.END,
                timestamp: Date.now(),
            };
            await this.scenarioProgressCachingService.saveProtocolMessage(courseProgressId, protocolMessageData);
        }
        return this.scenarioProgressCachingService.getScenarioProgress(courseProgressId, true);
    }
    checkIfFinalPhase(actualScenarioData) {
        var _a, _b, _c, _d, _e;
        if ((_a = actualScenarioData === null || actualScenarioData === void 0 ? void 0 : actualScenarioData.json) === null || _a === void 0 ? void 0 : _a.Content) {
            const currentStageInfo = (_c = (_b = actualScenarioData === null || actualScenarioData === void 0 ? void 0 : actualScenarioData.json) === null || _b === void 0 ? void 0 : _b.Content) === null || _c === void 0 ? void 0 : _c[actualScenarioData === null || actualScenarioData === void 0 ? void 0 : actualScenarioData.currentStage];
            if (!((_d = currentStageInfo === null || currentStageInfo === void 0 ? void 0 : currentStageInfo.decisionOptions) === null || _d === void 0 ? void 0 : _d.length)) {
                return true;
            }
        }
        return (actualScenarioData === null || actualScenarioData === void 0 ? void 0 : actualScenarioData.currentStage) ===
            ((_e = actualScenarioData === null || actualScenarioData === void 0 ? void 0 : actualScenarioData.json.Content) === null || _e === void 0 ? void 0 : _e.length) - 1;
    }
    async getConnectedUsersInRoom(courseProgressId) {
        const socketsInRoom = this.server.sockets.adapter.rooms.get(courseProgressId);
        const currentScenarioProgress = await this.scenarioProgressCachingService.getScenarioProgress(courseProgressId, true);
        const users = currentScenarioProgress === null || currentScenarioProgress === void 0 ? void 0 : currentScenarioProgress.users;
        if (!socketsInRoom || !(users === null || users === void 0 ? void 0 : users.length)) {
            return [];
        }
        const activeUsers = Array.from(socketsInRoom).reduce((acc, socketId) => {
            var _a, _b, _c, _d, _e;
            const socket = this.server.sockets.sockets.get(socketId);
            acc[(_a = socket["user"]) === null || _a === void 0 ? void 0 : _a.email] = {
                id: (_b = socket["user"]) === null || _b === void 0 ? void 0 : _b.id,
                firstName: (_c = socket["user"]) === null || _c === void 0 ? void 0 : _c.firstName,
                lastName: (_d = socket["user"]) === null || _d === void 0 ? void 0 : _d.lastName,
                email: (_e = socket["user"]) === null || _e === void 0 ? void 0 : _e.email,
            };
            return acc;
        }, {});
        return users.map((user) => (Object.assign(Object.assign({}, user), { isActive: !!activeUsers[user.email] })));
    }
    async sessionTimeUpHandler(courseProgressId) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r;
        const scenarioProgress = await this.scenarioProgressCachingService.getScenarioProgress(courseProgressId);
        const currentStage = (_b = (_a = scenarioProgress === null || scenarioProgress === void 0 ? void 0 : scenarioProgress.json) === null || _a === void 0 ? void 0 : _a.Content) === null || _b === void 0 ? void 0 : _b[scenarioProgress.currentStage];
        const hasTimedDecision = ((_c = currentStage === null || currentStage === void 0 ? void 0 : currentStage.decisionOptions) === null || _c === void 0 ? void 0 : _c.length) &&
            ((_d = currentStage === null || currentStage === void 0 ? void 0 : currentStage.timeLeftDecisionId) !== null && _d !== void 0 ? _d : -1) !== -1;
        if (hasTimedDecision) {
            const decisionIndex = scenarioProgress.protocolHistory.findIndex((message) => {
                var _a;
                return message.type === ScenarioMessageTypes_enum_1.ScenarioMessageTypes.DECISION &&
                    ((_a = message === null || message === void 0 ? void 0 : message.data) === null || _a === void 0 ? void 0 : _a.name) === (currentStage === null || currentStage === void 0 ? void 0 : currentStage.decisionName);
            });
            const timedOption = (_e = currentStage === null || currentStage === void 0 ? void 0 : currentStage.decisionOptions) === null || _e === void 0 ? void 0 : _e[currentStage === null || currentStage === void 0 ? void 0 : currentStage.timeLeftDecisionId];
            if (decisionIndex !== -1 && timedOption) {
                scenarioProgress.protocolHistory[decisionIndex] = Object.assign(Object.assign({}, scenarioProgress.protocolHistory[decisionIndex]), { data: Object.assign(Object.assign({}, scenarioProgress.protocolHistory[decisionIndex].data), { finalDecision: timedOption }) });
                await this.scenarioProgressCachingService.setScenario(courseProgressId, scenarioProgress);
            }
            else {
                this.scenarioProgressCachingService.unlockScenario(courseProgressId);
            }
            if ((timedOption === null || timedOption === void 0 ? void 0 : timedOption.phaseId) !== (currentStage === null || currentStage === void 0 ? void 0 : currentStage.id)) {
                if ((timedOption === null || timedOption === void 0 ? void 0 : timedOption.phaseId) <= ((_g = (_f = scenarioProgress === null || scenarioProgress === void 0 ? void 0 : scenarioProgress.json) === null || _f === void 0 ? void 0 : _f.Content) === null || _g === void 0 ? void 0 : _g.length)) {
                    const actualScenarioData = await this.goToNewStageHandler(courseProgressId, timedOption.phaseId);
                    this.server.to(courseProgressId).emit(SocketEvents_enum_1.SocketEvents.ACTUAL_SCENARIO_DATA, actualScenarioData);
                    return;
                }
                else if ((timedOption === null || timedOption === void 0 ? void 0 : timedOption.phaseId) > ((_j = (_h = scenarioProgress === null || scenarioProgress === void 0 ? void 0 : scenarioProgress.json) === null || _h === void 0 ? void 0 : _h.Content) === null || _j === void 0 ? void 0 : _j.length)) {
                    const resultStatus = (_k = currentStage === null || currentStage === void 0 ? void 0 : currentStage.phaseEndResult) !== null && _k !== void 0 ? _k : Status_1.CourseProgressEnum.Failed;
                    await this.finalizeSession(courseProgressId, resultStatus);
                    return;
                }
            }
        }
        else {
            this.scenarioProgressCachingService.unlockScenario(courseProgressId);
        }
        const resultStatus = (_l = currentStage === null || currentStage === void 0 ? void 0 : currentStage.phaseEndResult) !== null && _l !== void 0 ? _l : Status_1.CourseProgressEnum.Failed;
        const scenario = await this.courseProgressService.finalizeSession(courseProgressId, resultStatus, AdditionalStatusInfoTags_enum_1.AdditionalStatusInfoTags.TIMEUP);
        this.server.to(courseProgressId).emit(SocketEvents_enum_1.SocketEvents.ACTION, {
            type: ScenarioActionTypes_enum_1.ScenarioActionTypes.FINISH_SCENARIO,
            scenarioName: (_m = scenario.json) === null || _m === void 0 ? void 0 : _m.scenarioName,
            status: resultStatus,
            additionalStatusInfo: (_r = (_q = (_p = (_o = scenario === null || scenario === void 0 ? void 0 : scenario.json) === null || _o === void 0 ? void 0 : _o.Content) === null || _p === void 0 ? void 0 : _p[scenario.currentStage]) === null || _q === void 0 ? void 0 : _q.phaseEndText) !== null && _r !== void 0 ? _r : AdditionalStatusInfoTags_enum_1.AdditionalStatusInfoTags.TIMEUP,
        });
        await this.scenarioProgressCachingService.removeActiveTimerStage(courseProgressId);
        await this.scenarioProgressCachingService.clearTemporaryContentForCourseProgress(courseProgressId);
    }
    async finalizeSession(courseProgressId, status = Status_1.CourseProgressEnum.Success) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j;
        try {
            const scenario = await this.courseProgressService.finalizeSession(courseProgressId);
            const resultStatus = (_d = (_c = (_b = (_a = scenario === null || scenario === void 0 ? void 0 : scenario.json) === null || _a === void 0 ? void 0 : _a.Content) === null || _b === void 0 ? void 0 : _b[scenario.currentStage]) === null || _c === void 0 ? void 0 : _c.phaseEndResult) !== null && _d !== void 0 ? _d : status;
            this.server.to(courseProgressId).emit(SocketEvents_enum_1.SocketEvents.ACTION, {
                type: ScenarioActionTypes_enum_1.ScenarioActionTypes.FINISH_SCENARIO,
                scenarioName: (_e = scenario.json) === null || _e === void 0 ? void 0 : _e.scenarioName,
                status: resultStatus,
                additionalStatusInfo: (_j = (_h = (_g = (_f = scenario === null || scenario === void 0 ? void 0 : scenario.json) === null || _f === void 0 ? void 0 : _f.Content) === null || _g === void 0 ? void 0 : _g[scenario.currentStage]) === null || _h === void 0 ? void 0 : _h.phaseEndText) !== null && _j !== void 0 ? _j : AdditionalStatusInfoTags_enum_1.AdditionalStatusInfoTags.SUCCESS,
            });
            await this.scenarioProgressCachingService.clearTemporaryContentForCourseProgress(courseProgressId);
            await this.scenarioProgressCachingService.removeActiveTimerStage(courseProgressId);
        }
        catch (error) {
            this.server.to(courseProgressId).emit(SocketEvents_enum_1.SocketEvents.ERROR, "Failed to finalize session");
            throw error;
        }
    }
    async checkActiveScenariosTimers() {
        const currentTimeStamp = Date.now();
        const courseIds = await this.scenarioProgressCachingService.getActiveTimers();
        for (const [courseId, currentStageEndTimeStamp] of Object.entries(courseIds)) {
            if (currentStageEndTimeStamp) {
                const differenceInTime = currentStageEndTimeStamp - currentTimeStamp;
                if (differenceInTime <= 300000 && differenceInTime > 299000) {
                    const message = {
                        id: (0, uuid_1.v4)(),
                        data: {
                            title: "end-session",
                            description: "time-up",
                            type: ServiceMessageType_enum_1.ServiceMessageType.INFO,
                            descriptionOptions: { leftTime: 5 },
                        },
                        type: ScenarioMessageTypes_enum_1.ScenarioMessageTypes.SERVICE,
                        timestamp: currentTimeStamp,
                    };
                    await this.scenarioProgressCachingService.saveProtocolMessage(courseId, message);
                    this.server.to(courseId).emit(SocketEvents_enum_1.SocketEvents.PROTOCOL, message);
                }
                else if (differenceInTime <= 60000 && differenceInTime > 59000) {
                    const message = {
                        id: (0, uuid_1.v4)(),
                        data: {
                            title: "end-session",
                            description: "time-up",
                            type: ServiceMessageType_enum_1.ServiceMessageType.INFO,
                            descriptionOptions: { leftTime: 1 },
                        },
                        type: ScenarioMessageTypes_enum_1.ScenarioMessageTypes.SERVICE,
                        timestamp: currentTimeStamp,
                    };
                    await this.scenarioProgressCachingService.saveProtocolMessage(courseId, message);
                    this.server.to(courseId).emit(SocketEvents_enum_1.SocketEvents.PROTOCOL, message);
                }
                else if (differenceInTime < 1000) {
                    await this.sessionTimeUpHandler(courseId);
                }
            }
        }
    }
    async checkACtiveScenariosTimeBasedContent() {
        var _a, _b, _c, _d, _e;
        const currentTimeStamp = Date.now();
        const temporaryContent = await this.scenarioProgressCachingService.getTemporaryContent();
        const dataForRemoving = [];
        for (const [courseProgressId, courseTemporaryContent] of Object.entries(temporaryContent)) {
            if (!(courseTemporaryContent === null || courseTemporaryContent === void 0 ? void 0 : courseTemporaryContent.length))
                continue;
            const contentIdsForRemoving = [];
            let currentCourseProgress = null;
            for (const content of courseTemporaryContent) {
                const isWithinShowingTime = (content === null || content === void 0 ? void 0 : content.startShowingTime) - 500 < currentTimeStamp &&
                    (content === null || content === void 0 ? void 0 : content.startShowingTime) + 500 > currentTimeStamp;
                const isWithinDeleteTime = (content === null || content === void 0 ? void 0 : content.deleteTime) - 500 < currentTimeStamp &&
                    (content === null || content === void 0 ? void 0 : content.deleteTime) + 500 > currentTimeStamp;
                if (isWithinShowingTime || isWithinDeleteTime) {
                    if (!currentCourseProgress) {
                        currentCourseProgress = await this.scenarioProgressCachingService.getScenarioProgress(courseProgressId);
                    }
                    if (isWithinShowingTime) {
                        let newContent = content.stageInfo;
                        console.log("📦 content.stageInfo", JSON.stringify(content.stageInfo, null, 2));
                        if (!(newContent === null || newContent === void 0 ? void 0 : newContent.stageNumber) && (newContent === null || newContent === void 0 ? void 0 : newContent.stageNumber) !== 0) {
                            newContent.stageNumber = (_c = (_b = (_a = currentCourseProgress === null || currentCourseProgress === void 0 ? void 0 : currentCourseProgress.json) === null || _a === void 0 ? void 0 : _a.Content) === null || _b === void 0 ? void 0 : _b[currentCourseProgress.currentStage]) === null || _c === void 0 ? void 0 : _c.id;
                        }
                        currentCourseProgress.stageContent.push(newContent);
                        if (!(content === null || content === void 0 ? void 0 : content.deleteTime)) {
                            contentIdsForRemoving.push((_d = content.stageInfo) === null || _d === void 0 ? void 0 : _d.id);
                        }
                    }
                    else if (isWithinDeleteTime) {
                        currentCourseProgress.stageContent = currentCourseProgress.stageContent.map((item) => {
                            var _a;
                            if ((item === null || item === void 0 ? void 0 : item.id) === ((_a = content.stageInfo) === null || _a === void 0 ? void 0 : _a.id)) {
                                return Object.assign(Object.assign({}, item), { isRemoved: true });
                            }
                            return item;
                        });
                        contentIdsForRemoving.push((_e = content.stageInfo) === null || _e === void 0 ? void 0 : _e.id);
                    }
                }
            }
            if (contentIdsForRemoving.length) {
                dataForRemoving.push({ courseProgressId, contentIds: contentIdsForRemoving });
            }
            if (currentCourseProgress) {
                await this.scenarioProgressCachingService.setScenario(courseProgressId, currentCourseProgress);
                this.server.to(courseProgressId).emit(SocketEvents_enum_1.SocketEvents.ACTUAL_SCENARIO_DATA, currentCourseProgress);
            }
        }
        if (dataForRemoving.length) {
            await this.scenarioProgressCachingService.removeTemporaryContentArray(dataForRemoving);
        }
    }
};
exports.CourseProgressGateway = CourseProgressGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], CourseProgressGateway.prototype, "server", void 0);
__decorate([
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket]),
    __metadata("design:returntype", Promise)
], CourseProgressGateway.prototype, "handleConnection", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Join a WebSocket room" }),
    (0, swagger_1.ApiBody)({
        schema: {
            type: "object",
            properties: {
                courseId: { type: "string" },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "Joined room successfully" }),
    (0, swagger_1.ApiResponse)({ status: 400, description: "Course ID is required" }),
    (0, common_1.UseGuards)(web_socket_guard_1.WebSocketGuard),
    (0, websockets_1.SubscribeMessage)(SocketEvents_enum_1.SocketEvents.JOIN_ROOM),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, socket_io_1.Socket]),
    __metadata("design:returntype", Promise)
], CourseProgressGateway.prototype, "handleJoinRoom", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Handle WebSocket disconnection" }),
    (0, common_1.UseGuards)(web_socket_guard_1.WebSocketGuard),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket]),
    __metadata("design:returntype", Promise)
], CourseProgressGateway.prototype, "handleDisconnect", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Send a chat message" }),
    (0, swagger_1.ApiBody)({
        schema: {
            type: "object",
            properties: {
                message: { type: "string" },
                courseId: { type: "string" },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "Message sent successfully" }),
    (0, swagger_1.ApiResponse)({ status: 400, description: "Message and courseId are required" }),
    (0, common_1.UseGuards)(web_socket_guard_1.WebSocketGuard),
    (0, websockets_1.SubscribeMessage)(SocketEvents_enum_1.SocketEvents.SEND_CHAT),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, socket_io_1.Socket]),
    __metadata("design:returntype", Promise)
], CourseProgressGateway.prototype, "handleChatMessage", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Send a protocol message" }),
    (0, swagger_1.ApiBody)({
        schema: {
            type: "object",
            properties: {
                type: { type: typeof ScenarioMessageTypes_enum_1.ScenarioMessageTypes },
                data: { type: "any" },
                courseId: { type: "string" },
            },
        },
    }),
    (0, common_1.UseGuards)(web_socket_guard_1.WebSocketGuard),
    (0, websockets_1.SubscribeMessage)(SocketEvents_enum_1.SocketEvents.SEND_PROTOCOL),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, socket_io_1.Socket]),
    __metadata("design:returntype", Promise)
], CourseProgressGateway.prototype, "handleProtocolMessage", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Update a protocol message" }),
    (0, swagger_1.ApiBody)({
        schema: {
            type: "object",
            properties: {
                type: { type: typeof ScenarioMessageTypes_enum_1.ScenarioMessageTypes },
                data: { type: "any" },
                courseId: { type: "string" },
                messageId: { type: "string" },
            },
        },
    }),
    (0, common_1.UseGuards)(web_socket_guard_1.WebSocketGuard),
    (0, websockets_1.SubscribeMessage)(SocketEvents_enum_1.SocketEvents.UPDATE_PROTOCOL),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, socket_io_1.Socket]),
    __metadata("design:returntype", Promise)
], CourseProgressGateway.prototype, "handleUpdateProtocolMessage", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Get current protocol history" }),
    (0, swagger_1.ApiBody)({
        schema: {
            type: "object",
            properties: {
                courseId: { type: "string" },
            },
        },
    }),
    (0, common_1.UseGuards)(web_socket_guard_1.WebSocketGuard),
    (0, websockets_1.SubscribeMessage)(SocketEvents_enum_1.SocketEvents.GET_ACTUAL_SCENARIO_DATA),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, socket_io_1.Socket]),
    __metadata("design:returntype", Promise)
], CourseProgressGateway.prototype, "handleGetCurrentProtocolHistory", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Send scenario action" }),
    (0, swagger_1.ApiBody)({
        schema: {
            type: "object",
            properties: {
                type: { type: typeof ScenarioActionTypes_enum_1.ScenarioActionTypes },
                data: { type: "any" },
                courseId: { type: "string" },
            },
        },
    }),
    (0, common_1.UseGuards)(web_socket_guard_1.WebSocketGuard),
    (0, websockets_1.SubscribeMessage)(SocketEvents_enum_1.SocketEvents.SCENARIO_ACTION),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, socket_io_1.Socket]),
    __metadata("design:returntype", Promise)
], CourseProgressGateway.prototype, "handleScenarioAction", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Handle update user permissions" }),
    (0, swagger_1.ApiBody)({
        schema: {
            type: "object",
            properties: {
                updatedPermissions: { type: typeof codes_1.PermissionCodes },
                userId: { type: "string" },
                courseId: { type: "string" },
            },
        },
    }),
    (0, common_1.UseGuards)(web_socket_guard_1.WebSocketGuard),
    (0, websockets_1.SubscribeMessage)(SocketEvents_enum_1.SocketEvents.UPDATE_USER),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, socket_io_1.Socket]),
    __metadata("design:returntype", Promise)
], CourseProgressGateway.prototype, "handleUpdateUser", null);
exports.CourseProgressGateway = CourseProgressGateway = CourseProgressGateway_1 = __decorate([
    (0, swagger_1.ApiTags)("Scenario Progress WebSocket"),
    (0, common_1.Injectable)(),
    (0, websockets_1.WebSocketGateway)({
        cors: {
            origin: "*",
            methods: ["GET", "POST"],
        },
        transports: ["polling", "websocket"],
    }),
    __param(0, (0, common_1.Inject)((0, common_1.forwardRef)(() => course_progress_service_1.CourseProgressService))),
    __metadata("design:paramtypes", [course_progress_service_1.CourseProgressService,
        scenario_progress_caching_service_1.ScenarioProgressCachingService,
        connect_quest_service_1.ConnectQuestService])
], CourseProgressGateway);
//# sourceMappingURL=course-progress.gateway.js.map