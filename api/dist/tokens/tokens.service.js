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
var TokensService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokensService = void 0;
const common_1 = require("@nestjs/common");
const user_util_1 = require("../common/user.util");
const token_config_1 = require("./config/token.config");
const users_service_1 = require("../users/users.service");
const token_purpose_enum_1 = require("./enums/token-purpose.enum");
const token_status_enum_1 = require("./enums/token-status.enum");
const token_model_1 = require("./models/token.model");
const change_request_repository_1 = require("./repositories/change-request.repository");
const token_repository_1 = require("./repositories/token.repository");
let TokensService = TokensService_1 = class TokensService {
    constructor(tokenRepository, changeRequestRepo, usersService, config) {
        this.tokenRepository = tokenRepository;
        this.changeRequestRepo = changeRequestRepo;
        this.usersService = usersService;
        this.config = config;
        this.logger = new common_1.Logger(TokensService_1.name);
    }
    async validateToken(token) {
        const tokenRecord = await this.findToken(token);
        const status = await this.getTokenStatus(tokenRecord);
        let email;
        if (status === token_status_enum_1.ETokenStatus.EXPIRED) {
            const user = await this.usersService.findOneById(tokenRecord.user.id);
            email = user.email;
        }
        return { status, email };
    }
    async resend(token) {
        const tokenRecord = await this.findToken(token);
        const status = await this.getTokenStatus(tokenRecord);
        if (status !== token_status_enum_1.ETokenStatus.EXPIRED) {
            this.logger.warn({ token, status }, "Token not expired to resend invitation");
            return { status: "ok" };
        }
        try {
            await this.usersService.sendEmailWithToken(tokenRecord.user, tokenRecord.purpose);
        }
        catch (error) {
            this.logger.error(error, "Failed to resend invitation token for %s to user %s", tokenRecord.purpose, tokenRecord.user.id);
        }
        return { status: "ok" };
    }
    async createToken(userRecord, purpose, token) {
        const tokenRecord = new token_model_1.default({
            userId: userRecord.id,
            token: token || (0, user_util_1.getUserToken)(),
            purpose,
        });
        return this.tokenRepository.createToken(tokenRecord);
    }
    async createTokenWithChangeRequest(userRecord, purpose, token, newEmail) {
        const tokenRecord = new token_model_1.default({
            userId: userRecord.id,
            token,
            purpose,
        });
        const tokenRes = await this.tokenRepository.createToken(tokenRecord);
        await this.changeRequestRepo.createChangeRequest({
            tokenId: tokenRes.id,
            changeFrom: { email: userRecord.email },
            changeTo: { email: newEmail },
        });
        return tokenRes;
    }
    findToken(token) {
        return this.tokenRepository.findToken(token);
    }
    findTokenWithPurpose(token, purpose) {
        return this.tokenRepository.findTokenWithPurpose(token, purpose);
    }
    findTokenWithChangeRequest(token, purpose) {
        return this.tokenRepository.findTokenWithChangeRequest(token, purpose);
    }
    async getTokenStatus(token) {
        if (!token)
            return token_status_enum_1.ETokenStatus.INVALID;
        if (this.isUsed(token))
            return token_status_enum_1.ETokenStatus.USED;
        if (this.isExpired(token))
            return token_status_enum_1.ETokenStatus.EXPIRED;
        if (await this.isOlderToken(token))
            return token_status_enum_1.ETokenStatus.INVALID;
        return token_status_enum_1.ETokenStatus.OPEN;
    }
    async markAsUsed(token) {
        return this.tokenRepository.updateById(token.id, { isUsed: true });
    }
    async markChangeRequestAsAccepted(changeRequest) {
        return this.changeRequestRepo.markAsAccepted(changeRequest.id);
    }
    async isOlderToken(token) {
        const newerTokens = await this.tokenRepository.findNewerTokens(token);
        return newerTokens.some((record) => this.isUsed(record) || !this.isExpired(record));
    }
    isUsed(token) {
        return token.isUsed;
    }
    isExpired(token) {
        return token.createdAt.getTime() <= this.getTokenCompareDate(token.purpose).getTime();
    }
    getTokenCompareDate(purpose) {
        const compareDate = new Date();
        const expiration = this.getExpiration(purpose);
        return new Date(compareDate.getTime() - expiration);
    }
    getExpiration(purpose) {
        switch (purpose) {
            case token_purpose_enum_1.ETokenPurpose.INVITATION:
                return this.config.invitationTokenExpiration;
            case token_purpose_enum_1.ETokenPurpose.FORGOTTEN_PASSWORD:
                return this.config.forgottenPasswordTokenExpiration;
            case token_purpose_enum_1.ETokenPurpose.CHANGE_EMAIL:
                return this.config.changeEmailTokenExpiration;
        }
    }
};
exports.TokensService = TokensService;
exports.TokensService = TokensService = TokensService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(2, (0, common_1.Inject)((0, common_1.forwardRef)(() => users_service_1.UsersService))),
    __param(3, (0, common_1.Inject)(token_config_1.default.KEY)),
    __metadata("design:paramtypes", [token_repository_1.TokenRepository,
        change_request_repository_1.ChangeRequestRepository,
        users_service_1.UsersService, void 0])
], TokensService);
//# sourceMappingURL=tokens.service.js.map