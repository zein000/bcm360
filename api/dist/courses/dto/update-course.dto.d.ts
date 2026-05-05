import CourseFile from "../models/course-file.model";
import CourseTag from "../models/course-tag.model";
import Course from "../models/course.model";
export declare class UpdateCourseDTO implements Partial<Course> {
    name?: string;
    description?: string;
    forWhom?: string;
    tag?: CourseTag;
    json?: JSON;
    courseFiles?: CourseFile[];
}
