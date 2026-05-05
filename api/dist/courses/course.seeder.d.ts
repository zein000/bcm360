import Course from "./models/course.model";
export declare class CourseSeeder {
    private courseModel;
    private readonly logger;
    constructor(courseModel: typeof Course);
    seed(): Promise<void>;
}
