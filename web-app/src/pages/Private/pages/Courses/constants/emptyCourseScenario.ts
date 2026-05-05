import { Edge } from "@xyflow/react";

import { DecisionConfirmationTypes } from "../../Course/enums/DecisionConfirmationTypes.enum";
import { FileTypes } from "../enums/FileTypes.enum";
import { PhaseEndResult } from "../enums/PhaseEndResult.enum";

interface IDecisionOption {
	option: string;
	phaseId: number;
}

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

export type ISpoilerContent = {
	content: string;
	title: string;
};

export type CourseScenario = {
	scenarioName: string;
	author: string;
	Content: Array<{
		id: number | null;
		phaseName: string;
		timeLimit?: number;
		confirmationRequired: DecisionConfirmationTypes;
		phaseEndText?: string;
		phaseEndResult?: PhaseEndResult;
		timeLeftDecisionId: number;
		decisionName: string;
		spoilerContent?: ISpoilerContent;
		content: string;
		contentType: FileTypes;
		autoplay?: boolean;
		decisionOptions: Array<IDecisionOption>;
		timeDelayedContent?: Array<IStageContentInfo>;
	}>;
	timeDelayedContent?: Array<IStageContentInfo>;

	/** 🔗 Optional: Kanten des Graphen (Verbindungen zwischen Phasen) */
	Edges?: Edge[];
};

export const EMPTY_COURSE_SCENARIO: CourseScenario = {
	scenarioName: "",
	author: "",
	Content: [
		{
			id: null,
			phaseName: "",
			confirmationRequired: DecisionConfirmationTypes.NONE,
			decisionName: "",
			phaseEndText: "",
			phaseEndResult: PhaseEndResult.Success,
			content: "",
			contentType: FileTypes.Text,
			autoplay: false,
			decisionOptions: [
				{
					option: "",
					phaseId: 0,
				},
			],
			timeLeftDecisionId: 0,
			timeDelayedContent: [],
		},
	],
	timeDelayedContent: [],
	Edges: [], // 🔗 Wichtig: Leere Kanten-Liste für initiales Szenario
};
