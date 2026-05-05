import { Model } from "sequelize-typescript";
import Course from "./course.model";
import Company from "src/company/models/company.model";
export default class CourseTag extends Model {
    id: number;
    name: string;
    courses: Course[];
    companyId?: number;
    company?: Company;
    updatedAt: Date;
    createdAt: Date;
}
