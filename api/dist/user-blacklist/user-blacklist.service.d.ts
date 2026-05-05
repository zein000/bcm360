import { UsersService } from "src/users/users.service";
import { BaseResponseDTO } from "src/common/dto/base-response.dto";
import { BlacklistJwtCachingService } from "src/caching/services/blacklist-caching.service";
import UserBlacklist from "./models/user-blacklist.model";
import { UserBlacklistRepo } from "./repositories/user-blacklist.repository";
export declare class UserBlacklistService {
    private readonly blacklistRepository;
    private readonly userService;
    private readonly blacklistJwtCachingService;
    constructor(blacklistRepository: UserBlacklistRepo, userService: UsersService, blacklistJwtCachingService: BlacklistJwtCachingService);
    blacklistJwt(jwt: string): Promise<BaseResponseDTO<null>>;
    findOneByValue(value: string): Promise<UserBlacklist>;
    deleteExpiredJwts(): Promise<void>;
}
