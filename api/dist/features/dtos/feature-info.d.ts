import Feature from "../models/feature.model";
export declare class FeatureInfo implements Partial<Omit<Feature, "company">> {
    feature: string;
    active: boolean;
    id: number;
    companyId: number;
    updatedAt?: Date;
    createdAt?: Date;
    constructor(data: Feature);
}
