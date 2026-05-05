import CourseProgressUsers from "../models/course-progress-users.model";
import { CourseProgressInfoDto } from "./cource-progress-info.dto";
export declare class CourseProgressUserInfoDto implements Partial<Omit<CourseProgressUsers, "courseProgress">> {
    id: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    isAccepted?: boolean;
    isERR?: boolean;
    firstJoinTimeStamp?: number;
    exitTimeStamp?: number;
    invitedTimeStamp?: number;
    courseProgress?: CourseProgressInfoDto;
    constructor(data: CourseProgressUsers);
}
