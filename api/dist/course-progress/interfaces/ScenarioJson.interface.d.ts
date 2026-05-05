import { FileTypes } from "src/file/enum/FileTypes.enum";
import { CourseProgressEnum } from "../enum/Status";
export interface IScenarioJson {
    author: string;
    Content: IStageInfo[];
    scenarioName: string;
    timeDelayedContent?: IStageContentInfo[];
}
export interface IStageInfo {
    id: number;
    content: string;
    phaseName: string;
    timeLimit?: number;
    contentType: FileTypes;
    decisionName?: string;
    decisionOptions?: IDecisionOptions[];
    timeLeftDecisionId?: number;
    spoilerContent?: ISpoilerContent;
    phaseEndText?: string;
    timeDelayedContent?: IStageContentInfo[];
    confirmationRequired: DecisionConfirmationTypes;
    phaseEndResult?: CourseProgressEnum;
    autoplay?: boolean;
}
export type ISpoilerContent = {
    content: string;
    title: string;
};
export interface IStageContentInfo {
    id?: string;
    content: string;
    title?: string;
    startTimeInSeconds?: number;
    contentType: FileTypes;
    endTimeInSeconds?: number;
    timeStamp?: number;
    stageNumber?: number;
    autoplay?: boolean;
    isRemoved?: boolean;
}
export interface IDecisionOptions {
    option: string;
    phaseId: number;
}
export declare enum DecisionConfirmationTypes {
    FROM_LEADER = "FROM_LEADER",
    FROM_ALL = "FROM_ALL",
    NONE = "NONE"
}
export declare const EMPTY_COURSE_SCENARIO: IScenarioJson;
