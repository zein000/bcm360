import { FileTypes } from "src/file/enum/FileTypes.enum";
import CourseProgressContent from "../models/course-progress-content.model";
import { CourseProgressInfoDto } from "./cource-progress-info.dto";
export declare class CourseProgressContentInfoDto implements Partial<Omit<CourseProgressContent, "courseProgress">> {
    id: string;
    title: string;
    stageNumber: number;
    content: string;
    contentType: FileTypes;
    timeStamp: number;
    courseProgress: CourseProgressInfoDto;
    constructor(data: CourseProgressContent);
}
