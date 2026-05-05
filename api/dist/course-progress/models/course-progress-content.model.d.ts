import { Model } from "sequelize-typescript";
import { FileTypes } from "src/file/enum/FileTypes.enum";
import CourseProgress from "./course-progress.model";
export default class CourseProgressContent extends Model {
    id: string;
    courseProgressId: string;
    courseProgress: CourseProgress;
    content: string;
    contentType: FileTypes;
    timeStamp: number;
    title: string;
    stageNumber: number;
}
