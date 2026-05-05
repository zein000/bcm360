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
var FeatureRepository_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.FeatureRepository = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const feature_model_1 = require("../models/feature.model");
let FeatureRepository = FeatureRepository_1 = class FeatureRepository {
    constructor(model) {
        this.model = model;
        this.logger = new common_1.Logger(FeatureRepository_1.name);
    }
    async getOneByFeature(feature, companyId) {
        try {
            const companyPermission = companyId
                ? await this.model.findOne({
                    where: {
                        companyId: companyId,
                        feature,
                    },
                })
                : null;
            const generalPermission = await this.model.findOne({
                where: {
                    companyId: null,
                    feature,
                },
            });
            const featurePermission = companyPermission || generalPermission;
            if (!featurePermission) {
                throw new common_1.InternalServerErrorException();
            }
            return featurePermission;
        }
        catch (error) {
            this.logger.error(error, "Failed to get featurePermission for company %s", companyId);
            throw new common_1.InternalServerErrorException();
        }
    }
    async getAll(user) {
        try {
            const allCompanyPermissions = user
                ? await this.model.findAll({
                    where: {
                        companyId: user.company.id,
                    },
                })
                : [];
            const allGeneralPermissions = await this.model.findAll({
                where: {
                    companyId: null,
                },
            });
            return [
                ...allCompanyPermissions,
                ...allGeneralPermissions.filter((feature) => {
                    return !allCompanyPermissions.some((companyFeature) => {
                        return companyFeature.feature === feature.feature;
                    });
                }),
            ];
        }
        catch (error) {
            this.logger.error(error, "Failed to get featurePermission for company %s", user.company.id);
            throw new common_1.InternalServerErrorException();
        }
    }
};
exports.FeatureRepository = FeatureRepository;
exports.FeatureRepository = FeatureRepository = FeatureRepository_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(feature_model_1.default)),
    __metadata("design:paramtypes", [Object])
], FeatureRepository);
//# sourceMappingURL=feature.repo.js.map