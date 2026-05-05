import { CourseScenario, IStageContentInfo } from "../../Courses/constants/emptyCourseScenario";
import { ScenarioMessageInfo } from "./ScenarioMessageInfo.interface";

export interface ScenarioProgress {
	course: any;
	protocolHistory: ScenarioMessageInfo[];
	chatHistory: ScenarioMessageInfo[];
	currentStage: number;
	currentStageEndTimestamp: number;
	json: CourseScenario;
	stageContent: IStageContentInfo[];
}
