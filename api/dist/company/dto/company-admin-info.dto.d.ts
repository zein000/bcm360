import User from "../../users/models/user.model";
import Company from "../models/company.model";
export declare class CompanyAdminInfoDTO implements Partial<Company> {
    id: number;
    name?: string;
    updatedAt?: Date;
    createdAt?: Date;
    admins?: User[];
    constructor(data: Company);
}
