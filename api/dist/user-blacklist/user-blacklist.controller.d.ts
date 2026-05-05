import { UserBlacklistJwtRequestDto } from "src/user-blacklist/dto/user-blacklist-jtw-request.dto";
import { BaseResponseDTO } from "src/common/dto/base-response.dto";
import { UserBlacklistService } from "./user-blacklist.service";
export declare class UserBlacklistController {
    private readonly jwtService;
    constructor(jwtService: UserBlacklistService);
    blacklistJwt(data: UserBlacklistJwtRequestDto): Promise<BaseResponseDTO<null>>;
}
