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
var CompanySeeder_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompanySeeder = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const company_model_1 = require("./models/company.model");
let CompanySeeder = CompanySeeder_1 = class CompanySeeder {
    constructor(companyModel) {
        this.companyModel = companyModel;
        this.logger = new common_1.Logger(CompanySeeder_1.name);
    }
    async seed() {
        const companies = [
            { name: "Browserbite EOOD" },
            { name: "Testing company" },
        ];
        try {
            this.logger.debug("Upserting companies");
            for (const company of companies) {
                const foundCompany = await this.companyModel.findOne({
                    where: { name: company.name },
                });
                if (!foundCompany) {
                    await this.companyModel.create(company);
                }
            }
            this.logger.debug("Finished upserting companies");
        }
        catch (error) {
            this.logger.error("Failed upserting companies: ", error);
        }
    }
};
exports.CompanySeeder = CompanySeeder;
exports.CompanySeeder = CompanySeeder = CompanySeeder_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(company_model_1.default)),
    __metadata("design:paramtypes", [Object])
], CompanySeeder);
//# sourceMappingURL=company.seeder.js.map