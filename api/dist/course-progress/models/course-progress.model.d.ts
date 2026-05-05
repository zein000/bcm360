import { Model } from "sequelize-typescript";
import Course from "src/courses/models/course.model";
import User from "src/users/models/user.model";
import { CourseProgressEnum } from "../enum/Status";
import ProtocolHistories from "./protocol-histories.model";
import CourseProgressUsers from "./course-progress-users.model";
import CourseProgressContent from "./course-progress-content.model";
export default class CourseProgress extends Model {
    id: string;
    status: CourseProgressEnum;
    finalPhaseId?: number;
    scenarioEndMessage?: string;
    finishDate?: Date;
    courseId: number;
    course: Course;
    protocolHistories: ProtocolHistories;
    users: CourseProgressUsers;
    content: CourseProgressContent;
    userId: number;
    user: User;
    deletedById?: number;
    deletedBy?: User;
    updatedAt: Date;
    createdAt: Date;
}
