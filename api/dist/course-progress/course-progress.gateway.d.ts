import { Socket } from "socket.io";
import { ScenarioProgress } from "src/caching/interfaces/ScenarioProgress.interface";
import { ScenarioProgressCachingService } from "src/caching/services/scenario-progress-caching.service";
import { PermissionCodes } from "src/permissions/enum/codes";
import { CourseProgressService } from "./course-progress.service";
import { ScenarioActionTypes } from "./enum/ScenarioActionTypes.enum";
import { ScenarioMessageTypes } from "./enum/ScenarioMessageTypes.enum";
import { SocketEvents } from "./enum/SocketEvents.enum";
import { ConnectQuestService } from "../quest/connect-quest.service";
export declare class CourseProgressGateway {
    private readonly courseProgressService;
    private readonly scenarioProgressCachingService;
    private readonly connectQuestService;
    private readonly logger;
    private stageEndTimers;
    private server;
    constructor(courseProgressService: CourseProgressService, scenarioProgressCachingService: ScenarioProgressCachingService, connectQuestService: ConnectQuestService);
    onModuleInit(): void;
    onModuleDestroy(): void;
    emitSocketEvent(courseProgressId: string | null | undefined, action: SocketEvents, data: any): boolean;
    handleConnection(client: Socket): Promise<void>;
    handleJoinRoom(courseId: string, client: Socket): Promise<void>;
    handleDisconnect(client: Socket): Promise<void>;
    handleChatMessage(data: {
        message: string;
        courseId: string;
    }, client: Socket): Promise<void>;
    handleProtocolMessage({ type, data, courseId }: {
        type: ScenarioMessageTypes;
        data: any;
        courseId: string;
    }, client: Socket): Promise<void>;
    handleUpdateProtocolMessage({ messageId, type, data, courseId, }: {
        messageId: string;
        type: ScenarioMessageTypes;
        data: any;
        courseId: string;
    }, client: Socket): Promise<void>;
    handleGetCurrentProtocolHistory({ courseId }: {
        courseId: string;
    }, client: Socket): Promise<void>;
    handleScenarioAction({ type, data, courseId }: {
        type: ScenarioActionTypes;
        data: any;
        courseId: string;
    }, client: Socket): Promise<void>;
    handleUpdateUser({ updatedPermissions, courseId, userId, }: {
        userId: string;
        updatedPermissions: PermissionCodes[];
        courseId: string;
    }, client: Socket): Promise<void>;
    private goToNewStageHandler;
    checkIfFinalPhase(actualScenarioData: ScenarioProgress): boolean;
    getConnectedUsersInRoom(courseProgressId: string): Promise<{
        isActive: boolean;
        id: string;
        firstName?: string;
        lastName?: string;
        email: string;
        isAccepted?: boolean;
        permissions?: PermissionCodes[];
        token?: string;
        courseProgressId?: string;
        firstJoinTimeStamp?: number;
        exitTimeStamp?: number | null;
        invitedTimeStamp?: number;
        isRemoved?: boolean;
    }[]>;
    private sessionTimeUpHandler;
    private finalizeSession;
    private checkActiveScenariosTimers;
    private checkACtiveScenariosTimeBasedContent;
}
