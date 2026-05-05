import ProtocolHistories from "../models/protocol-histories.model";
export declare class ProtocolHistoryRepository {
    private model;
    private readonly logger;
    constructor(model: typeof ProtocolHistories);
    create(protocolHistory: any): Promise<ProtocolHistories>;
}
