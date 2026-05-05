import { Model } from "sequelize-typescript";
import User from "../../users/models/user.model";
import Company from "src/company/models/company.model";
import CourseProgress from "src/course-progress/models/course-progress.model";
import CourseFile from "./course-file.model";
import CourseTag from "./course-tag.model";
export default class Course extends Model {
    id: number;
    name?: string;
    description?: string;
    forWhom?: string;
    json?: JSON;
    companyId?: number;
    company?: Company;
    tagId?: number;
    tag?: CourseTag;
    deletedById?: number;
    deletedBy?: User;
    courseFiles: CourseFile[];
    courseProgresses: CourseProgress[];
    updatedAt: Date;
    createdAt: Date;
}
