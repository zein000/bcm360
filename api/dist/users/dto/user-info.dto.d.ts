import { RoleInfoDTO } from "src/roles/dto/role-info.dto";
import { UserLanguage } from "src/enums/user.enum";
import { CompanyInfoDTO } from "../../company/dto/company-info.dto";
import { UserStatus } from "../../enums/user-status.enum";
import User from "../models/user.model";
export declare class UserInfoDTO implements Partial<Omit<User, "company" | "role">> {
    id?: number;
    firstName?: string;
    lastName?: string;
    userLanguage?: UserLanguage;
    email?: string;
    customUa?: string;
    linkedinUrl?: string;
    isBlocked?: boolean;
    autoAccept?: boolean;
    status?: UserStatus;
    role?: RoleInfoDTO;
    company?: CompanyInfoDTO;
    is2FAEnabled?: boolean;
    apiKey?: string;
    courseProgressId?: string;
    constructor(data: User);
}
