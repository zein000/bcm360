import { Model } from "sequelize-typescript";
import Course from "./course.model";
import { FileTypes } from "../../file/enum/FileTypes.enum";
import { FileAssignment } from "../enums/FileAssignment.enum";
export default class CourseFile extends Model {
    id: number;
    fullFilePath: string;
    fileName: string;
    fileLength: number;
    fileType: FileTypes;
    fileAssignment: FileAssignment;
    courseId?: number;
    course?: Course;
    updatedAt: Date;
    createdAt: Date;
}
