import { ConfigType } from "@nestjs/config";
import { Cache } from "cache-manager";
import UserBlacklist from "src/user-blacklist/models/user-blacklist.model";
import cacheConfig from "../config/caching.config";
import { CachingService } from "../caching.service";
export declare class BlacklistJwtCachingService extends CachingService {
    constructor(config: ConfigType<typeof cacheConfig>, cacheManager: Cache);
    setBlacklistedJwt(data: Partial<UserBlacklist>): Promise<void>;
    getBlacklistedJwt(jwt: string): Promise<any>;
    deleteBlacklistedJwt(jwt: string): Promise<void>;
}
