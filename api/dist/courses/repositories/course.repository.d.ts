import User from "../../users/models/user.model";
import Course from "../models/course.model";
export declare class CourseRepository {
    private model;
    private readonly logger;
    constructor(model: typeof Course);
    findAll(): Promise<Course[]>;
    findAllAndCount(limit: number, skip: number, searchValue: string | null, user: User): Promise<{
        rows: Course[];
        count: number;
    }>;
    findOneCourse(id: number): Promise<Course>;
    findAllWithTag(tagId: number, currentCourseId: number, user: User): Promise<Course[]>;
    createCourse(course: Course): Promise<Course>;
}
