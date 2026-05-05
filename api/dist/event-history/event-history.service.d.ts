import { EventName } from "../enums/event-name.enum";
import { EventHistoryRepository } from "./repositories/event-history.repository";
export declare class EventHistoryService {
    private readonly eventHistoryRepo;
    private readonly logger;
    constructor(eventHistoryRepo: EventHistoryRepository);
    saveHistory(name: EventName, userId?: number, data?: Record<string, unknown>): Promise<void>;
}
