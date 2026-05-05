import { Cache } from "cache-manager";
export declare abstract class CachingService {
    private cacheManager;
    private readonly cacheName;
    private readonly ttl;
    private readonly logger;
    constructor(cacheManager: Cache, cacheName: string, ttl: number);
    protected set(key: string, data: string): Promise<string>;
    protected get(key: string): Promise<string>;
    protected del(key: string): Promise<void>;
    private buildKey;
}
