import User from "src/users/models/user.model";
import { FeatureInfo } from "./dtos/feature-info";
import { FeatureRepository } from "./repositories/feature.repo";
export declare class FeaturesService {
    private readonly featureRepo;
    constructor(featureRepo: FeatureRepository);
    getFeatures(user?: User): Promise<FeatureInfo[]>;
}
