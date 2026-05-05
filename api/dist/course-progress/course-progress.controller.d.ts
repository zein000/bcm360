import { Response } from "express";
import { PageDTO, PageOptionsDTO } from "src/common/dto";
import RequestWithUser from "src/interfaces/request-with-user.interface";
import { PermissionCodes } from "src/permissions/enum/codes";
import { CourseProgressService } from "./course-progress.service";
import { CourseProgressInfoDto } from "./dto/cource-progress-info.dto";
import { CreateCourseProgressDTO } from "./dto/create-course-progress.dto";
import { ExportScenarioReportDto } from "./dto/export-report.dto";
import { InviteUserOnScenarioDTO } from "./dto/invite-user-on-scenario.dto";
import { IScenarioUser } from "./interfaces/ScenarioUser.interface";
import { ConnectQuestService } from "../quest/connect-quest.service";
export declare class CourseProgressController {
    private readonly courseProgressService;
    private readonly connectQuest;
    private readonly logger;
    constructor(courseProgressService: CourseProgressService, connectQuest: ConnectQuestService);
    initializeScenario(data: CreateCourseProgressDTO, { user }: RequestWithUser): Promise<CourseProgressInfoDto>;
    checkScenariosInProgress({ user }: RequestWithUser): Promise<CourseProgressInfoDto | null>;
    findOne({ user }: RequestWithUser, id: string): Promise<CourseProgressInfoDto>;
    getall(pageOptions: PageOptionsDTO, { user }: RequestWithUser): Promise<PageDTO<CourseProgressInfoDto>>;
    checkIfAlreadyAccept({ user }: {
        user: IScenarioUser;
    }): Promise<{
        user: IScenarioUser;
        accessToken: string;
        courseProgressId: string;
    } | {
        user?: undefined;
        accessToken?: undefined;
        courseProgressId?: undefined;
    }>;
    invite(body: {
        users: InviteUserOnScenarioDTO[];
        courseProgressId?: string;
    }, { user }: RequestWithUser): Promise<void>;
    acceptInvite(body: {
        user: InviteUserOnScenarioDTO;
        courseProgressId?: string;
        accessToken: string;
    }, { user }: {
        user: IScenarioUser;
    }): Promise<{
        courseProgressId: string;
        user: {
            id: string;
            firstName?: string;
            lastName?: string;
            email: string;
            isActive?: boolean;
            isAccepted?: boolean;
            permissions?: PermissionCodes[];
            token?: string;
            courseProgressId?: string;
            firstJoinTimeStamp?: number;
            exitTimeStamp?: number | null;
            invitedTimeStamp?: number;
            isRemoved?: boolean;
        };
        accessToken: string;
    }>;
    delete(params: {
        id: string;
    }, { user }: RequestWithUser): Promise<void>;
    exportScenarioReport({ id }: {
        id: string;
    }, { user }: RequestWithUser, body: ExportScenarioReportDto, res: Response): Promise<void>;
    generateInviteLink(body: {
        email: string;
        courseProgressId: string;
    }, { user }: RequestWithUser): Promise<{
        link: string;
        userInfo: IScenarioUser;
    }>;
}
