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
var FeaturesSeeder_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.FeaturesSeeder = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const feature_model_1 = require("./models/feature.model");
let FeaturesSeeder = FeaturesSeeder_1 = class FeaturesSeeder {
    constructor(model) {
        this.model = model;
        this.logger = new common_1.Logger(FeaturesSeeder_1.name);
    }
    async seed() {
        const permissions = [];
        try {
            this.logger.debug("saving features");
            for (const permission of permissions) {
                const feature = await this.model.findOne({
                    where: {
                        feature: permission.feature,
                    },
                });
                if (!feature) {
                    await this.model.create(permission);
                }
            }
            this.logger.debug("Finished saving features");
        }
        catch (error) {
            this.logger.error("Failed upserting features: ", error);
        }
    }
};
exports.FeaturesSeeder = FeaturesSeeder;
exports.FeaturesSeeder = FeaturesSeeder = FeaturesSeeder_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(feature_model_1.default)),
    __metadata("design:paramtypes", [Object])
], FeaturesSeeder);
//# sourceMappingURL=features.seeder.js.map