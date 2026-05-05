import { ConfigType } from "@nestjs/config";
import { Cache } from "cache-manager";
import { IScenarioJson, IStageContentInfo, IStageInfo } from "src/course-progress/interfaces/ScenarioJson.interface";
import { ScenarioMessageInfo } from "src/course-progress/interfaces/ScenarioMessageInfo.interface";
import { IScenarioUser } from "src/course-progress/interfaces/ScenarioUser.interface";
import { PermissionCodes } from "src/permissions/enum/codes";
import User from "src/users/models/user.model";
import { CachingService } from "../caching.service";
import cacheConfig from "../config/caching.config";
import { ActiveTimersData } from "../interfaces/ActiveTimersData.interface";
import { ITemporaryContent } from "../interfaces/ITemporaryContent.interface";
import { ScenarioProgress } from "../interfaces/ScenarioProgress.interface";
export declare class ScenarioProgressCachingService extends CachingService {
    private locks;
    private activeLocks;
    constructor(config: ConfigType<typeof cacheConfig>, cacheManager: Cache);
    setActiveTimers(activeTimersData: ActiveTimersData): Promise<string>;
    getActiveTimers(): Promise<ActiveTimersData>;
    private getMutex;
    unlockScenario(courseId: string): void;
    setScenario(courseId: string, data: ScenarioProgress): Promise<void>;
    getScenarioProgress(courseId: string, isReadOnly?: boolean): Promise<ScenarioProgress | undefined>;
    saveScenarioJson(courseId: string, json: IScenarioJson): Promise<void>;
    setCurrentStageEndTimestamp(courseId: string, currentStageEndTimestamp: number, currentStageStartTimestamp?: number): Promise<void>;
    saveProtocolMessage(courseId: string, message: ScenarioMessageInfo): Promise<void>;
    saveChatMessage(courseId: string, message: ScenarioMessageInfo): Promise<void>;
    goToNewStage(courseId: string, newStageId: number): Promise<void>;
    pushNewDecision(courseId: string, stageInfo: IStageInfo): Promise<void>;
    saveActiveTimerStage(courseId: string, currentStageTimeStampEnd: number): Promise<string>;
    removeActiveTimerStage(courseId: string): Promise<string>;
    updateUserExitTimeStamp(courseId: string, user: IScenarioUser, exitTimeStamp?: number): Promise<void>;
    saveScenarioStageContent(courseId: string, info: IStageContentInfo): Promise<void>;
    showCurrentStageSpoiler(courseId: string, requesterEmail: string): Promise<{
        existedProgress: ScenarioProgress;
        spoilerContent: IStageContentInfo;
    }>;
    removeScenarioStageContent(courseId: string, info: IStageContentInfo): Promise<void>;
    clearScenarioProgress(courseId: string): Promise<void>;
    setTemporaryContent(temporaryContent: {
        [key: string]: ITemporaryContent[];
    }): Promise<string>;
    getTemporaryContent(): Promise<{
        [key: string]: ITemporaryContent[];
    }>;
    addTemporaryContent(courseProgressId: string, timeStamp: number, timeDelayedContent: IStageContentInfo[], stageNumber?: number): Promise<string>;
    removeTemporaryContentArray(removedData: {
        courseProgressId: string;
        contentIds: string[];
    }[]): Promise<string>;
    clearTemporaryContentForCourseProgress(courseProgressId: string, isRemoveAll?: boolean): Promise<string>;
    onCourseInitialize(courseProgressId: string, errInfo: Partial<User>, courseScenario: IScenarioJson, isOnlyOneStage: boolean): Promise<void>;
    updateUserPermissions(courseProgressId: string, targetUserId: string, permissions: PermissionCodes[]): Promise<IScenarioUser>;
    removeUserFromScenario(courseProgressId: string, user: IScenarioUser, requester: User): Promise<ScenarioProgress>;
}
