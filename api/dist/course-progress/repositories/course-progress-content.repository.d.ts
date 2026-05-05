import CourseProgressContent from "../models/course-progress-content.model";
export declare class CourseProgressContentRepository {
    private model;
    private readonly logger;
    constructor(model: typeof CourseProgressContent);
    bulkCreate(preparedContent: any[]): Promise<CourseProgressContent[]>;
}
