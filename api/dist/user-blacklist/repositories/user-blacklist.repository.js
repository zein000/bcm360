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
var UserBlacklistRepo_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserBlacklistRepo = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const sequelize_2 = require("sequelize");
const errors_enum_1 = require("../../enums/errors.enum");
const user_model_1 = require("../../users/models/user.model");
const user_blacklist_model_1 = require("../models/user-blacklist.model");
let UserBlacklistRepo = UserBlacklistRepo_1 = class UserBlacklistRepo {
    constructor(model) {
        this.model = model;
        this.logger = new common_1.Logger(UserBlacklistRepo_1.name);
    }
    async create(blacklist) {
        try {
            return this.model.build(blacklist);
        }
        catch (error) {
            this.logger.error(error, "Failed to create blacklist entity");
            throw new common_1.InternalServerErrorException(errors_enum_1.Errors.INTERNAL_ERROR);
        }
    }
    async save(blacklist) {
        try {
            return await blacklist.save();
        }
        catch (error) {
            this.logger.error(error, "Failed to save blacklist entity", blacklist.id);
            throw new common_1.InternalServerErrorException(errors_enum_1.Errors.INTERNAL_ERROR);
        }
    }
    async findOneByValue(value) {
        try {
            return this.model.findOne({ where: { value }, include: user_model_1.default });
        }
        catch (error) {
            this.logger.error(error, "Failed to find blacklist list");
            throw new common_1.InternalServerErrorException(errors_enum_1.Errors.INTERNAL_ERROR);
        }
    }
    async findAll() {
        try {
            return this.model.findAll({ include: user_model_1.default });
        }
        catch (error) {
            this.logger.error(error, "Failed to find blacklist list");
            throw new common_1.InternalServerErrorException(errors_enum_1.Errors.INTERNAL_ERROR);
        }
    }
    async deleteExpired() {
        try {
            const toBeDeleted = await this.model.findAll({
                where: { expiresAt: { [sequelize_2.Op.lte]: new Date() } },
            });
            await this.model.destroy({
                where: { expiresAt: { [sequelize_2.Op.lte]: new Date() } },
            });
            return toBeDeleted;
        }
        catch (error) {
            this.logger.error(error, "Failed to delete expired blacklists");
            throw new common_1.InternalServerErrorException(errors_enum_1.Errors.INTERNAL_ERROR);
        }
    }
};
exports.UserBlacklistRepo = UserBlacklistRepo;
exports.UserBlacklistRepo = UserBlacklistRepo = UserBlacklistRepo_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(user_blacklist_model_1.default)),
    __metadata("design:paramtypes", [Object])
], UserBlacklistRepo);
//# sourceMappingURL=user-blacklist.repository.js.map