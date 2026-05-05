import ProtocolMessages from "../models/protocol-messages.model";
export declare class ProtocolMessagesRepository {
    private model;
    private readonly logger;
    constructor(model: typeof ProtocolMessages);
    create(protocolMessage: any): Promise<ProtocolMessages>;
}
