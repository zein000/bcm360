import { RoleInfoDTO } from "src/roles/dto/role-info.dto";
import RolePermission from "../../roles/models/role-permission.model";
import Permission from "../models/permission.model";
export declare class PermissionInfoDTO implements Partial<Omit<Permission, "roles">> {
    id?: number;
    name?: string;
    code?: string;
    description?: string;
    createdAt: Date;
    updatedAt: Date;
    roles?: RoleInfoDTO[];
    RolePermission?: RolePermission;
    constructor(data: Permission);
}
