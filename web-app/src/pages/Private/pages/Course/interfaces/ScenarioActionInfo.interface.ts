import { ScenarioActionTypes } from "../enums/ScenarioActionTypes.enum";

export interface ScenarioActionInfo {
	id: string;
	type: ScenarioActionTypes;
	timestamp: number;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	data: any;
}
