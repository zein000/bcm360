import { Model } from "sequelize-typescript";
import ProtocolHistories from "./protocol-histories.model";
import CourseProgressUsers from "./course-progress-users.model";
export default class ProtocolDecisions extends Model {
    id: number;
    protocolHistoryId: string;
    protocolHistory: ProtocolHistories;
    decision: string;
    finalDecision: string;
    votedBy: CourseProgressUsers[];
}
