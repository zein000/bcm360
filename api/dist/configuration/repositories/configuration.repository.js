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
var ConfigurationRepository_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigurationRepository = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const errors_enum_1 = require("../../enums/errors.enum");
const configuration_model_1 = require("../models/configuration.model");
let ConfigurationRepository = ConfigurationRepository_1 = class ConfigurationRepository {
    constructor(model) {
        this.model = model;
        this.logger = new common_1.Logger(ConfigurationRepository_1.name);
    }
    async findAll() {
        try {
            return await this.model.findAll();
        }
        catch (error) {
            this.logger.error(error, "Failed to find configurations");
            throw new common_1.InternalServerErrorException(errors_enum_1.Errors.INTERNAL_ERROR);
        }
    }
    async findAllByName(name) {
        try {
            return await this.model.findAll({
                where: { name, deletedAt: null },
            });
        }
        catch (error) {
            this.logger.error(error, "Failed to find configurations");
            throw new common_1.InternalServerErrorException(errors_enum_1.Errors.INTERNAL_ERROR);
        }
    }
    async findByName(name, companyId) {
        try {
            const where = companyId ? { name, companyId } : { name };
            return await this.model.findOne({ where });
        }
        catch (error) {
            this.logger.error(error, "Failed to find configuration by name %s", name);
            throw new common_1.InternalServerErrorException(errors_enum_1.Errors.INTERNAL_ERROR);
        }
    }
    async save(config) {
        try {
            return await config.save();
        }
        catch (error) {
            this.logger.error(error, "Failed to save configuration", config.id);
            throw new common_1.InternalServerErrorException(errors_enum_1.Errors.INTERNAL_ERROR);
        }
    }
    async updateByName(name, data) {
        try {
            return await this.model.update(data, { where: { name }, individualHooks: true });
        }
        catch (error) {
            this.logger.error(error, "Failed to update config by name %s", name);
            throw new common_1.InternalServerErrorException(errors_enum_1.Errors.INTERNAL_ERROR);
        }
    }
    async update(config, data) {
        try {
            return await config.update(data);
        }
        catch (error) {
            this.logger.error(error, "Failed to update config by name %s", config.name);
            throw new common_1.InternalServerErrorException(errors_enum_1.Errors.INTERNAL_ERROR);
        }
    }
    async upsert(data) {
        try {
            return await this.model.upsert(data);
        }
        catch (error) {
            this.logger.error(error, "Failed to upsert config by name %s", data.name);
            throw new common_1.InternalServerErrorException(errors_enum_1.Errors.INTERNAL_ERROR);
        }
    }
    async deleteByName(updatedBy, name) {
        try {
            const config = await this.model.findOne({ where: { name } });
            config.updatedBy = updatedBy;
            await config.destroy();
        }
        catch (error) {
            this.logger.error(error, "Failed to delete config by name %s", name);
            throw new common_1.InternalServerErrorException(errors_enum_1.Errors.INTERNAL_ERROR);
        }
    }
    create(config) {
        try {
            return this.model.build(config);
        }
        catch (error) {
            this.logger.error(error, "Failed to build config");
            throw new common_1.InternalServerErrorException(errors_enum_1.Errors.INTERNAL_ERROR);
        }
    }
};
exports.ConfigurationRepository = ConfigurationRepository;
exports.ConfigurationRepository = ConfigurationRepository = ConfigurationRepository_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(configuration_model_1.default)),
    __metadata("design:paramtypes", [Object])
], ConfigurationRepository);
//# sourceMappingURL=configuration.repository.js.map