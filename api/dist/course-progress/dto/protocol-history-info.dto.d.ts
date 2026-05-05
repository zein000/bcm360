import ProtocolHistories from "../models/protocol-histories.model";
import { ScenarioMessageTypes } from "../enum/ScenarioMessageTypes.enum";
import { CourseProgressInfoDto } from "./cource-progress-info.dto";
import { ProtocolDecisionInfoDto } from "./protocol-decision-info.dto";
import { ProtocolMessageInfoDto } from "./protocol-messages-info.dto";
import { CourseProgressUserInfoDto } from "./course-progress-user-info.dto";
export declare class ProtocolHistoryInfoDto implements Partial<Omit<ProtocolHistories, "courseProgress" | "protocolMessages" | "protocolDecisions" | "user">> {
    id: string;
    type: ScenarioMessageTypes;
    timestamp: number;
    courseProgress: CourseProgressInfoDto;
    protocolDecisions: ProtocolDecisionInfoDto;
    protocolMessages: ProtocolMessageInfoDto;
    user: CourseProgressUserInfoDto;
    constructor(data: ProtocolHistories);
}
