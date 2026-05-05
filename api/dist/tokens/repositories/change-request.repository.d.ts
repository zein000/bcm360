import ChangeRequest from "../models/change-request.model";
export declare class ChangeRequestRepository {
    private model;
    private readonly logger;
    constructor(model: typeof ChangeRequest);
    createChangeRequest(data: Partial<ChangeRequest>): Promise<ChangeRequest>;
    markAsAccepted(id: number): Promise<[affectedCount: number]>;
}
