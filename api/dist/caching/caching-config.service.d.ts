import { ConfigType } from "@nestjs/config";
import { CacheModuleOptions, CacheOptionsFactory } from "@nestjs/cache-manager";
import cacheConfig from "./config/caching.config";
export declare class CachingConfigService implements CacheOptionsFactory {
    private readonly config;
    constructor(config: ConfigType<typeof cacheConfig>);
    createCacheOptions(): Promise<CacheModuleOptions>;
}
