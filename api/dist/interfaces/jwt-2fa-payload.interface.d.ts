import { RoleInfoDTO } from "src/roles/dto/role-info.dto";
export interface JWT2FAPayload {
    id: number;
    roles: RoleInfoDTO[];
    is2FAEnabled: boolean;
}
