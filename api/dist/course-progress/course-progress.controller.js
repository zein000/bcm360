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
var CourseProgressController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CourseProgressController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const error_response_dto_1 = require("../auth/dto/error-response.dto");
const jwt_api_decorators_decorator_1 = require("../common/decorators/jwt-api-decorators.decorator");
const dto_1 = require("../common/dto");
const codes_1 = require("../permissions/enum/codes");
const user_info_dto_1 = require("../users/dto/user-info.dto");
const course_progress_service_1 = require("./course-progress.service");
const cource_progress_info_dto_1 = require("./dto/cource-progress-info.dto");
const create_course_progress_dto_1 = require("./dto/create-course-progress.dto");
const export_report_dto_1 = require("./dto/export-report.dto");
const connect_quest_service_1 = require("../quest/connect-quest.service");
const generate_link_dto_1 = require("./dto/generate-link.dto");
let CourseProgressController = CourseProgressController_1 = class CourseProgressController {
    constructor(courseProgressService, connectQuest) {
        this.courseProgressService = courseProgressService;
        this.connectQuest = connectQuest;
        this.logger = new common_1.Logger(CourseProgressController_1.name);
    }
    initializeScenario(data, { user }) {
        return this.courseProgressService.initializeTrainingCourse(data, user);
    }
    async checkScenariosInProgress({ user }) {
        return this.courseProgressService.checkIfAnyScenariosInProgress(user);
    }
    async findOne({ user }, id) {
        await this.connectQuest.cacheProgressIdUserId(id, user.id);
        return this.courseProgressService.findOne(id);
    }
    async getall(pageOptions, { user }) {
        return this.courseProgressService.findAll(pageOptions, user);
    }
    async checkIfAlreadyAccept({ user }) {
        if (user && (user === null || user === void 0 ? void 0 : user.token) && user.isAccepted) {
            return { user, accessToken: user === null || user === void 0 ? void 0 : user.token, courseProgressId: user === null || user === void 0 ? void 0 : user.courseProgressId };
        }
        return {};
    }
    async invite(body, { user }) {
        return this.courseProgressService.inviteUserOnScenario(body.courseProgressId, user, body.users);
    }
    async acceptInvite(body, { user }) {
        return this.courseProgressService.acceptCourseProgressInvite(user, body.user, body.courseProgressId, body.accessToken);
    }
    delete(params, { user }) {
        return this.courseProgressService.delete(params.id, user);
    }
    async exportScenarioReport({ id }, { user }, body, res) {
        await this.courseProgressService.exportScenarioProgressReport(id, user, body, res);
    }
    async generateInviteLink(body, { user }) {
        return this.courseProgressService.generateInviteLink(body.courseProgressId, body.email, user);
    }
};
exports.CourseProgressController = CourseProgressController;
__decorate([
    (0, common_1.Post)("/start"),
    (0, jwt_api_decorators_decorator_1.UseJWTWithApiKeyAuthorization)({ permissions: [codes_1.PermissionCodes.COURSES] }),
    (0, swagger_1.ApiOperation)({ summary: "Starts the scenario", description: "Starts the scenario" }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_course_progress_dto_1.CreateCourseProgressDTO, Object]),
    __metadata("design:returntype", void 0)
], CourseProgressController.prototype, "initializeScenario", null);
__decorate([
    (0, common_1.Get)("check-scenario-in-progress"),
    (0, jwt_api_decorators_decorator_1.UseJWTWithApiKeyAuthorization)({ permissions: [codes_1.PermissionCodes.USER] }),
    (0, swagger_1.ApiOperation)({ summary: "Check if any scenario is in progress", description: `**PERMISSIONS: ${codes_1.PermissionCodes.PARTICIPANT}**` }),
    (0, swagger_1.ApiOkResponse)({ type: cource_progress_info_dto_1.CourseProgressInfoDto }),
    (0, swagger_1.ApiBadRequestResponse)({ type: error_response_dto_1.ErrorResponseDTO }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CourseProgressController.prototype, "checkScenariosInProgress", null);
__decorate([
    (0, common_1.Get)(":id"),
    (0, jwt_api_decorators_decorator_1.UseJWTWithApiKeyAuthorization)({ permissions: [codes_1.PermissionCodes.PARTICIPANT] }),
    (0, swagger_1.ApiOperation)({ summary: "Get courses", description: `**PERMISSIONS: ${codes_1.PermissionCodes.PARTICIPANT}**` }),
    (0, swagger_1.ApiOkResponse)({ type: cource_progress_info_dto_1.CourseProgressInfoDto }),
    (0, swagger_1.ApiBadRequestResponse)({ type: error_response_dto_1.ErrorResponseDTO }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], CourseProgressController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)(),
    (0, jwt_api_decorators_decorator_1.UseJWTWithApiKeyAuthorization)({ permissions: [codes_1.PermissionCodes.COURSES] }),
    (0, swagger_1.ApiOperation)({ summary: "Get courses progress", description: `Get all courses progress` }),
    (0, swagger_1.ApiOkResponse)({ type: cource_progress_info_dto_1.CourseProgressInfoDto }),
    (0, swagger_1.ApiBadRequestResponse)({ type: error_response_dto_1.ErrorResponseDTO }),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.PageOptionsDTO, Object]),
    __metadata("design:returntype", Promise)
], CourseProgressController.prototype, "getall", null);
__decorate([
    (0, common_1.Post)("check-invitation"),
    (0, jwt_api_decorators_decorator_1.UseJWTWithApiKeyAuthorization)({ permissions: [codes_1.PermissionCodes.PARTICIPANT] }),
    (0, swagger_1.ApiOperation)({ summary: "Check if already accepted invitation" }),
    (0, swagger_1.ApiOkResponse)({ description: "Invitation has already been accepted" }),
    (0, swagger_1.ApiBadRequestResponse)({ type: error_response_dto_1.ErrorResponseDTO }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CourseProgressController.prototype, "checkIfAlreadyAccept", null);
__decorate([
    (0, common_1.Post)("invite"),
    (0, jwt_api_decorators_decorator_1.UseJWTWithApiKeyAuthorization)({ permissions: [codes_1.PermissionCodes.PARTICIPANT] }),
    (0, swagger_1.ApiOperation)({ summary: "ERR invites users on scenario" }),
    (0, swagger_1.ApiOkResponse)({ description: "Nothing returns" }),
    (0, swagger_1.ApiBadRequestResponse)({ type: error_response_dto_1.ErrorResponseDTO }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], CourseProgressController.prototype, "invite", null);
__decorate([
    (0, common_1.Post)("accept-invite"),
    (0, jwt_api_decorators_decorator_1.UseJWTWithApiKeyAuthorization)({ permissions: [codes_1.PermissionCodes.PARTICIPANT] }),
    (0, swagger_1.ApiOperation)({ summary: "Invited user accepts scenario`s invitation" }),
    (0, swagger_1.ApiOkResponse)({ type: user_info_dto_1.UserInfoDTO }),
    (0, swagger_1.ApiBadRequestResponse)({ type: error_response_dto_1.ErrorResponseDTO }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], CourseProgressController.prototype, "acceptInvite", null);
__decorate([
    (0, common_1.Delete)(":id"),
    (0, jwt_api_decorators_decorator_1.UseJWTWithApiKeyAuthorization)({ permissions: [codes_1.PermissionCodes.COURSES, codes_1.PermissionCodes.GLOBAL_ADMIN] }),
    (0, swagger_1.ApiOperation)({ summary: "Safely deletes", description: "Safely deletes the result of the scenario" }),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], CourseProgressController.prototype, "delete", null);
__decorate([
    (0, common_1.Post)("report/:id"),
    (0, jwt_api_decorators_decorator_1.UseJWTWithApiKeyAuthorization)({ permissions: [codes_1.PermissionCodes.GLOBAL_ADMIN] }),
    (0, swagger_1.ApiOperation)({ summary: "Receiving a report", description: "Receiving a report on the scenario" }),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, export_report_dto_1.ExportScenarioReportDto, Object]),
    __metadata("design:returntype", Promise)
], CourseProgressController.prototype, "exportScenarioReport", null);
__decorate([
    (0, common_1.Post)("generate-invite-link"),
    (0, jwt_api_decorators_decorator_1.UseJWTWithApiKeyAuthorization)({ permissions: [codes_1.PermissionCodes.PARTICIPANT] }),
    (0, swagger_1.ApiOperation)({ summary: "Generate scenario invite link without sending mail" }),
    (0, swagger_1.ApiOkResponse)({ description: "Returns invite link and user info", type: generate_link_dto_1.GeneratedInviteLinkResponseDTO }),
    (0, swagger_1.ApiBadRequestResponse)({ type: error_response_dto_1.ErrorResponseDTO }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], CourseProgressController.prototype, "generateInviteLink", null);
exports.CourseProgressController = CourseProgressController = CourseProgressController_1 = __decorate([
    (0, swagger_1.ApiTags)("Scenario Progress"),
    (0, common_1.Controller)("course-progress"),
    __metadata("design:paramtypes", [course_progress_service_1.CourseProgressService,
        connect_quest_service_1.ConnectQuestService])
], CourseProgressController);
//# sourceMappingURL=course-progress.controller.js.map