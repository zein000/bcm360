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
var CompanyRepository_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompanyRepository = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const sequelize_2 = require("sequelize");
const role_model_1 = require("../../roles/models/role.model");
const role_enum_1 = require("../../enums/role.enum");
const errors_enum_1 = require("../../enums/errors.enum");
const user_model_1 = require("../../users/models/user.model");
const company_model_1 = require("../models/company.model");
let CompanyRepository = CompanyRepository_1 = class CompanyRepository {
    constructor(model) {
        this.model = model;
        this.logger = new common_1.Logger(CompanyRepository_1.name);
    }
    async findAll() {
        try {
            return this.model.findAll({ include: user_model_1.default });
        }
        catch (error) {
            this.logger.error(error, "Failed to find companies");
            throw new common_1.InternalServerErrorException(errors_enum_1.Errors.INTERNAL_ERROR);
        }
    }
    async findAllAndCount(limit, skip, searchValue, filters) {
        try {
            let where = {};
            if (filters) {
                Object.entries(filters).forEach(([key, value]) => {
                    if (key in company_model_1.default.getAttributes()) {
                        if (!Array.isArray(value)) {
                            where[key] = { [sequelize_2.Op.like]: `%${value}%` };
                        }
                        else {
                            where[key] = { [sequelize_2.Op.in]: value };
                        }
                    }
                });
            }
            const { rows, count } = await this.model.findAndCountAll({
                where: Object.assign({}, where),
                order: ["name"],
                limit,
                offset: skip,
            });
            const data = await this.model.findAll({
                where: { id: { [sequelize_2.Op.in]: rows.map((r) => r.id) } },
                include: [
                    {
                        model: user_model_1.default,
                        as: "admins",
                        include: [
                            {
                                model: role_model_1.default,
                                where: {
                                    code: {
                                        [sequelize_2.Op.in]: [role_enum_1.ERole.ADMIN, role_enum_1.ERole.GLOBAL_ADMIN],
                                    },
                                },
                                required: true,
                            },
                        ],
                    },
                    {
                        model: user_model_1.default,
                        as: "users",
                        include: [
                            {
                                model: role_model_1.default,
                                where: {
                                    code: {
                                        [sequelize_2.Op.in]: [role_enum_1.ERole.USER],
                                    },
                                },
                                required: true,
                            },
                        ],
                    },
                ],
            });
            return { rows: data, count };
        }
        catch (error) {
            this.logger.error(error, "Failed to find companies with filters");
            throw new common_1.InternalServerErrorException(errors_enum_1.Errors.INTERNAL_ERROR);
        }
    }
    async findOneCompany(id) {
        try {
            return await this.model.findOne({
                where: { id },
            });
        }
        catch (error) {
            this.logger.error(error, "Failed to find company by companyId %s", id);
            throw new common_1.InternalServerErrorException(errors_enum_1.Errors.INTERNAL_ERROR);
        }
    }
    async createCompany(company) {
        try {
            return await company.save();
        }
        catch (error) {
            this.logger.error(error, "Failed to save company");
            throw new common_1.InternalServerErrorException(errors_enum_1.Errors.INTERNAL_ERROR);
        }
    }
};
exports.CompanyRepository = CompanyRepository;
exports.CompanyRepository = CompanyRepository = CompanyRepository_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(company_model_1.default)),
    __metadata("design:paramtypes", [Object])
], CompanyRepository);
//# sourceMappingURL=company.repository.js.map