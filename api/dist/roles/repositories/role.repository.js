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
var RoleRepository_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoleRepository = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const sequelize_2 = require("sequelize");
const errors_enum_1 = require("../../enums/errors.enum");
const permission_model_1 = require("../../permissions/models/permission.model");
const role_model_1 = require("../models/role.model");
let RoleRepository = RoleRepository_1 = class RoleRepository {
    constructor(model) {
        this.model = model;
        this.logger = new common_1.Logger(RoleRepository_1.name);
    }
    async findAllAndCount(limit, skip, types) {
        try {
            const { rows, count } = await this.model.findAndCountAll({
                where: {
                    code: { [sequelize_2.Op.in]: types },
                },
                limit,
                offset: skip,
            });
            const data = await this.model.findAll({
                where: {
                    id: { [sequelize_2.Op.in]: rows.map((r) => r.id) },
                },
                include: [permission_model_1.default],
            });
            return { rows: data, count };
        }
        catch (error) {
            this.logger.error(error, "Failed to find roles");
            throw new common_1.InternalServerErrorException(errors_enum_1.Errors.INTERNAL_ERROR);
        }
    }
    async findById(id) {
        try {
            return await this.model.findOne({
                where: { id },
                include: { model: permission_model_1.default },
            });
        }
        catch (error) {
            this.logger.error(error, "Failed to find role by Id %s", id);
            throw new common_1.InternalServerErrorException(errors_enum_1.Errors.INTERNAL_ERROR);
        }
    }
    async findOneByCode(code) {
        try {
            return await this.model.findOne({
                where: { code },
                include: { model: permission_model_1.default },
            });
        }
        catch (error) {
            this.logger.error(error, "Failed to find role by code %s", code);
            throw new common_1.InternalServerErrorException(errors_enum_1.Errors.INTERNAL_ERROR);
        }
    }
    async findManyByCode(codes) {
        try {
            return await this.model.findAll({
                where: {
                    code: codes,
                },
                include: { model: permission_model_1.default },
            });
        }
        catch (error) {
            this.logger.error(error, "Failed to find roles by codes %s", codes.join(", "));
            throw new common_1.InternalServerErrorException(errors_enum_1.Errors.INTERNAL_ERROR);
        }
    }
    build(role) {
        try {
            return this.model.build(role, { include: permission_model_1.default });
        }
        catch (error) {
            this.logger.error(error, "Failed to build role");
            throw new common_1.InternalServerErrorException(errors_enum_1.Errors.INTERNAL_ERROR);
        }
    }
    async update(id, role) {
        try {
            return await this.model.update(role, { where: { id } });
        }
        catch (error) {
            this.logger.error(error, "Failed to update role by Id %s", id);
            throw new common_1.InternalServerErrorException(errors_enum_1.Errors.INTERNAL_ERROR);
        }
    }
    async save(role) {
        try {
            return await role.save();
        }
        catch (error) {
            this.logger.error(error, "Failed to save role");
            throw new common_1.InternalServerErrorException(errors_enum_1.Errors.INTERNAL_ERROR);
        }
    }
    async delete(role) {
        try {
            await role.destroy();
        }
        catch (error) {
            this.logger.error(error, "Failed to delete role with Id %s", role.id);
            throw new common_1.InternalServerErrorException(errors_enum_1.Errors.INTERNAL_ERROR);
        }
    }
};
exports.RoleRepository = RoleRepository;
exports.RoleRepository = RoleRepository = RoleRepository_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(role_model_1.default)),
    __metadata("design:paramtypes", [Object])
], RoleRepository);
//# sourceMappingURL=role.repository.js.map