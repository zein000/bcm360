import { DecisionConfirmationTypes } from "../enums/DecisionConfirmationTypes.enum";

export interface IDecisionOption {
	option: string;
	phaseId: number;
	userVotedIds: number[];
}

export interface IDecisionInfo {
	name: string;
	decisionOptions: IDecisionOption[];
	confirmationRequired: DecisionConfirmationTypes;
	finalDecision?: IDecisionOption;
}
