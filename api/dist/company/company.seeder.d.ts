import Company from "./models/company.model";
export declare class CompanySeeder {
    private companyModel;
    private readonly logger;
    constructor(companyModel: typeof Company);
    seed(): Promise<void>;
}
