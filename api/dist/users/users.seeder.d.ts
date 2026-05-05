import Company from "src/company/models/company.model";
import Role from "../roles/models/role.model";
import User from "./models/user.model";
export declare class UsersSeeder {
    private userModel;
    private readonly modelCompany;
    private roleModel;
    private readonly logger;
    constructor(userModel: typeof User, modelCompany: typeof Company, roleModel: typeof Role);
    seed(): Promise<void>;
}
