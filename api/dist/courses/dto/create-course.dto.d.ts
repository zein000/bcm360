import Course from "../models/course.model";
import CourseFile from "../models/course-file.model";
import CourseTag from "../models/course-tag.model";
export declare class CreateCourseDTO implements Partial<Course> {
    name: string;
    description: string;
    forWhom: string;
    tag?: CourseTag;
    json?: JSON;
    courseFiles?: CourseFile[];
}
