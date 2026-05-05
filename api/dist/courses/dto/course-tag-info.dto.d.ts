import CourseTag from "../models/course-tag.model";
import { CourseInfoDTO } from "./course-info.dto";
import { CompanyInfoDTO } from "src/company/dto/company-info.dto";
export declare class CourseTagInfoDTO implements Partial<Omit<CourseTag, "courses" | "company">> {
    id: number;
    name?: string;
    courses?: CourseInfoDTO[];
    company?: CompanyInfoDTO;
    updatedAt?: Date;
    createdAt?: Date;
    constructor(data: CourseTag);
}
