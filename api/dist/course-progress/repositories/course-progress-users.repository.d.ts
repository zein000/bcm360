import CourseProgressUsers from "../models/course-progress-users.model";
export declare class CourseProgressUsersRepository {
    private model;
    private readonly logger;
    constructor(model: typeof CourseProgressUsers);
    bulkCreate(preparedUsers: any[]): Promise<CourseProgressUsers[]>;
}
