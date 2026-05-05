import { ConfigType } from "@nestjs/config";
import { Cache } from "cache-manager";
import { UserInfoDTO } from "src/users/dto/user-info.dto";
import User from "../../users/models/user.model";
import { UsersService } from "../../users/users.service";
import { CachingService } from "../caching.service";
import cacheConfig from "../config/caching.config";
export declare class UserInfoCachingService extends CachingService {
    private readonly userService;
    constructor(config: ConfigType<typeof cacheConfig>, cacheManager: Cache, userService: UsersService);
    setUser(data: User): Promise<void>;
    setUserByApiKey(data: User): Promise<void>;
    getUser(id: number): Promise<any>;
    getUserByApiKey(apiKey: string): Promise<any>;
    clearUser(data: User | UserInfoDTO): Promise<void>;
}
