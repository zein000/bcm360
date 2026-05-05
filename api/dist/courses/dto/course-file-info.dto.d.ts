import CourseFile from "../models/course-file.model";
import { CourseInfoDTO } from "./course-info.dto";
import { FileTypes } from "../../file/enum/FileTypes.enum";
import { FileAssignment } from "../enums/FileAssignment.enum";
export declare class CourseFileInfoDTO implements Partial<Omit<CourseFile, "course">> {
    id: number;
    fullFilePath?: string;
    fileName?: string;
    fileLength?: number;
    fileType?: FileTypes;
    fileAssignment?: FileAssignment;
    course?: CourseInfoDTO;
    updatedAt?: Date;
    createdAt?: Date;
    constructor(data: CourseFile);
}
