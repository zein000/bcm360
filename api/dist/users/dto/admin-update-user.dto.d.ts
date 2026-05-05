import { UpdateUserDTO } from "./update-user.dto";
export declare class AdminUpdateUserDTO extends UpdateUserDTO {
    isBlocked?: boolean;
    firstName?: string;
    lastName?: string;
    is2FAEnabled?: boolean;
}
