import Feature from "./models/feature.model";
export declare class FeaturesSeeder {
    private model;
    private logger;
    constructor(model: typeof Feature);
    seed(): Promise<void>;
}
