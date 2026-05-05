import { PermissionInfoDTO } from "src/permissions/dto/permission-info.dto";
import RolePermission from "../models/role-permission.model";
import Role from "../models/role.model";
export declare class RoleInfoDTO implements Partial<Omit<Role, "permissions">> {
    id?: number;
    name?: string;
    code: string;
    description?: string;
    permissions?: PermissionInfoDTO[];
    createdAt: Date;
    updatedAt: Date;
    RolePermission?: RolePermission;
    constructor(data: Role);
}
