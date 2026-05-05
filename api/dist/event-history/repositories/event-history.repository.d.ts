import EventHistory from "../models/event-history.model";
export declare class EventHistoryRepository {
    private model;
    private readonly logger;
    constructor(model: typeof EventHistory);
    create(event: Partial<EventHistory>): Promise<EventHistory>;
}
