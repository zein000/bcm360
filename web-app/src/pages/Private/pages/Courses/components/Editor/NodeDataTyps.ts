import { Node } from "@xyflow/react";
import { TFunction } from "i18next"; // Import TFunction
import { DecisionConfirmationTypes } from "@/pages/Private/pages/Course/enums/DecisionConfirmationTypes.enum"; // Pfad ggf. anpassen
import { FileTypes } from "@/pages/Private/pages/Courses/enums/FileTypes.enum";
import { PhaseEndResult } from "@/pages/Private/pages/Courses/enums/PhaseEndResult.enum"; // Pfad ggf. anpassen

// XYPosition definieren und exportieren, damit es überall konsistent genutzt werden kann
export type XYPosition = {
	x: number;
	y: number;
};

interface IDecisionOption {
	option: string;
	phaseId: number | null; // Phase ID darf nicht null sein
	position?: XYPosition; // XYPosition hier verwenden
}

export type PhaseData = {
	id: number;
	content: string;
	autoplay?: boolean;
	phaseName: string;
	contentType: FileTypes;
	timeLimit?: number;
	decisionName?: string;
	decisionOptions?: IDecisionOption[];
	spoilerContent?: {
		title: string;
		content: string;
	};
	timeDelayedContent?: {
		title: string;
		content: string;
		autoplay?: boolean;
		contentType: FileTypes;
		startTimeInSeconds: number;
		endTimeInSeconds: number;
	}[];
	timeLeftDecisionId?: number;
	confirmationRequired?: DecisionConfirmationTypes;
	phaseEndText?: string;
	phaseEndResult: PhaseEndResult;

	// Position ist hier **nicht optional**
	position: XYPosition;
};

// Typ für einen Node, der PhaseData nutzt
export type PhaseNodeData = Node<PhaseData, "phaseNode">;

// Modify createDefaultPhaseData to accept the t function
export function createDefaultPhaseData(
	t: TFunction, // Add t function as a parameter
	overrides: Partial<PhaseData> = {}
): PhaseData {
	return {
		id: 0,
		content: t("editor.newContent"),
		phaseName: t("editor.newPhase"),
		contentType: FileTypes.Text,
		autoplay: false,
		decisionName: undefined,
		decisionOptions: undefined,
		confirmationRequired: undefined,
		timeLeftDecisionId: undefined,
		timeDelayedContent: [],
		phaseEndText: "",
		phaseEndResult: PhaseEndResult.Success,
		// Default-Position, damit neue Nodes nicht übereinanderliegen
		position: { x: 100, y: 100 },
		...overrides,
	};
}
