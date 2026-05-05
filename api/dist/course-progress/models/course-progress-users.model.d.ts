import { Model } from "sequelize-typescript";
import CourseProgress from "./course-progress.model";
import ProtocolDecisions from "./protocol-decisions.model";
export default class CourseProgressUsers extends Model {
    id: string;
    courseProgressId: string;
    courseProgress: CourseProgress;
    firstName: string;
    lastName: string;
    email: string;
    firstJoinTimeStamp?: number;
    exitTimeStamp?: number;
    invitedTimeStamp?: number;
    isAccepted: boolean;
    isERR: boolean;
    votedFor: ProtocolDecisions[];
}
