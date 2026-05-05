import CourseProgress from "../models/course-progress.model";
export declare class CreateCourseProgressDTO implements Partial<CourseProgress> {
    courseId?: number;
    userId?: number;
}
