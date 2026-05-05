import { InfoForQuestCachingService } from "../caching/services/info-for-quest-caching.service";
export declare class ConnectQuestService {
    private readonly infoCache;
    constructor(infoCache: InfoForQuestCachingService);
    private genPin;
    private packProgressIdTokenUserId;
    cacheProgressIdUserId(progId: string, userId: number): Promise<void>;
    cacheToken(query: string): Promise<void>;
    cachePinTokenProgIdUserId(): Promise<void>;
    getPin(): Promise<string>;
    getPerPin(pin: number): Promise<string>;
}
