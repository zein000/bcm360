import ProtocolDecisions from "../models/protocol-decisions.model";
export declare class ProtocolDecisionRepository {
    private model;
    private readonly logger;
    constructor(model: typeof ProtocolDecisions);
    create(protocolDecision: any, votedBy: string[]): Promise<ProtocolDecisions>;
}
