import ProtocolDecisions from "../models/protocol-decisions.model";
import { CourseProgressUserInfoDto } from "./course-progress-user-info.dto";
import { ProtocolHistoryInfoDto } from "./protocol-history-info.dto";
export declare class ProtocolDecisionInfoDto implements Partial<Omit<ProtocolDecisions, "protocolHistory" | "votedBy">> {
    id: number;
    decision?: string;
    finalDecision?: string;
    protocolHistory?: ProtocolHistoryInfoDto;
    votedBy?: CourseProgressUserInfoDto[];
    constructor(data: ProtocolDecisions);
}
