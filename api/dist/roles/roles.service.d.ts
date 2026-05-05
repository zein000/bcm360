import User from "src/users/models/user.model";
import { PageDTO, PageOptionsDTO } from "../common/dto";
import { CreateRoleDTO } from "./dto/create-role.dto";
import { RoleInfoDTO } from "./dto/role-info.dto";
import { UpdateRoleDTO } from "./dto/update-role.dto";
import { RoleRepository } from "./repositories/role.repository";
import { PermissionRepository } from "../permissions/repositories/permission.repository";
import { AssignUnassignPermissionsDTO } from "./dto/assign-unassign-permissions.dto";
import Role from "./models/role.model";
export declare class RolesService {
    private readonly roleRepo;
    private readonly permissionRepo;
    constructor(roleRepo: RoleRepository, permissionRepo: PermissionRepository);
    create(data: CreateRoleDTO): Promise<RoleInfoDTO>;
    findAll(user: User, pageOptions: PageOptionsDTO): Promise<PageDTO<RoleInfoDTO>>;
    findOneById(id: number): Promise<RoleInfoDTO>;
    findOneRoleById(id: number): Promise<Role>;
    findOneByCode(code: string): Promise<Role>;
    findManyByCode(codes: string[]): Promise<Role[]>;
    update(id: number, data: UpdateRoleDTO): Promise<RoleInfoDTO>;
    assignPermissions(id: number, data: AssignUnassignPermissionsDTO): Promise<RoleInfoDTO>;
    unassignPermissions(id: number, data: AssignUnassignPermissionsDTO): Promise<RoleInfoDTO>;
    delete(id: number): Promise<{
        roleId: number;
    }>;
}
