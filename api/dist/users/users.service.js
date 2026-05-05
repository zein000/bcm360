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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var UsersService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const user_exceptions_1 = require("../exceptions/user.exceptions");
const mail_service_1 = require("../mail/mail.service");
const user_util_1 = require("../common/user.util");
const roles_service_1 = require("../roles/roles.service");
const token_purpose_enum_1 = require("../tokens/enums/token-purpose.enum");
const token_status_enum_1 = require("../tokens/enums/token-status.enum");
const tokens_service_1 = require("../tokens/tokens.service");
const user_blacklist_service_1 = require("../user-blacklist/user-blacklist.service");
const codes_1 = require("../permissions/enum/codes");
const company_model_1 = require("../company/models/company.model");
const app_config_1 = require("../app/config/app.config");
const auth_service_1 = require("../auth/auth.service");
const dto_1 = require("../common/dto");
const errors_enum_1 = require("../enums/errors.enum");
const user_info_dto_1 = require("./dto/user-info.dto");
const user_repository_1 = require("./repositories/user.repository");
let UsersService = UsersService_1 = class UsersService {
    constructor(userRepo, config, mailService, authService, tokensService, rolesService, blacklistService) {
        this.userRepo = userRepo;
        this.config = config;
        this.mailService = mailService;
        this.authService = authService;
        this.tokensService = tokensService;
        this.rolesService = rolesService;
        this.blacklistService = blacklistService;
        this.logger = new common_1.Logger(UsersService_1.name);
        this.registrationUrl = "/accept-invitation";
        this.setPasswordUrl = "/change-password";
        this.emailConfirmation = "/confirm-email";
    }
    async setPassword({ token, password, purpose }) {
        const tokenRecord = await this.tokensService.findTokenWithPurpose(token, purpose);
        const status = await this.tokensService.getTokenStatus(tokenRecord);
        if ([token_status_enum_1.ETokenStatus.INVALID, token_status_enum_1.ETokenStatus.USED].includes(status)) {
            return { status };
        }
        const user = await this.userRepo.findById(tokenRecord.user.id);
        if (!user) {
            return { status: token_status_enum_1.ETokenStatus.INVALID };
        }
        if (status === token_status_enum_1.ETokenStatus.EXPIRED) {
            return {
                status,
                email: user.email,
            };
        }
        user.password = password;
        await this.userRepo.save(user);
        await this.tokensService.markAsUsed(tokenRecord);
        return Object.assign({ status: token_status_enum_1.ETokenStatus.USED }, this.authService.login(user));
    }
    async confirmEmail({ token, purpose }) {
        var _a, _b;
        const tokenRecord = await this.tokensService.findTokenWithChangeRequest(token, purpose);
        const status = await this.tokensService.getTokenStatus(tokenRecord);
        if (status !== token_status_enum_1.ETokenStatus.OPEN) {
            this.logger.warn({ token, status }, "Token status is not open");
            return;
        }
        const user = tokenRecord.user;
        const changeRequest = tokenRecord.changeRequest;
        if (!user) {
            this.logger.warn({ token, status }, "User not found");
            return;
        }
        if (!changeRequest || changeRequest.isAccepted || !((_a = changeRequest.changeTo) === null || _a === void 0 ? void 0 : _a.email)) {
            this.logger.warn({ token, isAccepted: changeRequest.isAccepted, changeTo: changeRequest.changeTo }, "Invalid change request");
            return;
        }
        user.email = (_b = changeRequest.changeTo) === null || _b === void 0 ? void 0 : _b.email;
        await this.userRepo.save(user);
        await this.tokensService.markAsUsed(tokenRecord);
        await this.tokensService.markChangeRequestAsAccepted(changeRequest);
        return;
    }
    async refreshToken(user) {
        return this.authService.login(user);
    }
    async loginAs(id, isRememberMe = false) {
        const user = await this.findOneById(id);
        return this.authService.login(user, isRememberMe);
    }
    async login(user, isRememberMe) {
        if (user.is2FAEnabled) {
            return this.authService.loginWith2fa(user, isRememberMe);
        }
        return this.authService.login(user, isRememberMe);
    }
    async sendEmailWithToken(user, purpose, email) {
        const token = (0, user_util_1.getUserToken)();
        const url = new URL(this.getUrlByPurpose(purpose), this.config.webAppDomain);
        url.searchParams.append("token", token);
        switch (purpose) {
            case token_purpose_enum_1.ETokenPurpose.INVITATION:
                await this.mailService.sendUserRegisterEmail(user, url.href);
                break;
            case token_purpose_enum_1.ETokenPurpose.FORGOTTEN_PASSWORD:
            case token_purpose_enum_1.ETokenPurpose.RESET_PASSWORD:
                await this.mailService.sendResetPassword(user, url.href);
                break;
            case token_purpose_enum_1.ETokenPurpose.CHANGE_EMAIL:
                await this.mailService.sendChangeEmail(user, url.href, email);
                break;
        }
        switch (purpose) {
            case token_purpose_enum_1.ETokenPurpose.INVITATION:
            case token_purpose_enum_1.ETokenPurpose.FORGOTTEN_PASSWORD:
            case token_purpose_enum_1.ETokenPurpose.RESET_PASSWORD:
                return this.tokensService.createToken(user, purpose, token);
            case token_purpose_enum_1.ETokenPurpose.CHANGE_EMAIL:
                return this.tokensService.createTokenWithChangeRequest(user, purpose, token, email);
        }
    }
    getUrlByPurpose(purpose) {
        switch (purpose) {
            case token_purpose_enum_1.ETokenPurpose.INVITATION:
                return this.registrationUrl;
            case token_purpose_enum_1.ETokenPurpose.FORGOTTEN_PASSWORD:
            case token_purpose_enum_1.ETokenPurpose.RESET_PASSWORD:
                return this.setPasswordUrl;
            case token_purpose_enum_1.ETokenPurpose.CHANGE_EMAIL:
                return this.emailConfirmation;
        }
    }
    async resendInviteEmail(userToInvite) {
        const user = await this.userRepo.findOneByEmail(userToInvite.email);
        const token = (0, user_util_1.getUserToken)();
        const invitationUrl = new URL(this.registrationUrl, this.config.webAppDomain);
        invitationUrl.searchParams.append("token", token);
        await this.mailService.sendUserRegisterEmail(user, invitationUrl.href);
        await this.tokensService.createToken(user, token_purpose_enum_1.ETokenPurpose.INVITATION, token);
        return new user_info_dto_1.UserInfoDTO(user);
    }
    async invite(data, invitingUser, companyId) {
        const invitedUsers = await Promise.all(data === null || data === void 0 ? void 0 : data.map(async (userToInvite) => {
            const user = await this.userRepo.findOneByEmail(userToInvite.email, true);
            if (user && !(user === null || user === void 0 ? void 0 : user.deletedAt) && !(user === null || user === void 0 ? void 0 : user.deletedById)) {
                throw new user_exceptions_1.DuplicateUserException();
            }
            if (user && user.deletedAt && user.deletedById) {
                user.destroy({ force: true });
            }
            let userCompanyId = invitingUser.companyId;
            if ((0, user_util_1.hasPermission)(invitingUser, codes_1.PermissionCodes.GLOBAL_ADMIN) && companyId) {
                userCompanyId = companyId;
            }
            const newUser = this.userRepo.create({
                email: userToInvite.email.trim(),
                roleId: userToInvite.roleId,
                companyId: userCompanyId,
            });
            const savedUser = await this.userRepo.save(newUser);
            const token = (0, user_util_1.getUserToken)();
            const invitationUrl = new URL(this.registrationUrl, this.config.webAppDomain);
            invitationUrl.searchParams.append("token", token);
            await this.mailService.sendUserRegisterEmail(newUser, invitationUrl.href);
            await this.tokensService.createToken(savedUser, token_purpose_enum_1.ETokenPurpose.INVITATION, token);
            await savedUser.reload({
                include: [company_model_1.default],
            });
            return new user_info_dto_1.UserInfoDTO(savedUser);
        }));
        return invitedUsers;
    }
    async findAll(userSearchParamsDTO, user) {
        const { value, fieldName, page, skip, limit, companyId, filters, sortBy, sortOrder } = userSearchParamsDTO;
        let setCompanyId = user.companyId;
        if (((0, user_util_1.hasPermission)(user, codes_1.PermissionCodes.GLOBAL_ADMIN) ||
            (0, user_util_1.hasPermission)(user, codes_1.PermissionCodes.ADMIN)) &&
            companyId) {
            setCompanyId = companyId;
        }
        const { rows, count } = await this.userRepo.findAllAndCount(limit, skip, fieldName, value, setCompanyId, filters, sortBy, sortOrder);
        const pageMetaDto = new dto_1.PageMetaDTO({
            itemCount: count,
            pageOptions: {
                page,
                limit,
                skip,
            },
        });
        return new dto_1.PageDTO(rows.map((user) => new user_info_dto_1.UserInfoDTO(user)), pageMetaDto);
    }
    async findOneByEmail(email) {
        const user = await this.userRepo.findOneByEmailWithCompanyAndPermissions(email);
        if (!user) {
            throw new user_exceptions_1.UserNotFoundException();
        }
        return user;
    }
    async findOneById(id) {
        const user = await this.userRepo.findOneByIdWithCompanyAndPermissions(id);
        if (!user) {
            throw new user_exceptions_1.UserNotFoundException();
        }
        return user;
    }
    async findOneByApiKey(apiKey) {
        const user = await this.userRepo.findOneByApiKeyWithCompanyAndPermissions(apiKey);
        if (!user) {
            throw new user_exceptions_1.UserNotFoundException();
        }
        return user;
    }
    async getUserInfoById(id, reqUser) {
        const user = await this.findOneById(id);
        if (user && user.companyId !== reqUser.companyId) {
            throw new common_1.ForbiddenException(errors_enum_1.Errors.FORBIDDEN);
        }
        return new user_info_dto_1.UserInfoDTO(user);
    }
    async changePassword(userId, oldPassword, password, confirmPassword) {
        const user = await this.userRepo.findById(userId);
        if (!user) {
            throw new user_exceptions_1.UserNotFoundException();
        }
        if (!(await user.checkPassword(oldPassword))) {
            throw new user_exceptions_1.IncorrectInputDataException(errors_enum_1.Errors.INVALID_PASSWORD);
        }
        if (password !== confirmPassword) {
            throw new user_exceptions_1.IncorrectInputDataException(errors_enum_1.Errors.PASSWORD_MISMATCH);
        }
        user.password = password;
        const updatedUser = await this.userRepo.save(user);
        return new user_info_dto_1.UserInfoDTO(updatedUser);
    }
    async acceptInvitation({ token, password, purpose, firstName, lastName, }) {
        const tokenRecord = await this.tokensService.findTokenWithPurpose(token, purpose);
        const status = await this.tokensService.getTokenStatus(tokenRecord);
        if ([token_status_enum_1.ETokenStatus.INVALID, token_status_enum_1.ETokenStatus.USED].includes(status)) {
            return { status };
        }
        const user = await this.userRepo.findById(tokenRecord.user.id);
        if (!user) {
            return { status: token_status_enum_1.ETokenStatus.INVALID };
        }
        if (status === token_status_enum_1.ETokenStatus.EXPIRED) {
            return { status, email: user.email };
        }
        user.password = password;
        user.firstName = firstName.trim();
        user.lastName = lastName.trim();
        await this.userRepo.save(user);
        await this.tokensService.markAsUsed(tokenRecord);
        return Object.assign({ status: token_status_enum_1.ETokenStatus.USED }, this.authService.login(user));
    }
    async resetUserPassword(id) {
        const user = await this.userRepo.findById(id);
        if (!user) {
            throw new user_exceptions_1.UserNotFoundException();
        }
        await this.sendEmailWithToken(user, token_purpose_enum_1.ETokenPurpose.RESET_PASSWORD);
        return { status: "ok" };
    }
    async resetPassword(email) {
        const user = await this.userRepo.findOneByEmail(email);
        if (user) {
            await this.sendEmailWithToken(user, token_purpose_enum_1.ETokenPurpose.FORGOTTEN_PASSWORD);
        }
        return { status: "ok" };
    }
    async updateUser(userId, executingUser, _a) {
        var { email } = _a, data = __rest(_a, ["email"]);
        const user = await this.userRepo.findById(userId);
        if (!user) {
            throw new user_exceptions_1.UserNotFoundException();
        }
        if (user.companyId !== executingUser.companyId &&
            (!(0, user_util_1.hasPermission)(executingUser, codes_1.PermissionCodes.GLOBAL_ADMIN) ||
                !(0, user_util_1.hasPermission)(executingUser, codes_1.PermissionCodes.ADMIN))) {
            throw new common_1.ForbiddenException(errors_enum_1.Errors.FORBIDDEN);
        }
        if (email) {
            const existingUserEmail = await this.userRepo.findOneByEmail(email);
            if (existingUserEmail) {
                throw new user_exceptions_1.DuplicateUserException("Email is already taken.");
            }
            await this.triggerEmailChange(user, email);
        }
        const updatedUser = await this.userRepo.update(user, data);
        return new user_info_dto_1.UserInfoDTO(updatedUser);
    }
    async update(userId, _a) {
        var { email } = _a, data = __rest(_a, ["email"]);
        try {
            const user = await this.userRepo.findById(userId);
            if (!user) {
                throw new user_exceptions_1.UserNotFoundException();
            }
            if (email) {
                const existingUserEmail = await this.userRepo.findOneByEmail(email);
                if (existingUserEmail) {
                    throw new user_exceptions_1.DuplicateUserException("Email is already taken.");
                }
                await this.triggerEmailChange(user, email);
            }
            const updatedUser = await this.userRepo.update(user, Object.assign({}, data));
            return new user_info_dto_1.UserInfoDTO(updatedUser);
        }
        catch (e) {
            this.logger.error(e.message, e.stack);
        }
    }
    async delete(id, user) {
        const foundUser = await this.userRepo.findById(id);
        if (!foundUser) {
            throw new user_exceptions_1.UserNotFoundException();
        }
        else if (foundUser.companyId !== user.companyId &&
            (!(0, user_util_1.hasPermission)(user, codes_1.PermissionCodes.GLOBAL_ADMIN) ||
                !(0, user_util_1.hasPermission)(user, codes_1.PermissionCodes.ADMIN))) {
            throw new common_1.ForbiddenException(errors_enum_1.Errors.FORBIDDEN);
        }
        foundUser.deletedById = user.id;
        await foundUser.save();
        const affected = await this.userRepo.deleteById(id);
        if (affected) {
            return {
                userId: id,
            };
        }
        else {
            throw new user_exceptions_1.UserNotFoundException();
        }
    }
    async set2FASecret(userId, secret) {
        await this.userRepo.updateById(userId, { twoFactorAuthSecret: secret });
        return {
            status: "ok",
        };
    }
    async disable2FA(userId) {
        await this.userRepo.updateById(userId, { twoFactorAuthSecret: "", is2FAEnabled: false });
        const user = await this.findOneById(userId);
        return new user_info_dto_1.UserInfoDTO(user);
    }
    async enable2FA(userId) {
        await this.userRepo.updateById(userId, { is2FAEnabled: true });
        const user = await this.findOneById(userId);
        return new user_info_dto_1.UserInfoDTO(user);
    }
    async triggerEmailChange(user, email) {
        return this.sendEmailWithToken(user, token_purpose_enum_1.ETokenPurpose.CHANGE_EMAIL, email);
    }
    async logout(req) {
        const token = req.headers["authorization"].split(" ")[1];
        await this.blacklistService.blacklistJwt(token);
        return {
            status: "ok",
        };
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = UsersService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, common_1.Inject)(app_config_1.default.KEY)),
    __param(3, (0, common_1.Inject)((0, common_1.forwardRef)(() => auth_service_1.AuthService))),
    __param(4, (0, common_1.Inject)((0, common_1.forwardRef)(() => tokens_service_1.TokensService))),
    __param(5, (0, common_1.Inject)((0, common_1.forwardRef)(() => roles_service_1.RolesService))),
    __param(6, (0, common_1.Inject)((0, common_1.forwardRef)(() => user_blacklist_service_1.UserBlacklistService))),
    __metadata("design:paramtypes", [user_repository_1.UserRepository, void 0, mail_service_1.MailService,
        auth_service_1.AuthService,
        tokens_service_1.TokensService,
        roles_service_1.RolesService,
        user_blacklist_service_1.UserBlacklistService])
], UsersService);
//# sourceMappingURL=users.service.js.map