import { PageDTO } from "../../common/dto";
import { UserInfoDTO } from "./user-info.dto";
export declare class PaginatedUsersDTO extends PageDTO<UserInfoDTO> {
    readonly data: UserInfoDTO[];
}
