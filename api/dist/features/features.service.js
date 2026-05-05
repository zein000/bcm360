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
Object.defineProperty(exports, "__esModule", { value: true });
exports.FeaturesService = void 0;
const common_1 = require("@nestjs/common");
const feature_info_1 = require("./dtos/feature-info");
const feature_repo_1 = require("./repositories/feature.repo");
let FeaturesService = class FeaturesService {
    constructor(featureRepo) {
        this.featureRepo = featureRepo;
    }
    async getFeatures(user) {
        const features = await this.featureRepo.getAll(user);
        return features.map((feature) => new feature_info_1.FeatureInfo(feature));
    }
};
exports.FeaturesService = FeaturesService;
exports.FeaturesService = FeaturesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [feature_repo_1.FeatureRepository])
], FeaturesService);
//# sourceMappingURL=features.service.js.map