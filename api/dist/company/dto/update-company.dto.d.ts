import { YearlyOrMonthly } from "src/enums/company.enum";
import Company from "../models/company.model";
export declare class UpdateCompanyDTO implements Partial<Company> {
    name?: string;
    filtered?: number;
    yearlyOrMonthly?: YearlyOrMonthly;
}
