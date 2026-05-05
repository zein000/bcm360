import { PermissionCodes } from "src/permissions/enum/codes";
export interface IScenarioUser {
    id: string;
    firstName?: string;
    lastName?: string;
    email: string;
    isActive?: boolean;
    isAccepted?: boolean;
    permissions?: PermissionCodes[];
    token?: string;
    courseProgressId?: string;
    firstJoinTimeStamp?: number;
    exitTimeStamp?: number | null;
    invitedTimeStamp?: number;
    isRemoved?: boolean;
}
