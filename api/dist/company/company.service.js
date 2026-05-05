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
var CompanyService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompanyService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const sequelize_2 = require("sequelize");
const user_model_1 = require("../users/models/user.model");
const user_info_caching_service_1 = require("../caching/services/user-info-caching.service");
const dto_1 = require("../common/dto");
const company_admin_info_dto_1 = require("./dto/company-admin-info.dto");
const company_model_1 = require("./models/company.model");
const company_repository_1 = require("./repositories/company.repository");
let CompanyService = CompanyService_1 = class CompanyService {
    constructor(model, userInfoCachingService, companyRepository) {
        this.model = model;
        this.userInfoCachingService = userInfoCachingService;
        this.companyRepository = companyRepository;
        this.logger = new common_1.Logger(CompanyService_1.name);
    }
    async create(data) {
        const company = new company_model_1.default();
        company.name = data.name;
        await company.save();
        company.startDay = company.createdAt.getDate();
        await company.save();
        return new company_admin_info_dto_1.CompanyAdminInfoDTO(company);
    }
    async updateAsAdmin(id, data) {
        const company = await this.model.findByPk(id, {
            include: [
                { model: user_model_1.default, as: "admins" },
                { model: user_model_1.default, as: "users" },
            ],
        });
        if (!company) {
            throw new common_1.NotFoundException("Company not found");
        }
        company.name = data.name;
        await company.save();
        await Promise.all([...company.admins, ...company.users].map(async (user) => {
            await this.userInfoCachingService.clearUser(user);
        }));
        return company.id;
    }
    async update(data, user) {
        const company = await this.model.findByPk(user.companyId);
        if (!company) {
            throw new common_1.NotFoundException("Company not found");
        }
        company.name = data.name;
        await company.save();
        await Promise.all([...company.admins, ...company.users].map(async (user) => {
            await this.userInfoCachingService.clearUser(user);
        }));
        return company.id;
    }
    async saveApiKeys(data, user) {
        const company = await this.model.findByPk(user.companyId);
        if (!company) {
            throw new common_1.NotFoundException("Company not found");
        }
        await company.save();
        await this.userInfoCachingService.clearUser(user);
        return company.id;
    }
    async findOne(id) {
        const company = await this.model.findByPk(id, {
            include: [
                { model: user_model_1.default, as: "admins" },
                { model: user_model_1.default, as: "users" },
            ],
        });
        if (!company) {
            throw new common_1.NotFoundException("Company not found");
        }
        return new company_admin_info_dto_1.CompanyAdminInfoDTO(company);
    }
    async findAll(pageOptions) {
        const { rows, count } = await this.companyRepository.findAllAndCount(pageOptions.limit || 1000, pageOptions.skip, pageOptions.searchValue || null, pageOptions === null || pageOptions === void 0 ? void 0 : pageOptions.filters);
        const pageMeta = new dto_1.PageMetaDTO({ itemCount: count, pageOptions });
        return new dto_1.PageDTO(rows.map((company) => new company_admin_info_dto_1.CompanyAdminInfoDTO(company)), pageMeta);
    }
    async delete(id, user) {
        const company = await this.model.findByPk(id);
        if (!company) {
            throw new common_1.NotFoundException("Company not found");
        }
        if (company.id !== user.companyId && user.companyId !== 1) {
            throw new common_1.NotFoundException("You are not allowed to delete this company");
        }
        company.deletedById = user.id;
        await company.save();
        await company.destroy();
        return company.id;
    }
    async hardDeleteCompaniesThatWereDeleted30DaysAgo() {
        const companies = await this.model.findAll({
            where: {
                deletedAt: {
                    [sequelize_2.Op.lt]: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
                },
            },
            include: [
                { model: user_model_1.default, as: "admins" },
                { model: user_model_1.default, as: "users" },
            ],
            paranoid: false,
        });
        await Promise.all(companies.map(async (company) => {
            await Promise.all(company.admins.map(async (user) => {
                user.destroy({
                    force: true,
                });
            }));
            await Promise.all(company.users.map(async (user) => {
                user.destroy({
                    force: true,
                });
            }));
            company.destroy({
                force: true,
            });
        }));
    }
};
exports.CompanyService = CompanyService;
exports.CompanyService = CompanyService = CompanyService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(company_model_1.default)),
    __metadata("design:paramtypes", [Object, user_info_caching_service_1.UserInfoCachingService,
        company_repository_1.CompanyRepository])
], CompanyService);
//# sourceMappingURL=company.service.js.map