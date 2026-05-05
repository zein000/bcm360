import { PermissionCodes } from "src/permissions/enum/codes";
import User from "src/users/models/user.model";
export declare const getUserToken: () => string;
export declare const getInviteTokenCompareDate: () => Date;
export declare const getRandomPassword: () => string;
export declare const passwordRegExp: RegExp;
export declare const passwordLength = 8;
export declare const hasPermission: (user: User, permission: PermissionCodes) => boolean;
