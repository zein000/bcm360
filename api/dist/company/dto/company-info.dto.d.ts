import User from "../../users/models/user.model";
import Company from "../models/company.model";
export declare class CompanyInfoDTO implements Partial<Company> {
    id: number;
    name?: string;
    filtered?: number;
    identified?: number;
    updatedAt?: Date;
    createdAt?: Date;
    admins?: User[];
    constructor(data: Company);
}
