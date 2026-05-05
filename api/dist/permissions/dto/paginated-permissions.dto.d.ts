import { PageDTO } from "../../common/dto";
import { PermissionInfoDTO } from "./permission-info.dto";
export declare class PaginatedPermissionsDTO extends PageDTO<PermissionInfoDTO> {
    readonly data: PermissionInfoDTO[];
}
