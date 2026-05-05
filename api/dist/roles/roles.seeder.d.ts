import Permission from "../permissions/models/permission.model";
import Role from "./models/role.model";
export declare class RolesSeeder {
    private roleModel;
    private permissionModel;
    private readonly logger;
    constructor(roleModel: typeof Role, permissionModel: typeof Permission);
    seed(): Promise<void>;
}
