import { ScenarioMessageTypes } from "../enum/ScenarioMessageTypes.enum";
export interface ScenarioMessageInfo {
    id: string;
    type: ScenarioMessageTypes;
    timestamp: number;
    data: any;
}
