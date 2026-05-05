import CourseProgress from "../models/course-progress.model";
import User from "src/users/models/user.model";
export declare class CourseProgressRepository {
    private model;
    private readonly logger;
    constructor(model: typeof CourseProgress);
    findAll(): Promise<CourseProgress[]>;
    findAllScenariosInProgress(): Promise<CourseProgress[]>;
    findAllScenariosInProgressForUser(userId: number): Promise<CourseProgress[]>;
    findOneCourseProgress(id: string): Promise<CourseProgress>;
    saveCourseProgress(course: CourseProgress): Promise<CourseProgress>;
    findLastScenarioInProgress(userId: number): Promise<CourseProgress>;
    findCourseProgressWithRelatedDataForReport(id: string, user: User): Promise<CourseProgress>;
    findAllAndCount(limit: number, skip: number, searchValue: string | null, user: User): Promise<{
        rows: CourseProgress[];
        count: number;
    }>;
    deleteCourseProgress(id: string, deletedByUser: User): Promise<void>;
}
