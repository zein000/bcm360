import RequestWithUser from "src/interfaces/request-with-user.interface";
import { PageDTO, PageOptionsDTO } from "src/common/dto";
import { CourseService } from "./course.service";
import { CourseAdminInfoDTO } from "./dto/course-admin-info.dto";
import { CourseFileInfoDTO } from "./dto/course-file-info.dto";
import { CreateCourseDTO } from "./dto/create-course.dto";
import { UpdateCourseDTO } from "./dto/update-course.dto";
import { FileAssignment } from "./enums/FileAssignment.enum";
import { CourseTagInfoDTO } from "./dto/course-tag-info.dto";
export declare class CourseController {
    private readonly courseService;
    private readonly logger;
    constructor(courseService: CourseService);
    createPerson(data: CreateCourseDTO, { user }: RequestWithUser): Promise<CourseAdminInfoDTO>;
    getall(pageOptions: PageOptionsDTO, { user }: RequestWithUser): Promise<PageDTO<CourseAdminInfoDTO>>;
    getAllTags({ user }: RequestWithUser): Promise<CourseTagInfoDTO[]>;
    getAllRelatedCourses(id: string, { user }: RequestWithUser): Promise<CourseAdminInfoDTO[]>;
    findOne(id: string): Promise<CourseAdminInfoDTO>;
    update(params: {
        id: number;
    }, data: UpdateCourseDTO, { user }: RequestWithUser): Promise<number>;
    upload({ user }: RequestWithUser, data: UpdateCourseDTO): Promise<number>;
    delete(params: {
        id: number;
    }, { user }: RequestWithUser): Promise<number>;
    uploadFiles(files: Express.Multer.File[], fileAssignment: FileAssignment): Promise<CourseFileInfoDTO[]>;
    deleteFile(filePath: string): Promise<void>;
}
