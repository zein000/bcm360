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
var TokenRepository_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenRepository = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const sequelize_2 = require("sequelize");
const errors_enum_1 = require("../../enums/errors.enum");
const user_model_1 = require("../../users/models/user.model");
const change_request_model_1 = require("../models/change-request.model");
const token_model_1 = require("../models/token.model");
let TokenRepository = TokenRepository_1 = class TokenRepository {
    constructor(model) {
        this.model = model;
        this.logger = new common_1.Logger(TokenRepository_1.name);
    }
    async findById(id) {
        return this.model.findOne({
            where: { id },
        });
    }
    async createToken(token) {
        try {
            return await token.save();
        }
        catch (error) {
            this.logger.error(error, "Failed to create token");
            throw new common_1.InternalServerErrorException(errors_enum_1.Errors.INTERNAL_ERROR);
        }
    }
    async findToken(token) {
        try {
            return await this.model.findOne({ where: { token }, include: user_model_1.default });
        }
        catch (error) {
            this.logger.error(error, "Failed to find token %s", token);
            throw new common_1.InternalServerErrorException(errors_enum_1.Errors.INTERNAL_ERROR);
        }
    }
    async findTokenWithPurpose(token, purpose) {
        try {
            return await this.model.findOne({ where: { token, purpose }, include: user_model_1.default });
        }
        catch (error) {
            this.logger.error(error, "Failed to find token %s", token);
            throw new common_1.InternalServerErrorException(errors_enum_1.Errors.INTERNAL_ERROR);
        }
    }
    async findTokenWithChangeRequest(token, purpose) {
        try {
            return await this.model.findOne({
                where: { token, purpose },
                include: [user_model_1.default, change_request_model_1.default],
            });
        }
        catch (error) {
            this.logger.error(error, "Failed to find token %s with change request", token);
            throw new common_1.InternalServerErrorException(errors_enum_1.Errors.INTERNAL_ERROR);
        }
    }
    async findNewerTokens({ token, user, createdAt, purpose }) {
        try {
            return await this.model.findAll({
                where: {
                    purpose,
                    token: { [sequelize_2.Op.not]: token },
                    createdAt: { [sequelize_2.Op.gt]: createdAt },
                },
                include: {
                    model: user_model_1.default,
                    required: true,
                    where: { id: user.id },
                },
            });
        }
        catch (error) {
            this.logger.error(error, "DB Error: Failed to find token %s", token);
            throw new common_1.InternalServerErrorException(errors_enum_1.Errors.INTERNAL_ERROR);
        }
    }
    async updateById(id, data) {
        try {
            return await this.model.update(data, { where: { id } });
        }
        catch (error) {
            this.logger.error(error, "DB Error: Failed to update by id %s", id);
            throw new common_1.InternalServerErrorException(errors_enum_1.Errors.INTERNAL_ERROR);
        }
    }
};
exports.TokenRepository = TokenRepository;
exports.TokenRepository = TokenRepository = TokenRepository_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(token_model_1.default)),
    __metadata("design:paramtypes", [Object])
], TokenRepository);
//# sourceMappingURL=token.repository.js.map