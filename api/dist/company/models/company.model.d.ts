import { Model } from "sequelize-typescript";
import User from "../../users/models/user.model";
import CourseTag from "src/courses/models/course-tag.model";
export default class Company extends Model {
    id: number;
    name?: string;
    startDay?: number;
    admins?: User[];
    users?: User[];
    tags?: CourseTag[];
    deletedById?: number;
    deletedBy?: User;
    updatedAt: Date;
    createdAt: Date;
}
