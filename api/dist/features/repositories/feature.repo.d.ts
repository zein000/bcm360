import User from "src/users/models/user.model";
import { FeaturesCodes } from "../enum/codes";
import Feature from "../models/feature.model";
export declare class FeatureRepository {
    private model;
    private readonly logger;
    constructor(model: typeof Feature);
    getOneByFeature(feature: FeaturesCodes, companyId?: number): Promise<Feature>;
    getAll(user?: User): Promise<Feature[]>;
}
