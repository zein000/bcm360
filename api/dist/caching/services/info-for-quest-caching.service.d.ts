import { CachingService } from "../caching.service";
import cacheConfig from "../config/caching.config";
import { ConfigType } from "@nestjs/config";
import { Cache } from "cache-manager";
export declare class InfoForQuestCachingService extends CachingService {
    private readonly redisClient;
    constructor(config: ConfigType<typeof cacheConfig>, cacheManager: Cache);
    scanForPin(): Promise<string>;
    setPin(pin: string, pack: string): Promise<void>;
    setProgressID(id: string): Promise<void>;
    getProgressID(): Promise<string>;
    setCurrentUserId(id: string): Promise<string>;
    getCurrentUserId(): Promise<string>;
    setToken(token: string): Promise<void>;
    getToken(): Promise<string>;
    getTokenID(pin: number): Promise<string>;
}
