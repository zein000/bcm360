import { UserLanguage } from "src/enums/user.enum";
export declare class UpdateUserDTO {
    email?: string;
    firstName?: string;
    lastName?: string;
    linkedinUrl?: string;
    userLanguage?: UserLanguage;
    is2FAEnabled?: boolean;
    autoAccept?: boolean;
    linkedinCookie?: JSON;
    customUa?: string;
    roleId: number;
}
