import { IScenarioJson, IStageContentInfo } from "src/course-progress/interfaces/ScenarioJson.interface";
import { ScenarioMessageInfo } from "src/course-progress/interfaces/ScenarioMessageInfo.interface";
import { IScenarioUser } from "src/course-progress/interfaces/ScenarioUser.interface";
export interface ScenarioProgress {
    protocolHistory: ScenarioMessageInfo[];
    chatHistory: ScenarioMessageInfo[];
    currentStage: number;
    currentStageStartTimestamp: number;
    currentStageEndTimestamp: number;
    json: IScenarioJson;
    stageContent: IStageContentInfo[];
    users: IScenarioUser[];
    errInfo: IScenarioUser;
    lastUpdateTimeStamp: number;
}
