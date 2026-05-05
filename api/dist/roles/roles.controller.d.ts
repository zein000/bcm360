import { PageOptionsDTO } from "src/common/dto";
import RequestWithUser from "src/interfaces/request-with-user.interface";
import { RoleInfoDTO } from "./dto/role-info.dto";
import { RolesService } from "./roles.service";
import { CreateRoleDTO } from "./dto/create-role.dto";
import { PaginatedRolesDTO } from "./dto/paginated-roles.dto";
import { UpdateRoleDTO } from "./dto/update-role.dto";
import { AssignUnassignPermissionsDTO } from "./dto/assign-unassign-permissions.dto";
import { RoleIdDTO } from "./dto/role-id.dto";
export declare class RolesController {
    private readonly rolesService;
    constructor(rolesService: RolesService);
    createRole(data: CreateRoleDTO): Promise<RoleInfoDTO>;
    findAll({ user }: RequestWithUser, pageOptions: PageOptionsDTO): Promise<PaginatedRolesDTO>;
    findOneById({ id }: RoleIdDTO): Promise<RoleInfoDTO>;
    updateRole({ id }: RoleIdDTO, data: UpdateRoleDTO): Promise<RoleInfoDTO>;
    deleteRole({ id }: RoleIdDTO): ReturnType<RolesService["delete"]>;
    assignPermissions({ id }: RoleIdDTO, data: AssignUnassignPermissionsDTO): Promise<RoleInfoDTO>;
    unassignPermissions({ id }: RoleIdDTO, data: AssignUnassignPermissionsDTO): Promise<RoleInfoDTO>;
}
