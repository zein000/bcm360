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
var PermissionRepository_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PermissionRepository = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const sequelize_2 = require("sequelize");
const errors_enum_1 = require("../../enums/errors.enum");
const role_model_1 = require("../../roles/models/role.model");
const permission_model_1 = require("../models/permission.model");
let PermissionRepository = PermissionRepository_1 = class PermissionRepository {
    constructor(model) {
        this.model = model;
        this.logger = new common_1.Logger(PermissionRepository_1.name);
    }
    async findAllAndCount(limit, skip) {
        try {
            const { rows, count } = await this.model.findAndCountAll();
            const data = await this.model.findAll({
                where: {
                    id: { [sequelize_2.Op.in]: rows.map((r) => r.id) },
                },
                include: [role_model_1.default],
                limit,
                offset: skip,
            });
            return { rows: data, count };
        }
        catch (error) {
            this.logger.error(error, "Failed to find permissions");
            throw new common_1.InternalServerErrorException(errors_enum_1.Errors.INTERNAL_ERROR);
        }
    }
    async findById(id) {
        try {
            return await this.model.findOne({
                where: { id },
                include: [role_model_1.default],
            });
        }
        catch (error) {
            this.logger.error(error, "Failed to find permission by Id $id", id);
            throw new common_1.InternalServerErrorException(errors_enum_1.Errors.INTERNAL_ERROR);
        }
    }
    async findByIds(ids) {
        try {
            return await this.model.findAll({
                where: {
                    id: { [sequelize_2.Op.in]: ids },
                },
                include: [role_model_1.default],
            });
        }
        catch (error) {
            this.logger.error(error, "Failed to find permission by Ids %s", ids);
            throw new common_1.InternalServerErrorException(errors_enum_1.Errors.INTERNAL_ERROR);
        }
    }
    async findByCodes(codes) {
        try {
            return await this.model.findAll({
                where: {
                    code: { [sequelize_2.Op.in]: codes },
                },
                include: [role_model_1.default],
            });
        }
        catch (error) {
            this.logger.error(error, "Failed to find permission by codes %s", codes);
            throw new common_1.InternalServerErrorException(errors_enum_1.Errors.INTERNAL_ERROR);
        }
    }
    async updateById(id, data) {
        try {
            return await this.model.update(data, { where: { id } });
        }
        catch (error) {
            this.logger.error(error, "Failed to update permission by Id %s", id);
            throw new common_1.InternalServerErrorException(errors_enum_1.Errors.INTERNAL_ERROR);
        }
    }
    async deleteById(id) {
        try {
            return await this.model.destroy({ where: { id } });
        }
        catch (error) {
            this.logger.error(error, "Failed to delete permission by Id %s", id);
            throw new common_1.InternalServerErrorException(errors_enum_1.Errors.INTERNAL_ERROR);
        }
    }
};
exports.PermissionRepository = PermissionRepository;
exports.PermissionRepository = PermissionRepository = PermissionRepository_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(permission_model_1.default)),
    __metadata("design:paramtypes", [Object])
], PermissionRepository);
//# sourceMappingURL=permission.repository.js.map