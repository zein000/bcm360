import Company from "../models/company.model";
export declare class CompanyRepository {
    private model;
    private readonly logger;
    constructor(model: typeof Company);
    findAll(): Promise<Company[]>;
    findAllAndCount(limit: number, skip: number, searchValue: string | null, filters?: Record<string, string | string[]>): Promise<{
        rows: Company[];
        count: number;
    }>;
    findOneCompany(id: number): Promise<Company>;
    createCompany(company: Company): Promise<Company>;
}
