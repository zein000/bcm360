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
exports.ScenarioProgressCachingService = void 0;
const common_1 = require("@nestjs/common");
const cache_manager_1 = require("@nestjs/cache-manager");
const async_mutex_1 = require("async-mutex");
const ScenarioMessageTypes_enum_1 = require("../../course-progress/enum/ScenarioMessageTypes.enum");
const ScenarioJson_interface_1 = require("../../course-progress/interfaces/ScenarioJson.interface");
const FileTypes_enum_1 = require("../../file/enum/FileTypes.enum");
const uuid_1 = require("uuid");
const caching_service_1 = require("../caching.service");
const caching_config_1 = require("../config/caching.config");
let ScenarioProgressCachingService = class ScenarioProgressCachingService extends caching_service_1.CachingService {
    constructor(config, cacheManager) {
        super(cacheManager, "scenario-progress", config.scenarioTtl);
        this.locks = new Map();
        this.activeLocks = new Map();
    }
    async setActiveTimers(activeTimersData) {
        return this.set("active-timers", JSON.stringify(activeTimersData));
    }
    async getActiveTimers() {
        const res = await this.get("active-timers");
        return res ? JSON.parse(res) : {};
    }
    getMutex(courseId) {
        if (!this.locks.has(courseId)) {
            this.locks.set(courseId, new async_mutex_1.Mutex());
        }
        return this.locks.get(courseId);
    }
    unlockScenario(courseId) {
        const release = this.activeLocks.get(courseId);
        if (release) {
            release();
            this.activeLocks.delete(courseId);
        }
    }
    async setScenario(courseId, data) {
        const release = this.activeLocks.get(courseId);
        if (!release) {
            throw new Error(`Cannot set scenario for ${courseId} without prior getScenarioProgress`);
        }
        data.lastUpdateTimeStamp = Date.now();
        await this.set(courseId, JSON.stringify(data));
        release();
        this.activeLocks.delete(courseId);
    }
    async getScenarioProgress(courseId, isReadOnly = false) {
        const mutex = this.getMutex(courseId);
        const release = await mutex.acquire();
        try {
            const res = await this.get(courseId);
            const data = res
                ? JSON.parse(res)
                : {
                    protocolHistory: [],
                    chatHistory: [],
                    currentStage: 0,
                    currentStageStartTimestamp: 0,
                    currentStageEndTimestamp: 0,
                    json: ScenarioJson_interface_1.EMPTY_COURSE_SCENARIO,
                    stageContent: [],
                    users: [],
                    errInfo: null,
                    lastUpdateTimeStamp: 0,
                };
            if (isReadOnly) {
                release();
            }
            else {
                this.activeLocks.set(courseId, release);
            }
            return data;
        }
        catch (err) {
            release();
            throw err;
        }
    }
    async saveScenarioJson(courseId, json) {
        let existedProgress = await this.getScenarioProgress(courseId);
        existedProgress.json = json;
        return this.setScenario(courseId, existedProgress);
    }
    async setCurrentStageEndTimestamp(courseId, currentStageEndTimestamp, currentStageStartTimestamp = 0) {
        let existedProgress = await this.getScenarioProgress(courseId);
        existedProgress.currentStageEndTimestamp = currentStageEndTimestamp;
        await this.saveActiveTimerStage(courseId, currentStageEndTimestamp);
        if (currentStageStartTimestamp) {
            existedProgress.currentStageStartTimestamp = currentStageStartTimestamp;
        }
        return this.setScenario(courseId, existedProgress);
    }
    async saveProtocolMessage(courseId, message) {
        let existedProgress = await this.getScenarioProgress(courseId);
        const existingMessageIndex = existedProgress.protocolHistory.findIndex((item) => item.id === message.id);
        if (existingMessageIndex >= 0) {
            existedProgress.protocolHistory[existingMessageIndex] = message;
        }
        else {
            existedProgress.protocolHistory.push(message);
        }
        return this.setScenario(courseId, existedProgress);
    }
    async saveChatMessage(courseId, message) {
        let existedProgress = await this.getScenarioProgress(courseId);
        const existingMessageIndex = existedProgress.chatHistory.findIndex((item) => item.id === message.id);
        if (existingMessageIndex >= 0) {
            existedProgress.chatHistory[existingMessageIndex] = message;
        }
        else {
            existedProgress.chatHistory.push(message);
        }
        return this.setScenario(courseId, existedProgress);
    }
    async goToNewStage(courseId, newStageId) {
        let existedProgress = await this.getScenarioProgress(courseId);
        const stageIndex = existedProgress.json.Content.findIndex((item) => item.id === newStageId);
        if (stageIndex === -1) {
            throw new Error(`Invalid stage ID: ${newStageId}`);
        }
        if (stageIndex !== existedProgress.currentStage) {
            existedProgress.currentStage = stageIndex;
            existedProgress.currentStageStartTimestamp = Date.now();
            const newStageData = existedProgress.json.Content[stageIndex];
            if (newStageData.timeLimit) {
                existedProgress.currentStageEndTimestamp = Date.now() + newStageData.timeLimit * 1000;
                await this.saveActiveTimerStage(courseId, existedProgress.currentStageEndTimestamp);
            }
            else {
                existedProgress.currentStageEndTimestamp = 0;
                await this.removeActiveTimerStage(courseId);
            }
            if ((newStageData === null || newStageData === void 0 ? void 0 : newStageData.content) && (newStageData === null || newStageData === void 0 ? void 0 : newStageData.contentType)) {
                const stageContent = {
                    id: (0, uuid_1.v4)(),
                    content: newStageData.content,
                    contentType: newStageData.contentType,
                    timeStamp: Date.now(),
                    stageNumber: newStageData.id,
                    isRemoved: false,
                };
                existedProgress.stageContent.push(stageContent);
            }
        }
        await this.clearTemporaryContentForCourseProgress(courseId, false);
        return this.setScenario(courseId, existedProgress);
    }
    async pushNewDecision(courseId, stageInfo) {
        var _a;
        const initialProtocolDecision = {
            id: (0, uuid_1.v4)(),
            data: {
                name: (_a = stageInfo === null || stageInfo === void 0 ? void 0 : stageInfo.decisionName) !== null && _a !== void 0 ? _a : "",
                confirmationRequired: stageInfo.confirmationRequired,
                decisionOptions: stageInfo.decisionOptions.map((optionData) => ({
                    option: optionData.option,
                    phaseId: optionData.phaseId,
                    userVotedIds: [],
                })),
            },
            type: ScenarioMessageTypes_enum_1.ScenarioMessageTypes.DECISION,
            timestamp: Date.now(),
        };
        await this.saveProtocolMessage(courseId, initialProtocolDecision);
    }
    async saveActiveTimerStage(courseId, currentStageTimeStampEnd) {
        const existedData = await this.getActiveTimers();
        existedData[courseId] = currentStageTimeStampEnd;
        return this.setActiveTimers(existedData);
    }
    async removeActiveTimerStage(courseId) {
        const existedData = await this.getActiveTimers();
        if (existedData[courseId]) {
            delete existedData[courseId];
            return this.setActiveTimers(existedData);
        }
        return;
    }
    async updateUserExitTimeStamp(courseId, user, exitTimeStamp = Date.now()) {
        let existedProgress = await this.getScenarioProgress(courseId);
        const userIndex = existedProgress.users.findIndex((item) => item.id === user.id);
        if (userIndex >= 0) {
            existedProgress.users[userIndex].exitTimeStamp = exitTimeStamp;
            return this.setScenario(courseId, existedProgress);
        }
        else {
            return this.unlockScenario(courseId);
        }
    }
    async saveScenarioStageContent(courseId, info) {
        let existedProgress = await this.getScenarioProgress(courseId);
        const existedContentIndex = existedProgress.stageContent.findIndex((item) => item.id === info.id);
        if (existedContentIndex >= 0) {
            existedProgress.stageContent[existedContentIndex] = info;
        }
        else {
            existedProgress.stageContent.push(info);
        }
        return this.setScenario(courseId, existedProgress);
    }
    async showCurrentStageSpoiler(courseId, requesterEmail) {
        var _a;
        let existedProgress = await this.getScenarioProgress(courseId);
        let spoilerContent;
        const currentStageInfo = existedProgress.json.Content[existedProgress.currentStage];
        if ((_a = currentStageInfo === null || currentStageInfo === void 0 ? void 0 : currentStageInfo.spoilerContent) === null || _a === void 0 ? void 0 : _a.content) {
            spoilerContent = {
                id: (0, uuid_1.v4)(),
                content: currentStageInfo.spoilerContent.content,
                contentType: FileTypes_enum_1.FileTypes.Spoiler,
                timeStamp: Date.now(),
                title: currentStageInfo.spoilerContent.title,
                stageNumber: currentStageInfo.id,
                isRemoved: false,
            };
            existedProgress.stageContent.push(spoilerContent);
        }
        const requester = existedProgress.users.find((item) => item.email === requesterEmail);
        if (requester) {
            existedProgress.protocolHistory.push({
                id: (0, uuid_1.v4)(),
                data: {
                    userId: requester.id,
                    firstName: requester.firstName,
                    lastName: requester.lastName,
                    email: requester.email,
                    message: `requested-spoiler`,
                    options: {
                        phaseNumber: currentStageInfo.id,
                    },
                },
                type: ScenarioMessageTypes_enum_1.ScenarioMessageTypes.MESSAGE,
                timestamp: Date.now(),
            });
        }
        await this.setScenario(courseId, existedProgress);
        return { existedProgress, spoilerContent };
    }
    async removeScenarioStageContent(courseId, info) {
        let existedProgress = await this.getScenarioProgress(courseId);
        const existedContentIndex = existedProgress.stageContent.findIndex((item) => item.id === info.id);
        if (existedContentIndex >= 0) {
            existedProgress.stageContent = existedProgress.stageContent.filter((_, index) => index !== existedContentIndex);
            return this.setScenario(courseId, existedProgress);
        }
    }
    async clearScenarioProgress(courseId) {
        const release = this.activeLocks.get(courseId);
        if (release) {
            release();
            this.activeLocks.delete(courseId);
        }
        await this.del(courseId);
    }
    async setTemporaryContent(temporaryContent) {
        return this.set("temporary-content", JSON.stringify(temporaryContent));
    }
    async getTemporaryContent() {
        const res = await this.get("temporary-content");
        return res ? JSON.parse(res) : {};
    }
    async addTemporaryContent(courseProgressId, timeStamp, timeDelayedContent, stageNumber) {
        var _a;
        const currentTempContent = await this.getTemporaryContent();
        const preparedTempContent = timeDelayedContent.map((item) => {
            var _a;
            const contentId = (0, uuid_1.v4)();
            return {
                courseProgressId,
                deleteTime: timeStamp + item.endTimeInSeconds * 1000,
                startShowingTime: timeStamp + item.startTimeInSeconds * 1000,
                stageInfo: Object.assign(Object.assign({ id: contentId, timeStamp: timeStamp + item.startTimeInSeconds * 1000, stageNumber, isRemoved: false }, item), { autoplay: (_a = item.autoplay) !== null && _a !== void 0 ? _a : false }),
                isGlobal: stageNumber || stageNumber === 0 ? false : true,
            };
        });
        if ((_a = currentTempContent[courseProgressId]) === null || _a === void 0 ? void 0 : _a.length) {
            currentTempContent[courseProgressId] = [
                ...currentTempContent[courseProgressId],
                ...preparedTempContent,
            ];
        }
        else {
            currentTempContent[courseProgressId] = preparedTempContent;
        }
        return this.setTemporaryContent(currentTempContent);
    }
    async removeTemporaryContentArray(removedData) {
        const currentTempContent = await this.getTemporaryContent();
        for (const { courseProgressId, contentIds } of removedData) {
            currentTempContent[courseProgressId] = currentTempContent[courseProgressId].filter((item) => { var _a; return !contentIds.includes((_a = item.stageInfo) === null || _a === void 0 ? void 0 : _a.id); });
        }
        return this.setTemporaryContent(currentTempContent);
    }
    async clearTemporaryContentForCourseProgress(courseProgressId, isRemoveAll = true) {
        var _a, _b;
        const currentTempContent = await this.getTemporaryContent();
        if (isRemoveAll) {
            delete currentTempContent[courseProgressId];
        }
        else {
            currentTempContent[courseProgressId] = (_a = currentTempContent[courseProgressId]) === null || _a === void 0 ? void 0 : _a.filter((content) => content === null || content === void 0 ? void 0 : content.isGlobal);
            if (((_b = currentTempContent[courseProgressId]) === null || _b === void 0 ? void 0 : _b.length) === 0) {
                delete currentTempContent[courseProgressId];
            }
        }
        return this.setTemporaryContent(currentTempContent);
    }
    async onCourseInitialize(courseProgressId, errInfo, courseScenario, isOnlyOneStage) {
        var _a, _b, _c, _d, _e, _f;
        const currentCourseProgress = await this.getScenarioProgress(courseProgressId);
        const timeStamp = Date.now();
        const stageInfo = (_a = courseScenario === null || courseScenario === void 0 ? void 0 : courseScenario.Content) === null || _a === void 0 ? void 0 : _a[0];
        if (stageInfo) {
            if ((stageInfo === null || stageInfo === void 0 ? void 0 : stageInfo.confirmationRequired) && ((_b = stageInfo === null || stageInfo === void 0 ? void 0 : stageInfo.decisionOptions) === null || _b === void 0 ? void 0 : _b.length)) {
                const initialProtocolDecision = {
                    id: (0, uuid_1.v4)(),
                    data: {
                        name: (_c = stageInfo === null || stageInfo === void 0 ? void 0 : stageInfo.decisionName) !== null && _c !== void 0 ? _c : "",
                        confirmationRequired: stageInfo.confirmationRequired,
                        decisionOptions: stageInfo.decisionOptions.map((optionData) => ({
                            option: optionData.option,
                            phaseId: optionData.phaseId,
                            userVotedIds: [],
                        })),
                    },
                    type: ScenarioMessageTypes_enum_1.ScenarioMessageTypes.DECISION,
                    timestamp: timeStamp,
                };
                currentCourseProgress.protocolHistory.push(initialProtocolDecision);
            }
            if ((stageInfo === null || stageInfo === void 0 ? void 0 : stageInfo.content) && (stageInfo === null || stageInfo === void 0 ? void 0 : stageInfo.contentType)) {
                const stageContent = {
                    id: (0, uuid_1.v4)(),
                    content: stageInfo.content,
                    contentType: stageInfo.contentType,
                    timeStamp,
                    stageNumber: stageInfo.id,
                    title: stageInfo.phaseName,
                    isRemoved: false,
                    autoplay: (_d = stageInfo.autoplay) !== null && _d !== void 0 ? _d : false,
                };
                currentCourseProgress.stageContent.push(stageContent);
            }
            if ((_e = stageInfo === null || stageInfo === void 0 ? void 0 : stageInfo.timeDelayedContent) === null || _e === void 0 ? void 0 : _e.length) {
                await this.addTemporaryContent(courseProgressId, timeStamp, stageInfo.timeDelayedContent, stageInfo.id);
            }
            currentCourseProgress.json = courseScenario;
            if (stageInfo === null || stageInfo === void 0 ? void 0 : stageInfo.timeLimit) {
                const currentStageEndTimestamp = timeStamp + stageInfo.timeLimit * 1000;
                currentCourseProgress.currentStageEndTimestamp = currentStageEndTimestamp;
                await this.saveActiveTimerStage(courseProgressId, currentStageEndTimestamp);
            }
        }
        if ((_f = courseScenario === null || courseScenario === void 0 ? void 0 : courseScenario.timeDelayedContent) === null || _f === void 0 ? void 0 : _f.length) {
            await this.addTemporaryContent(courseProgressId, timeStamp, courseScenario.timeDelayedContent);
        }
        if (isOnlyOneStage) {
            currentCourseProgress.protocolHistory.push({
                id: (0, uuid_1.v4)(),
                data: {},
                type: ScenarioMessageTypes_enum_1.ScenarioMessageTypes.END,
                timestamp: timeStamp,
            });
        }
        if ((errInfo === null || errInfo === void 0 ? void 0 : errInfo.id) && (errInfo === null || errInfo === void 0 ? void 0 : errInfo.firstName) && (errInfo === null || errInfo === void 0 ? void 0 : errInfo.lastName) && (errInfo === null || errInfo === void 0 ? void 0 : errInfo.email)) {
            const errData = {
                id: (0, uuid_1.v4)(),
                firstName: errInfo.firstName,
                lastName: errInfo.lastName,
                email: errInfo.email,
                isActive: false,
                isAccepted: true,
                firstJoinTimeStamp: timeStamp,
            };
            currentCourseProgress.users.push(errData);
            currentCourseProgress.errInfo = errData;
        }
        return this.setScenario(courseProgressId, currentCourseProgress);
    }
    async updateUserPermissions(courseProgressId, targetUserId, permissions) {
        const currentCourseProgress = await this.getScenarioProgress(courseProgressId);
        const targetUserIndex = currentCourseProgress.users.findIndex((item) => item.id === targetUserId);
        if (targetUserIndex >= 0) {
            currentCourseProgress.users[targetUserIndex].permissions = permissions;
            await this.setScenario(courseProgressId, currentCourseProgress);
            return currentCourseProgress.users[targetUserIndex];
        }
        else {
            this.unlockScenario(courseProgressId);
            return null;
        }
    }
    async removeUserFromScenario(courseProgressId, user, requester) {
        const currentCourseProgress = await this.getScenarioProgress(courseProgressId);
        currentCourseProgress.users = currentCourseProgress.users.map((item) => {
            if ((item === null || item === void 0 ? void 0 : item.id) === (user === null || user === void 0 ? void 0 : user.id)) {
                item.isRemoved = true;
            }
            return item;
        });
        currentCourseProgress.protocolHistory.push({
            id: (0, uuid_1.v4)(),
            data: {
                userId: requester.id,
                firstName: requester.firstName,
                lastName: requester.lastName,
                email: requester.email,
                message: `removed-user`,
                options: {
                    userData: user.isAccepted ? `${user.firstName} ${user.lastName}` : user.email,
                },
            },
            type: ScenarioMessageTypes_enum_1.ScenarioMessageTypes.MESSAGE,
            timestamp: Date.now(),
        });
        await this.setScenario(courseProgressId, currentCourseProgress);
        return currentCourseProgress;
    }
};
exports.ScenarioProgressCachingService = ScenarioProgressCachingService;
exports.ScenarioProgressCachingService = ScenarioProgressCachingService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(caching_config_1.default.KEY)),
    __param(1, (0, common_1.Inject)(cache_manager_1.CACHE_MANAGER)),
    __metadata("design:paramtypes", [void 0, Object])
], ScenarioProgressCachingService);
//# sourceMappingURL=scenario-progress-caching.service.js.map