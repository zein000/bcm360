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
Object.defineProperty(exports, "__esModule", { value: true });
exports.FeaturesGuard = void 0;
const common_1 = require("@nestjs/common");
const feature_repo_1 = require("../repositories/feature.repo");
const FeaturesGuard = (feature) => {
    let FeaturesGuardMixin = class FeaturesGuardMixin {
        constructor(featureRepo) {
            this.featureRepo = featureRepo;
            this.logger = new common_1.Logger();
        }
        async canActivate(context) {
            const request = context.switchToHttp().getRequest();
            const { user } = request;
            if (!user) {
                const hasFeature = await this.featureRepo.getOneByFeature(feature);
                return hasFeature.active;
            }
            const hasFeature = await this.featureRepo.getOneByFeature(feature, user.companyId);
            return hasFeature.active;
        }
    };
    FeaturesGuardMixin = __decorate([
        __param(0, (0, common_1.Inject)(feature_repo_1.FeatureRepository)),
        __metadata("design:paramtypes", [feature_repo_1.FeatureRepository])
    ], FeaturesGuardMixin);
    return (0, common_1.mixin)(FeaturesGuardMixin);
};
exports.FeaturesGuard = FeaturesGuard;
//# sourceMappingURL=features.guard.js.map