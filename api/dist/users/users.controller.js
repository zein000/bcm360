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
var UsersController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const change_password_dto_1 = require("./dto/change-password.dto");
const invite_user_dto_1 = require("./dto/invite-user.dto");
const reset_password_dto_1 = require("./dto/reset-password.dto");
const update_user_dto_1 = require("./dto/update-user.dto");
const jwt_api_decorators_decorator_1 = require("../common/decorators/jwt-api-decorators.decorator");
const base_response_dto_1 = require("../common/dto/base-response.dto");
const auth_response_dto_1 = require("../auth/dto/auth-response.dto");
const error_response_dto_1 = require("../auth/dto/error-response.dto");
const email_auth_guard_service_1 = require("../auth/guards/email-auth-guard.service");
const jwt_refresh_auth_guard_1 = require("../auth/guards/jwt-refresh-auth.guard");
const clear_user_info_interceptor_1 = require("../caching/interceptors/clear-user-info.interceptor");
const event_name_enum_1 = require("../enums/event-name.enum");
const event_history_interceptor_1 = require("../event-history/interceptor/event-history.interceptor");
const codes_1 = require("../permissions/enum/codes");
const auth_response_dto_2 = require("./dto/auth-response.dto");
const confirm_email_dto_1 = require("./dto/confirm-email.dto");
const delete_user_dto_1 = require("./dto/delete-user.dto");
const login_dto_1 = require("./dto/login.dto");
const paginated_users_dto_1 = require("./dto/paginated-users.dto");
const set_password_dto_1 = require("./dto/set-password.dto");
const user_id_parm_dto_1 = require("./dto/user-id-parm.dto");
const user_info_dto_1 = require("./dto/user-info.dto");
const user_search_params_dto_1 = require("./dto/user-search-params.dto");
const users_service_1 = require("./users.service");
const accept_invitation_dto_1 = require("./dto/accept-invitation.dto");
let UsersController = UsersController_1 = class UsersController {
    constructor(usersService) {
        this.usersService = usersService;
        this.logger = new common_1.Logger(UsersController_1.name);
    }
    async setPassword(body) {
        return this.usersService.setPassword(body);
    }
    async acceptInvitation(invitationData) {
        return this.usersService.acceptInvitation(invitationData);
    }
    async confirmEmail(body) {
        return this.usersService.confirmEmail(body);
    }
    async invite({ user }, body) {
        return this.usersService.invite(body.users, user, body.companyId);
    }
    async resendInviteEmail(body) {
        return this.usersService.resendInviteEmail(body);
    }
    findAll({ user }, userSearchParamsDTO) {
        this.logger.log(userSearchParamsDTO);
        return this.usersService.findAll(userSearchParamsDTO, user);
    }
    findMe({ user }) {
        return new user_info_dto_1.UserInfoDTO(user);
    }
    findOneById({ user }, { id }) {
        return this.usersService.getUserInfoById(id, user);
    }
    async changePassword({ user }, { oldPassword, password, confirmPassword }) {
        return this.usersService.changePassword(user.id, oldPassword, password, confirmPassword);
    }
    async resetPassword({ email }) {
        return this.usersService.resetPassword(email);
    }
    updateMe({ user }, data) {
        this.logger.log(data);
        return this.usersService.update(user.id, data);
    }
    async resetUserPassword({ id }) {
        return this.usersService.resetUserPassword(id);
    }
    updateUser(data, { user }, { id }) {
        return this.usersService.updateUser(id, user, data);
    }
    async loginAs({ id }) {
        return this.usersService.loginAs(id);
    }
    async login(req, body) {
        var _a;
        return this.usersService.login(req.user, (_a = body === null || body === void 0 ? void 0 : body.isRememberMe) !== null && _a !== void 0 ? _a : false);
    }
    async refreshToken(req) {
        return this.usersService.refreshToken(req.user);
    }
    deleteUser({ user }, { id }) {
        return this.usersService.delete(id, user);
    }
    async logout(req) {
        return this.usersService.logout(req);
    }
};
exports.UsersController = UsersController;
__decorate([
    (0, common_1.Post)("set-password"),
    (0, common_1.HttpCode)(200),
    (0, common_1.UseInterceptors)((0, event_history_interceptor_1.EventHistoryInterceptor)(event_name_enum_1.EventName.REGISTRATION)),
    (0, swagger_1.ApiOperation)({
        description: "User sets password. Authenticates via invitation token",
        summary: "Setup password",
    }),
    (0, swagger_1.ApiOkResponse)({
        type: auth_response_dto_2.UserAuthResponseDTO,
        description: `Returns token status.
        If token is valid returns authorization token and account info for the user.
        If token is expired returns user email to use for resending invitation`,
    }),
    (0, swagger_1.ApiBadRequestResponse)({ type: error_response_dto_1.ErrorResponseDTO, description: "Invalid request data." }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [set_password_dto_1.SetPasswordDTO]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "setPassword", null);
__decorate([
    (0, common_1.Post)("accept-invitation"),
    (0, swagger_1.ApiOperation)({
        summary: "User accept invitation",
        description: `**PERMISSIONS: ${codes_1.PermissionCodes.CHANGE_PASSWORD}**`,
    }),
    (0, common_1.UseInterceptors)((0, event_history_interceptor_1.EventHistoryInterceptor)(event_name_enum_1.EventName.REGISTRATION)),
    (0, swagger_1.ApiOkResponse)({ type: user_info_dto_1.UserInfoDTO, description: "User account information" }),
    (0, swagger_1.ApiBadRequestResponse)({
        type: error_response_dto_1.ErrorResponseDTO,
        description: "Invalid request data",
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [accept_invitation_dto_1.AcceptInvitationDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "acceptInvitation", null);
__decorate([
    (0, common_1.Post)("confirm-email"),
    (0, common_1.HttpCode)(200),
    (0, common_1.UseInterceptors)((0, event_history_interceptor_1.EventHistoryInterceptor)(event_name_enum_1.EventName.EMAIL_CONFIRMATION)),
    (0, swagger_1.ApiOperation)({
        description: "User confirms changed email. Authenticates via token",
        summary: "Confirm email",
    }),
    (0, swagger_1.ApiOkResponse)({
        type: auth_response_dto_2.UserAuthResponseDTO,
        description: `Returns void.`,
    }),
    (0, swagger_1.ApiBadRequestResponse)({ type: error_response_dto_1.ErrorResponseDTO, description: "Invalid request data." }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [confirm_email_dto_1.ConfirmEmailDTO]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "confirmEmail", null);
__decorate([
    (0, common_1.Post)("invite"),
    (0, jwt_api_decorators_decorator_1.UseJWTWithApiKeyAuthorization)({ permissions: [codes_1.PermissionCodes.INVITE_USER] }),
    (0, swagger_1.ApiOperation)({
        summary: "Admin invites user",
        description: `**PERMISSIONS: ${codes_1.PermissionCodes.INVITE_USER}**`,
    }),
    (0, swagger_1.ApiOkResponse)({ type: user_info_dto_1.UserInfoDTO, description: "Returns account info for the user." }),
    (0, swagger_1.ApiBadRequestResponse)({
        type: error_response_dto_1.ErrorResponseDTO,
        description: "Invalid request data. Email already exists.",
    }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "invite", null);
__decorate([
    (0, common_1.Post)("resend-invite"),
    (0, jwt_api_decorators_decorator_1.UseJWTWithApiKeyAuthorization)({ permissions: [codes_1.PermissionCodes.INVITE_USER] }),
    (0, swagger_1.ApiOperation)({
        summary: "Admin invites user",
        description: `**PERMISSIONS: ${codes_1.PermissionCodes.INVITE_USER}**`,
    }),
    (0, swagger_1.ApiOkResponse)({ type: user_info_dto_1.UserInfoDTO, description: "Returns account info for the user." }),
    (0, swagger_1.ApiBadRequestResponse)({
        type: error_response_dto_1.ErrorResponseDTO,
        description: "Invalid request data. Email already exists.",
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [invite_user_dto_1.InviteUserDTO]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "resendInviteEmail", null);
__decorate([
    (0, common_1.Get)(),
    (0, jwt_api_decorators_decorator_1.UseJWTWithApiKeyAuthorization)({ permissions: [codes_1.PermissionCodes.GET_USER] }),
    (0, swagger_1.ApiOperation)({
        description: `**PERMISSIONS: ${codes_1.PermissionCodes.GET_USER}**\n\nAdmin gets all users`,
        summary: "Get all users",
    }),
    (0, swagger_1.ApiOkResponse)({
        type: paginated_users_dto_1.PaginatedUsersDTO,
        description: "Paginated list of users with pagination metadata.",
    }),
    (0, swagger_1.ApiBadRequestResponse)({ type: error_response_dto_1.ErrorResponseDTO, description: "Invalid request data." }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, user_search_params_dto_1.UserSearchParamsDTO]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)("me"),
    (0, jwt_api_decorators_decorator_1.UseJWTWithApiKeyAuthorization)({ permissions: [codes_1.PermissionCodes.GET_ME] }),
    (0, swagger_1.ApiOperation)({
        summary: "User gets self",
        description: `**PERMISSIONS: ${codes_1.PermissionCodes.GET_ME}**`,
    }),
    (0, swagger_1.ApiOkResponse)({ type: user_info_dto_1.UserInfoDTO, description: "My user account information" }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", user_info_dto_1.UserInfoDTO)
], UsersController.prototype, "findMe", null);
__decorate([
    (0, common_1.Get)(":id"),
    (0, jwt_api_decorators_decorator_1.UseJWTWithApiKeyAuthorization)({ permissions: [codes_1.PermissionCodes.GET_USER] }),
    (0, swagger_1.ApiOperation)({
        summary: "Get user",
        description: `**PERMISSIONS: ${codes_1.PermissionCodes.GET_USER}**\n\nAdmin gets user by Id`,
    }),
    (0, swagger_1.ApiOkResponse)({ type: user_info_dto_1.UserInfoDTO, description: "User account information" }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, user_id_parm_dto_1.UserIdParamDTO]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "findOneById", null);
__decorate([
    (0, common_1.Patch)("change-password"),
    (0, jwt_api_decorators_decorator_1.UseJWTWithApiKeyAuthorization)({ permissions: [codes_1.PermissionCodes.CHANGE_PASSWORD] }),
    (0, swagger_1.ApiOperation)({
        summary: "User changes password",
        description: `**PERMISSIONS: ${codes_1.PermissionCodes.CHANGE_PASSWORD}**`,
    }),
    (0, swagger_1.ApiOkResponse)({ type: user_info_dto_1.UserInfoDTO, description: "User account information" }),
    (0, swagger_1.ApiBadRequestResponse)({
        type: error_response_dto_1.ErrorResponseDTO,
        description: "Invalid request data. Invalid old password. Password mismatch",
    }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, change_password_dto_1.ChangePasswordDTO]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "changePassword", null);
__decorate([
    (0, common_1.Post)("reset-password"),
    (0, swagger_1.ApiOperation)({
        summary: "User resets password",
    }),
    (0, swagger_1.ApiCreatedResponse)({ type: (base_response_dto_1.BaseResponseDTO) }),
    (0, swagger_1.ApiBadRequestResponse)({ type: error_response_dto_1.ErrorResponseDTO, description: "Invalid request data." }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [reset_password_dto_1.ResetPasswordDTO]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "resetPassword", null);
__decorate([
    (0, common_1.Patch)(),
    (0, jwt_api_decorators_decorator_1.UseJWTWithApiKeyAuthorization)({ permissions: [codes_1.PermissionCodes.UPDATE_ME] }),
    (0, common_1.UseInterceptors)(clear_user_info_interceptor_1.ClearUserInfoCacheInterceptor),
    (0, swagger_1.ApiOperation)({
        summary: "User changes self",
        description: `**PERMISSIONS: ${codes_1.PermissionCodes.UPDATE_ME}**`,
    }),
    (0, swagger_1.ApiOkResponse)({ type: user_info_dto_1.UserInfoDTO, description: "User account information" }),
    (0, swagger_1.ApiBadRequestResponse)({ type: error_response_dto_1.ErrorResponseDTO, description: "Invalid request data." }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, update_user_dto_1.UpdateUserDTO]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "updateMe", null);
__decorate([
    (0, common_1.Post)(":id/reset-password"),
    (0, jwt_api_decorators_decorator_1.UseJWTWithApiKeyAuthorization)({ permissions: [codes_1.PermissionCodes.UPDATE_USER] }),
    (0, swagger_1.ApiOperation)({
        summary: "Admin sends reset password to user",
    }),
    (0, swagger_1.ApiCreatedResponse)({ type: (base_response_dto_1.BaseResponseDTO) }),
    (0, swagger_1.ApiBadRequestResponse)({ type: error_response_dto_1.ErrorResponseDTO, description: "Invalid request data." }),
    __param(0, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_id_parm_dto_1.UserIdParamDTO]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "resetUserPassword", null);
__decorate([
    (0, common_1.Patch)(":id"),
    (0, jwt_api_decorators_decorator_1.UseJWTWithApiKeyAuthorization)({ permissions: [codes_1.PermissionCodes.UPDATE_USER] }),
    (0, common_1.UseInterceptors)(clear_user_info_interceptor_1.ClearUserInfoCacheInterceptor),
    (0, swagger_1.ApiOperation)({
        summary: "User changes another user",
        description: `**PERMISSIONS: ${codes_1.PermissionCodes.UPDATE_USER}**`,
    }),
    (0, swagger_1.ApiOkResponse)({ type: user_info_dto_1.UserInfoDTO, description: "User account information" }),
    (0, swagger_1.ApiBadRequestResponse)({ type: error_response_dto_1.ErrorResponseDTO, description: "Invalid request data." }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_user_dto_1.UpdateUserDTO, Object, user_id_parm_dto_1.UserIdParamDTO]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "updateUser", null);
__decorate([
    (0, common_1.Post)("loginAs"),
    (0, jwt_api_decorators_decorator_1.UseJWTWithApiKeyAuthorization)({ permissions: [codes_1.PermissionCodes.GLOBAL_ADMIN] }),
    (0, swagger_1.ApiOperation)({
        summary: "User logs in",
    }),
    (0, swagger_1.ApiCreatedResponse)({
        type: auth_response_dto_1.AuthResponseDTO,
        description: "Returns authorization tokens and account info for the user.",
    }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: "Invalid credentials" }),
    (0, swagger_1.ApiBody)({ type: login_dto_1.LoginDTO }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "loginAs", null);
__decorate([
    (0, common_1.Post)("login"),
    (0, common_1.HttpCode)(200),
    (0, common_1.UseGuards)(email_auth_guard_service_1.EmailAuthGuard),
    (0, common_1.UseInterceptors)((0, event_history_interceptor_1.EventHistoryInterceptor)(event_name_enum_1.EventName.LOGIN)),
    (0, swagger_1.ApiOperation)({
        summary: "User logs in",
    }),
    (0, swagger_1.ApiCreatedResponse)({
        type: auth_response_dto_1.AuthResponseDTO,
        description: "Returns authorization tokens and account info for the user.",
    }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: "Invalid credentials" }),
    (0, swagger_1.ApiBody)({ type: login_dto_1.LoginDTO }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, login_dto_1.LoginDTO]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "login", null);
__decorate([
    (0, common_1.Post)("refresh-token"),
    (0, common_1.HttpCode)(200),
    (0, common_1.UseGuards)(jwt_refresh_auth_guard_1.JwtRefreshAuthGuard),
    (0, swagger_1.ApiOperation)({
        summary: "Refresh JWT token",
    }),
    (0, swagger_1.ApiCreatedResponse)({
        type: auth_response_dto_1.AuthResponseDTO,
        description: "Returns authorization tokens and account info for the user.",
    }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: "Invalid credentials" }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "refreshToken", null);
__decorate([
    (0, common_1.Delete)(":id"),
    (0, jwt_api_decorators_decorator_1.UseJWTWithApiKeyAuthorization)({ permissions: [codes_1.PermissionCodes.DELETE_USER] }),
    (0, swagger_1.ApiOperation)({
        summary: "Deletes user by id",
        description: `**PERMISSIONS: ${codes_1.PermissionCodes.DELETE_USER}**`,
    }),
    (0, swagger_1.ApiOkResponse)({ type: delete_user_dto_1.DeleteUserDTO, description: "User information" }),
    (0, swagger_1.ApiBadRequestResponse)({ type: error_response_dto_1.ErrorResponseDTO, description: "Invalid request data." }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, user_id_parm_dto_1.UserIdParamDTO]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "deleteUser", null);
__decorate([
    (0, common_1.Post)("logout"),
    (0, common_1.HttpCode)(200),
    (0, jwt_api_decorators_decorator_1.UseJWTWithApiKeyAuthorization)({ permissions: [codes_1.PermissionCodes.LOGOUT] }),
    (0, swagger_1.ApiOperation)({
        summary: "Logout the user and blacklist their jwt",
    }),
    (0, swagger_1.ApiCreatedResponse)({
        description: "Returns ok and saves the currently used token as blacklisted.",
    }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: "Invalid credentials" }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "logout", null);
exports.UsersController = UsersController = UsersController_1 = __decorate([
    (0, swagger_1.ApiTags)("Users"),
    (0, common_1.Controller)("users"),
    __metadata("design:paramtypes", [users_service_1.UsersService])
], UsersController);
//# sourceMappingURL=users.controller.js.map