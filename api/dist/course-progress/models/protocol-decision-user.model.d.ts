import { Model } from "sequelize-typescript";
import ProtocolDecisions from "./protocol-decisions.model";
import CourseProgressUsers from "./course-progress-users.model";
export default class ProtocolDecisionUserModel extends Model {
    protocolDecisionId: number;
    protocolDecision: ProtocolDecisions;
    userId: string;
    user: CourseProgressUsers;
}
