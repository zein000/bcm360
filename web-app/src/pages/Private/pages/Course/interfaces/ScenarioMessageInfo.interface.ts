import { ScenarioMessageTypes } from "../enums/ScenarioMessageTypes.enum";

export interface ScenarioMessageInfo {
	id: string;
	type: ScenarioMessageTypes;
	timestamp: number;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	data: any;
}
