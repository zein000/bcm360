import { CompanyInfoDTO } from "src/company/dto/company-info.dto";
import { CourseProgressInfoDto } from "src/course-progress/dto/cource-progress-info.dto";
import Course from "../models/course.model";
import { CourseFileInfoDTO } from "./course-file-info.dto";
import { CourseTagInfoDTO } from "./course-tag-info.dto";
export declare class CourseInfoDTO implements Partial<Omit<Course, "company" | "courseFiles" | "courseProgresses" | "tag">> {
    id: number;
    name?: string;
    description?: string;
    forWhom?: string;
    json?: JSON;
    company?: CompanyInfoDTO;
    courseFiles?: CourseFileInfoDTO[];
    tag?: CourseTagInfoDTO;
    courseProgresses?: CourseProgressInfoDto[];
    updatedAt?: Date;
    createdAt?: Date;
    constructor(data: Course);
}
