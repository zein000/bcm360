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
var CourseProgressService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CourseProgressService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const schedule_1 = require("@nestjs/schedule");
const app_config_1 = require("../app/config/app.config");
const scenario_progress_caching_service_1 = require("../caching/services/scenario-progress-caching.service");
const dto_1 = require("../common/dto");
const course_service_1 = require("../courses/course.service");
const mail_service_1 = require("../mail/mail.service");
const base_roles_1 = require("../roles/constants/base-roles");
const uuid_1 = require("uuid");
const course_progress_gateway_1 = require("./course-progress.gateway");
const cource_progress_info_dto_1 = require("./dto/cource-progress-info.dto");
const AdditionalStatusInfoTags_enum_1 = require("./enum/AdditionalStatusInfoTags.enum");
const ScenarioMessageTypes_enum_1 = require("./enum/ScenarioMessageTypes.enum");
const SocketEvents_enum_1 = require("./enum/SocketEvents.enum");
const Status_1 = require("./enum/Status");
const export_scenario_progress_service_1 = require("./export-scenario-progress.service");
const course_progress_model_1 = require("./models/course-progress.model");
const course_progress_content_repository_1 = require("./repositories/course-progress-content.repository");
const course_progress_users_repository_1 = require("./repositories/course-progress-users.repository");
const course_progress_repository_1 = require("./repositories/course-progress.repository");
const protocol_decisions_repository_1 = require("./repositories/protocol-decisions.repository");
const protocol_history_repository_1 = require("./repositories/protocol-history.repository");
const protocol_messages_repository_1 = require("./repositories/protocol-messages.repository");
const getUnique_1 = require("./utils/getUnique");
let CourseProgressService = CourseProgressService_1 = class CourseProgressService {
    constructor(config, courseProgressRepository, contentCourseProgressRepository, usersCourseProgressRepository, protocolDecisionRepository, protocolHistoryRepository, protocolMessagesRepository, courseService, courseProgressGateway, mailService, scenarioProgressCachingService, jwtService, exportScenarioProgressService) {
        this.config = config;
        this.courseProgressRepository = courseProgressRepository;
        this.contentCourseProgressRepository = contentCourseProgressRepository;
        this.usersCourseProgressRepository = usersCourseProgressRepository;
        this.protocolDecisionRepository = protocolDecisionRepository;
        this.protocolHistoryRepository = protocolHistoryRepository;
        this.protocolMessagesRepository = protocolMessagesRepository;
        this.courseService = courseService;
        this.courseProgressGateway = courseProgressGateway;
        this.mailService = mailService;
        this.scenarioProgressCachingService = scenarioProgressCachingService;
        this.jwtService = jwtService;
        this.exportScenarioProgressService = exportScenarioProgressService;
        this.logger = new common_1.Logger(CourseProgressService_1.name);
    }
    async handleCron() {
        this.logger.debug("Running scheduled task to complete all scenarios that are not active");
        try {
            const currentScenariosInProgress = await this.courseProgressRepository.findAllScenariosInProgress();
            if (!currentScenariosInProgress.length) {
                this.logger.debug("No scenarios in progress.");
                return;
            }
            await this.bulkFinishingScenariosInProgress(currentScenariosInProgress);
            this.logger.debug(`Completed processing ${currentScenariosInProgress.length} scenarios.`);
        }
        catch (error) {
            this.logger.error("Error during running scheduled task to complete all scenarios that are not active:", error);
        }
    }
    async bulkFinishingScenariosInProgress(currentScenariosInProgress, forceFinishing = false) {
        const tasks = currentScenariosInProgress.map(async (scenario) => {
            const existedProgress = await this.scenarioProgressCachingService.getScenarioProgress(scenario.id, true);
            const lastUpdateTimeStamp = existedProgress === null || existedProgress === void 0 ? void 0 : existedProgress.lastUpdateTimeStamp;
            const currentTimeStamp = Date.now();
            if (!lastUpdateTimeStamp ||
                currentTimeStamp - lastUpdateTimeStamp > 24 * 60 * 60 * 1000 ||
                forceFinishing) {
                return Promise.all([
                    this.finalizeSession(scenario.id, Status_1.CourseProgressEnum.Paused, AdditionalStatusInfoTags_enum_1.AdditionalStatusInfoTags.AUTO_COMPLETED),
                    this.scenarioProgressCachingService.clearTemporaryContentForCourseProgress(scenario.id),
                    this.scenarioProgressCachingService.removeActiveTimerStage(scenario.id),
                ]);
            }
        });
        return Promise.all(tasks);
    }
    async initializeTrainingCourse(data, errInfo) {
        var _a;
        const existedScenarioInProgress = await this.courseProgressRepository.findAllScenariosInProgressForUser(errInfo.id);
        if (existedScenarioInProgress.length) {
            await this.bulkFinishingScenariosInProgress(existedScenarioInProgress, true);
        }
        const courseProgress = new course_progress_model_1.default();
        courseProgress.status = Status_1.CourseProgressEnum.InProgress;
        courseProgress.courseId = data.courseId;
        courseProgress.userId = data.userId;
        const courseProgressInfo = (await this.courseProgressRepository.saveCourseProgress(courseProgress)).dataValues;
        const courseInfo = await this.courseService.findOne(data.courseId);
        const courseScenario = courseInfo === null || courseInfo === void 0 ? void 0 : courseInfo.json;
        const isOnlyOneStage = (courseScenario === null || courseScenario === void 0 ? void 0 : courseScenario.Content) && ((_a = courseScenario === null || courseScenario === void 0 ? void 0 : courseScenario.Content) === null || _a === void 0 ? void 0 : _a.length) - 1 === 0;
        await this.scenarioProgressCachingService.onCourseInitialize(courseProgressInfo.id, errInfo, courseScenario, isOnlyOneStage);
        return new cource_progress_info_dto_1.CourseProgressInfoDto(courseProgress);
    }
    async findOne(id) {
        const courseProgress = await this.courseProgressRepository.findOneCourseProgress(id);
        if (!courseProgress) {
            throw new common_1.NotFoundException("Scenario info in progress was not found");
        }
        return new cource_progress_info_dto_1.CourseProgressInfoDto(courseProgress);
    }
    async checkIfAnyScenariosInProgress(user) {
        var _a;
        const courseProgress = await this.courseProgressRepository.findLastScenarioInProgress(user.id);
        if (!(courseProgress === null || courseProgress === void 0 ? void 0 : courseProgress.id)) {
            return null;
        }
        const existedProgress = await this.scenarioProgressCachingService.getScenarioProgress(courseProgress.id, true);
        if ((existedProgress === null || existedProgress === void 0 ? void 0 : existedProgress.errInfo) && ((_a = existedProgress === null || existedProgress === void 0 ? void 0 : existedProgress.errInfo) === null || _a === void 0 ? void 0 : _a.email) === user.email) {
            return new cource_progress_info_dto_1.CourseProgressInfoDto(courseProgress);
        }
        return null;
    }
    async finalizeSession(courseProgressId, status = Status_1.CourseProgressEnum.Success, phaseEndText = AdditionalStatusInfoTags_enum_1.AdditionalStatusInfoTags.SUCCESS) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y;
        const courseProgressInfo = await this.courseProgressRepository.findOneCourseProgress(courseProgressId);
        if (!courseProgressInfo) {
            throw new common_1.NotFoundException("Scenario progress was not found");
        }
        const scenarioInfo = await this.scenarioProgressCachingService.getScenarioProgress(courseProgressId, true);
        try {
            const protocolHistory = scenarioInfo.protocolHistory;
            const preparedUsers = scenarioInfo.users.map((user) => {
                var _a, _b, _c, _d, _e, _f, _g, _h;
                return ({
                    id: user.id,
                    courseProgressId,
                    firstName: (_a = user === null || user === void 0 ? void 0 : user.firstName) !== null && _a !== void 0 ? _a : "",
                    lastName: (_b = user === null || user === void 0 ? void 0 : user.lastName) !== null && _b !== void 0 ? _b : "",
                    email: (_c = user === null || user === void 0 ? void 0 : user.email) !== null && _c !== void 0 ? _c : "",
                    isAccepted: (_d = user === null || user === void 0 ? void 0 : user.isAccepted) !== null && _d !== void 0 ? _d : false,
                    isERR: ((_e = scenarioInfo === null || scenarioInfo === void 0 ? void 0 : scenarioInfo.errInfo) === null || _e === void 0 ? void 0 : _e.id) === user.id,
                    firstJoinTimeStamp: (user === null || user === void 0 ? void 0 : user.isAccepted) ? ((_f = user === null || user === void 0 ? void 0 : user.firstJoinTimeStamp) !== null && _f !== void 0 ? _f : 0) : 0,
                    exitTimeStamp: (user === null || user === void 0 ? void 0 : user.isAccepted) ? ((_g = user === null || user === void 0 ? void 0 : user.exitTimeStamp) !== null && _g !== void 0 ? _g : Date.now()) : 0,
                    invitedTimeStamp: (_h = user === null || user === void 0 ? void 0 : user.invitedTimeStamp) !== null && _h !== void 0 ? _h : 0,
                });
            });
            await this.usersCourseProgressRepository.bulkCreate(preparedUsers);
            const preparedContent = scenarioInfo.stageContent.map((content) => {
                var _a;
                return ({
                    id: content.id,
                    content: content.content,
                    contentType: content.contentType,
                    stageNumber: content.stageNumber,
                    title: (_a = content === null || content === void 0 ? void 0 : content.title) !== null && _a !== void 0 ? _a : "Information",
                    timeStamp: content.timeStamp,
                    courseProgressId,
                });
            });
            await this.contentCourseProgressRepository.bulkCreate(preparedContent);
            for (const item of protocolHistory) {
                if (item.type === ScenarioMessageTypes_enum_1.ScenarioMessageTypes.MESSAGE ||
                    item.type === ScenarioMessageTypes_enum_1.ScenarioMessageTypes.DECISION) {
                    let userId = null;
                    if (((_a = item === null || item === void 0 ? void 0 : item.data) === null || _a === void 0 ? void 0 : _a.email) === ((_b = scenarioInfo === null || scenarioInfo === void 0 ? void 0 : scenarioInfo.errInfo) === null || _b === void 0 ? void 0 : _b.email)) {
                        userId = (_c = scenarioInfo === null || scenarioInfo === void 0 ? void 0 : scenarioInfo.errInfo) === null || _c === void 0 ? void 0 : _c.id;
                    }
                    else if (((_d = item === null || item === void 0 ? void 0 : item.data) === null || _d === void 0 ? void 0 : _d.userId) && typeof ((_e = item === null || item === void 0 ? void 0 : item.data) === null || _e === void 0 ? void 0 : _e.userId) === "string") {
                        userId = (_f = item.data) === null || _f === void 0 ? void 0 : _f.userId;
                    }
                    const protocolHistoryItem = await this.protocolHistoryRepository.create({
                        courseProgressId,
                        type: item.type,
                        timestamp: item.timestamp,
                        userId,
                    });
                    if (item.type === ScenarioMessageTypes_enum_1.ScenarioMessageTypes.DECISION) {
                        const validUserIdsInSession = new Set(scenarioInfo.users.map(user => user.id));
                        let userVotedIds = ((_h = (_g = item.data) === null || _g === void 0 ? void 0 : _g.finalDecision) === null || _h === void 0 ? void 0 : _h.userVotedIds) || [];
                        const initiatorNumericId = (_j = courseProgressInfo.userId) === null || _j === void 0 ? void 0 : _j.toString();
                        const initiatorParticipantId = (_k = scenarioInfo === null || scenarioInfo === void 0 ? void 0 : scenarioInfo.errInfo) === null || _k === void 0 ? void 0 : _k.id;
                        if (initiatorNumericId && initiatorParticipantId) {
                            userVotedIds = userVotedIds.map(id => (id === null || id === void 0 ? void 0 : id.toString()) === initiatorNumericId ? initiatorParticipantId : id);
                        }
                        const validVotedBy = userVotedIds.filter(id => id && validUserIdsInSession.has(id));
                        await this.protocolDecisionRepository.create({
                            protocolHistoryId: protocolHistoryItem.id,
                            decision: item.data.name,
                            finalDecision: ((_l = item.data.finalDecision) === null || _l === void 0 ? void 0 : _l.option) || "Not selected",
                        }, validVotedBy);
                    }
                    else if (item.type === ScenarioMessageTypes_enum_1.ScenarioMessageTypes.MESSAGE) {
                        await this.protocolMessagesRepository.create({
                            protocolHistoryId: protocolHistoryItem.id,
                            message: item.data.message,
                            options: ((_m = item.data) === null || _m === void 0 ? void 0 : _m.options) ? JSON.stringify(item.data.options) : null,
                        });
                    }
                }
            }
        }
        catch (error) {
            console.log("\n\n error during related scenario content saving", error, "\n\n");
            throw new Error(`Failed to save scenario content: ${error.message}`);
        }
        const resultStatus = (_r = (_q = (_p = (_o = scenarioInfo === null || scenarioInfo === void 0 ? void 0 : scenarioInfo.json) === null || _o === void 0 ? void 0 : _o.Content) === null || _p === void 0 ? void 0 : _p[scenarioInfo.currentStage]) === null || _q === void 0 ? void 0 : _q.phaseEndResult) !== null && _r !== void 0 ? _r : status;
        courseProgressInfo.status = resultStatus;
        courseProgressInfo.finalPhaseId = (_u = (_t = (_s = scenarioInfo === null || scenarioInfo === void 0 ? void 0 : scenarioInfo.json) === null || _s === void 0 ? void 0 : _s.Content) === null || _t === void 0 ? void 0 : _t[scenarioInfo.currentStage]) === null || _u === void 0 ? void 0 : _u.id;
        courseProgressInfo.scenarioEndMessage =
            (_y = (_x = (_w = (_v = scenarioInfo === null || scenarioInfo === void 0 ? void 0 : scenarioInfo.json) === null || _v === void 0 ? void 0 : _v.Content) === null || _w === void 0 ? void 0 : _w[scenarioInfo.currentStage]) === null || _x === void 0 ? void 0 : _x.phaseEndText) !== null && _y !== void 0 ? _y : phaseEndText;
        courseProgressInfo.finishDate = new Date();
        await this.courseProgressRepository.saveCourseProgress(courseProgressInfo);
        await this.scenarioProgressCachingService.clearScenarioProgress(courseProgressId);
        return scenarioInfo;
    }
    async inviteUserOnScenario(courseProgressId, errInfo, invitedUsers) {
        const timeStamp = Date.now();
        const currentScenarioProgress = await this.scenarioProgressCachingService.getScenarioProgress(courseProgressId);
        const existedUsers = currentScenarioProgress.users;
        const sentEmails = [];
        const results = await Promise.allSettled(invitedUsers.map(async (invitedUser) => {
            var _a, _b, _c, _d, _e;
            const existedUser = existedUsers.find((user) => user.email === invitedUser.email);
            let token;
            let id;
            if (existedUser) {
                id = existedUser.id;
                if (existedUser === null || existedUser === void 0 ? void 0 : existedUser.isRemoved) {
                    token = await this.jwtService.signAsync({
                        id,
                        courseProgressId,
                        email: invitedUser.email,
                    });
                }
                else {
                    token = existedUser === null || existedUser === void 0 ? void 0 : existedUser.token;
                }
            }
            else {
                id = (0, uuid_1.v4)();
                token = await this.jwtService.signAsync({
                    id,
                    courseProgressId,
                    email: invitedUser.email,
                });
            }
            const url = new URL("/first-login", this.config.webAppDomain);
            url.searchParams.append("token", token);
            url.searchParams.append("courseProgressId", courseProgressId);
            try {
                if (!(existedUser === null || existedUser === void 0 ? void 0 : existedUser.isAccepted) || (existedUser === null || existedUser === void 0 ? void 0 : existedUser.isRemoved)) {
                    await this.mailService.sendUserInvitationOnCourse(errInfo, invitedUser.email, url.toString(), (_b = (_a = currentScenarioProgress === null || currentScenarioProgress === void 0 ? void 0 : currentScenarioProgress.json) === null || _a === void 0 ? void 0 : _a.scenarioName) !== null && _b !== void 0 ? _b : "Scenario", `${(_c = errInfo === null || errInfo === void 0 ? void 0 : errInfo.firstName) !== null && _c !== void 0 ? _c : ""} ${(_d = errInfo === null || errInfo === void 0 ? void 0 : errInfo.lastName) !== null && _d !== void 0 ? _d : ""}`);
                }
                return {
                    id,
                    email: invitedUser.email,
                    token,
                    isExistedInvitation: !!existedUser && !(existedUser === null || existedUser === void 0 ? void 0 : existedUser.isRemoved),
                    permissions: (_e = invitedUser === null || invitedUser === void 0 ? void 0 : invitedUser.permissions) !== null && _e !== void 0 ? _e : [],
                    firstName: existedUser === null || existedUser === void 0 ? void 0 : existedUser.firstName,
                    lastName: existedUser === null || existedUser === void 0 ? void 0 : existedUser.lastName,
                    isAccepted: existedUser === null || existedUser === void 0 ? void 0 : existedUser.isAccepted,
                    firstJoinTimeStamp: existedUser === null || existedUser === void 0 ? void 0 : existedUser.firstJoinTimeStamp,
                    exitTimeStamp: existedUser === null || existedUser === void 0 ? void 0 : existedUser.exitTimeStamp,
                    invitedTimeStamp: existedUser === null || existedUser === void 0 ? void 0 : existedUser.invitedTimeStamp,
                };
            }
            catch (error) {
                console.error(`Failed to send email to ${invitedUser.email}`, error);
                return { email: invitedUser.email, error };
            }
        }));
        results.forEach((result) => {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j;
            if (result.status === "fulfilled") {
                sentEmails.push({
                    email: result.value.email,
                    id: result.value.id,
                    isExistedInvitation: (_a = result === null || result === void 0 ? void 0 : result.value) === null || _a === void 0 ? void 0 : _a.isExistedInvitation,
                    token: (_b = result === null || result === void 0 ? void 0 : result.value) === null || _b === void 0 ? void 0 : _b.token,
                    permissions: (_c = result === null || result === void 0 ? void 0 : result.value) === null || _c === void 0 ? void 0 : _c.permissions,
                    firstName: (_d = result === null || result === void 0 ? void 0 : result.value) === null || _d === void 0 ? void 0 : _d.firstName,
                    lastName: (_e = result === null || result === void 0 ? void 0 : result.value) === null || _e === void 0 ? void 0 : _e.lastName,
                    isAccepted: (_f = result === null || result === void 0 ? void 0 : result.value) === null || _f === void 0 ? void 0 : _f.isAccepted,
                    exitTimeStamp: (_g = result === null || result === void 0 ? void 0 : result.value) === null || _g === void 0 ? void 0 : _g.exitTimeStamp,
                    firstJoinTimeStamp: (_h = result === null || result === void 0 ? void 0 : result.value) === null || _h === void 0 ? void 0 : _h.firstJoinTimeStamp,
                    invitedTimeStamp: (_j = result === null || result === void 0 ? void 0 : result.value) === null || _j === void 0 ? void 0 : _j.invitedTimeStamp,
                });
            }
        });
        const newUsers = sentEmails
            .filter((item) => !(item === null || item === void 0 ? void 0 : item.isExistedInvitation))
            .map(({ email, id, token, permissions, firstName, lastName, isAccepted, exitTimeStamp, firstJoinTimeStamp, invitedTimeStamp, }) => ({
            id,
            email,
            firstName: firstName !== null && firstName !== void 0 ? firstName : "",
            lastName: lastName !== null && lastName !== void 0 ? lastName : "",
            isAccepted: !!isAccepted,
            isRemoved: false,
            isActive: false,
            token: token,
            invitedTimeStamp: invitedTimeStamp !== null && invitedTimeStamp !== void 0 ? invitedTimeStamp : timeStamp,
            exitTimeStamp: exitTimeStamp !== null && exitTimeStamp !== void 0 ? exitTimeStamp : 0,
            firstJoinTimeStamp: firstJoinTimeStamp !== null && firstJoinTimeStamp !== void 0 ? firstJoinTimeStamp : 0,
            permissions: (0, getUnique_1.getUnique)(permissions, base_roles_1.participantPermissionCodes),
        }));
        const uniqueUsersMap = new Map();
        [...currentScenarioProgress.users, ...newUsers].forEach((user) => {
            uniqueUsersMap.set(user.email, user);
        });
        currentScenarioProgress.users = Array.from(uniqueUsersMap.values());
        currentScenarioProgress.protocolHistory.push({
            id: (0, uuid_1.v4)(),
            data: {
                userId: errInfo === null || errInfo === void 0 ? void 0 : errInfo.id,
                firstName: errInfo === null || errInfo === void 0 ? void 0 : errInfo.firstName,
                lastName: errInfo === null || errInfo === void 0 ? void 0 : errInfo.lastName,
                email: errInfo === null || errInfo === void 0 ? void 0 : errInfo.email,
                message: `invited-users`,
                options: {
                    usersString: sentEmails.map((user) => user.email).join(", "),
                },
            },
            type: ScenarioMessageTypes_enum_1.ScenarioMessageTypes.MESSAGE,
            timestamp: timeStamp,
        });
        await this.scenarioProgressCachingService.setScenario(courseProgressId, currentScenarioProgress);
        const connectedUsers = await this.courseProgressGateway.getConnectedUsersInRoom(courseProgressId);
        this.courseProgressGateway.emitSocketEvent(courseProgressId, SocketEvents_enum_1.SocketEvents.UPDATE_CONNECTED_USERS, connectedUsers);
        this.courseProgressGateway.emitSocketEvent(courseProgressId, SocketEvents_enum_1.SocketEvents.ACTUAL_SCENARIO_DATA, currentScenarioProgress);
    }
    async acceptCourseProgressInvite(user, invitedUser, courseProgressId, accessToken) {
        var _a, _b, _c, _d;
        if (!(user === null || user === void 0 ? void 0 : user.isAccepted)) {
            const currentScenarioProgress = await this.scenarioProgressCachingService.getScenarioProgress(courseProgressId);
            const existedUserIndex = currentScenarioProgress.users.findIndex((existedUser) => existedUser.id === user.id);
            if (existedUserIndex !== -1) {
                currentScenarioProgress.users[existedUserIndex] = Object.assign(Object.assign({}, currentScenarioProgress.users[existedUserIndex]), { firstName: invitedUser.firstName, lastName: invitedUser.lastName, isAccepted: true, token: accessToken, firstJoinTimeStamp: Date.now() });
                currentScenarioProgress.protocolHistory.push({
                    id: (0, uuid_1.v4)(),
                    data: {
                        userId: (_a = currentScenarioProgress.users[existedUserIndex]) === null || _a === void 0 ? void 0 : _a.id,
                        firstName: (_b = currentScenarioProgress.users[existedUserIndex]) === null || _b === void 0 ? void 0 : _b.firstName,
                        lastName: (_c = currentScenarioProgress.users[existedUserIndex]) === null || _c === void 0 ? void 0 : _c.lastName,
                        email: (_d = currentScenarioProgress.users[existedUserIndex]) === null || _d === void 0 ? void 0 : _d.email,
                        message: `user-joined`,
                    },
                    type: ScenarioMessageTypes_enum_1.ScenarioMessageTypes.MESSAGE,
                    timestamp: Date.now(),
                });
                await this.scenarioProgressCachingService.setScenario(courseProgressId, currentScenarioProgress);
                this.courseProgressGateway.emitSocketEvent(courseProgressId, SocketEvents_enum_1.SocketEvents.ACTUAL_SCENARIO_DATA, currentScenarioProgress);
                return {
                    courseProgressId,
                    user: Object.assign(Object.assign({}, user), currentScenarioProgress.users[existedUserIndex]),
                    accessToken,
                };
            }
            else {
                this.scenarioProgressCachingService.unlockScenario(courseProgressId);
            }
        }
        return { courseProgressId, user, accessToken };
    }
    async findAll(pageOptions, user) {
        const { rows, count } = await this.courseProgressRepository.findAllAndCount(pageOptions.limit || 1000, pageOptions.skip, pageOptions.searchValue || null, user);
        const pageMeta = new dto_1.PageMetaDTO({ itemCount: count, pageOptions });
        return new dto_1.PageDTO(rows.map((course) => new cource_progress_info_dto_1.CourseProgressInfoDto(course)), pageMeta);
    }
    async delete(id, user) {
        return this.courseProgressRepository.deleteCourseProgress(id, user);
    }
    async exportScenarioProgressReport(courseProgressId, user, body, res) {
        const scenarioProgress = await this.courseProgressRepository.findCourseProgressWithRelatedDataForReport(courseProgressId, user);
        return await this.exportScenarioProgressService.sendExportFileInResponse(res, scenarioProgress, body);
    }
    async generateInviteLink(courseProgressId, email, errInfo = {}) {
        const timeStamp = Date.now();
        const currentScenarioProgress = await this.scenarioProgressCachingService.getScenarioProgress(courseProgressId);
        if (!currentScenarioProgress) {
            throw new common_1.NotFoundException("Szenariofortschritt nicht im Cache gefunden.");
        }
        const existedUser = currentScenarioProgress.users.find((user) => user.email === email);
        let token;
        let id;
        if (existedUser) {
            id = existedUser.id;
            if (existedUser === null || existedUser === void 0 ? void 0 : existedUser.isRemoved) {
                token = await this.jwtService.signAsync({
                    id,
                    courseProgressId,
                    email,
                });
            }
            else {
                token = existedUser.token;
            }
        }
        else {
            id = (0, uuid_1.v4)();
            token = await this.jwtService.signAsync({
                id,
                courseProgressId,
                email,
            });
        }
        const url = new URL("/first-login", this.config.webAppDomain);
        url.searchParams.append("token", token);
        url.searchParams.append("courseProgressId", courseProgressId);
        let userEntry;
        if (existedUser) {
            userEntry = Object.assign(Object.assign({}, existedUser), { token, isRemoved: false });
        }
        else {
            userEntry = {
                id,
                email,
                firstName: "",
                lastName: "",
                isAccepted: false,
                isRemoved: false,
                isActive: false,
                token,
                invitedTimeStamp: timeStamp,
                exitTimeStamp: 0,
                firstJoinTimeStamp: 0,
                permissions: (0, getUnique_1.getUnique)([], base_roles_1.participantPermissionCodes),
            };
        }
        const uniqueUsersMap = new Map();
        [...currentScenarioProgress.users, userEntry].forEach((user) => {
            uniqueUsersMap.set(user.email, user);
        });
        currentScenarioProgress.users = Array.from(uniqueUsersMap.values());
        currentScenarioProgress.protocolHistory.push({
            id: (0, uuid_1.v4)(),
            data: {
                userId: errInfo === null || errInfo === void 0 ? void 0 : errInfo.id,
                firstName: errInfo === null || errInfo === void 0 ? void 0 : errInfo.firstName,
                lastName: errInfo === null || errInfo === void 0 ? void 0 : errInfo.lastName,
                email: errInfo === null || errInfo === void 0 ? void 0 : errInfo.email,
                message: `Link generated:\n` + url.toString(),
                options: {
                    usersString: email,
                },
            },
            type: ScenarioMessageTypes_enum_1.ScenarioMessageTypes.MESSAGE,
            timestamp: timeStamp,
        });
        await this.scenarioProgressCachingService.setScenario(courseProgressId, currentScenarioProgress);
        this.courseProgressGateway.emitSocketEvent(courseProgressId, SocketEvents_enum_1.SocketEvents.ACTUAL_SCENARIO_DATA, currentScenarioProgress);
        return {
            link: url.toString(),
            userInfo: userEntry,
        };
    }
};
exports.CourseProgressService = CourseProgressService;
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_DAY_AT_MIDNIGHT),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CourseProgressService.prototype, "handleCron", null);
exports.CourseProgressService = CourseProgressService = CourseProgressService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(app_config_1.default.KEY)),
    __param(8, (0, common_1.Inject)((0, common_1.forwardRef)(() => course_progress_gateway_1.CourseProgressGateway))),
    __metadata("design:paramtypes", [void 0, course_progress_repository_1.CourseProgressRepository,
        course_progress_content_repository_1.CourseProgressContentRepository,
        course_progress_users_repository_1.CourseProgressUsersRepository,
        protocol_decisions_repository_1.ProtocolDecisionRepository,
        protocol_history_repository_1.ProtocolHistoryRepository,
        protocol_messages_repository_1.ProtocolMessagesRepository,
        course_service_1.CourseService,
        course_progress_gateway_1.CourseProgressGateway,
        mail_service_1.MailService,
        scenario_progress_caching_service_1.ScenarioProgressCachingService,
        jwt_1.JwtService,
        export_scenario_progress_service_1.ExportScenarioProgressService])
], CourseProgressService);
//# sourceMappingURL=course-progress.service.js.map