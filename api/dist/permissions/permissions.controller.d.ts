import { PageOptionsDTO } from "src/common/dto";
import { PaginatedPermissionsDTO } from "./dto/paginated-permissions.dto";
import { PermissionInfoDTO } from "./dto/permission-info.dto";
import { UpdatePermissionDTO } from "./dto/update-permission.dto";
import { PermissionsService } from "./permissions.service";
export declare class PermissionsController {
    private readonly permissionsService;
    constructor(permissionsService: PermissionsService);
    findAll(pageOptions: PageOptionsDTO): Promise<PaginatedPermissionsDTO>;
    findOneById(id: number): Promise<PermissionInfoDTO>;
    updatePermission(id: number, data: UpdatePermissionDTO): Promise<PermissionInfoDTO>;
}
