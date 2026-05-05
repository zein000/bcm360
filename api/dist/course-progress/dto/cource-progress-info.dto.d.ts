import { CourseInfoDTO } from "src/courses/dto/course-info.dto";
import { CourseProgressEnum } from "../enum/Status";
import CourseProgress from "../models/course-progress.model";
import { UserInfoDTO } from "src/users/dto/user-info.dto";
import { CourseProgressUserInfoDto } from "./course-progress-user-info.dto";
import { ProtocolHistoryInfoDto } from "./protocol-history-info.dto";
import { CourseProgressContentInfoDto } from "./course-progress-content.dto";
export declare class CourseProgressInfoDto implements Partial<Omit<CourseProgress, "course" | "user" | "protocolHistories" | "users" | "content">> {
    id: string;
    status?: CourseProgressEnum;
    finalPhaseId?: number;
    scenarioEndMessage?: string;
    course?: CourseInfoDTO;
    user?: UserInfoDTO;
    users?: CourseProgressUserInfoDto[];
    protocolHistories?: ProtocolHistoryInfoDto[];
    content?: CourseProgressContentInfoDto[];
    updatedAt?: Date;
    createdAt?: Date;
    finishDate?: Date;
    constructor(data: CourseProgress);
}
