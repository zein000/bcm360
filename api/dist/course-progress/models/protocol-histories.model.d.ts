import { Model } from "sequelize-typescript";
import { ScenarioMessageTypes } from "../enum/ScenarioMessageTypes.enum";
import CourseProgress from "./course-progress.model";
import ProtocolDecisions from "./protocol-decisions.model";
import ProtocolMessages from "./protocol-messages.model";
import CourseProgressUsers from "./course-progress-users.model";
export default class ProtocolHistories extends Model {
    id: string;
    type: ScenarioMessageTypes;
    courseProgressId: string;
    courseProgress: CourseProgress;
    protocolDecisions: ProtocolDecisions;
    protocolMessages: ProtocolMessages;
    userId: string;
    user: CourseProgressUsers;
    timestamp: number;
    createdAt: Date;
    updatedAt: Date;
}
