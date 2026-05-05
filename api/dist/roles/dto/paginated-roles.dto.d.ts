import { PageDTO } from "../../common/dto";
import { RoleInfoDTO } from "./role-info.dto";
export declare class PaginatedRolesDTO extends PageDTO<RoleInfoDTO> {
    readonly data: RoleInfoDTO[];
}
