import { RoleInfoDTO } from "src/roles/dto/role-info.dto";
export interface JWTPayload {
    id: number;
    roles: RoleInfoDTO[];
}
