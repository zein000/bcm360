import { IStageContentInfo } from "src/course-progress/interfaces/ScenarioJson.interface";
export interface ITemporaryContent {
    courseProgressId: string;
    startShowingTime: number;
    deleteTime: number;
    stageInfo: IStageContentInfo;
    isGlobal: boolean;
}
