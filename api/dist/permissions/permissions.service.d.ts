import { PageDTO, PageOptionsDTO } from "../common/dto";
import { PermissionRepository } from "./repositories/permission.repository";
import { PermissionInfoDTO } from "./dto/permission-info.dto";
import { UpdatePermissionDTO } from "./dto/update-permission.dto";
export declare class PermissionsService {
    private readonly permissionRepo;
    constructor(permissionRepo: PermissionRepository);
    findAll(pageOptions: PageOptionsDTO): Promise<PageDTO<PermissionInfoDTO>>;
    findOneById(id: number): Promise<PermissionInfoDTO>;
    update(id: number, data: Partial<UpdatePermissionDTO>): Promise<PermissionInfoDTO>;
    delete(id: number): Promise<{
        permissionId: number;
    }>;
}
