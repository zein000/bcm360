/* eslint-disable @typescript-eslint/no-explicit-any */
import { RadioGroup } from "@mui/material";

import { faCheck } from "@fortawesome/pro-regular-svg-icons";

import { useTranslation } from "react-i18next";

import { Icon } from "@/components";
import { Button } from "@/components/Button/Button";
import { ButtonColor, ButtonSize } from "@/components/Button/types";
import { formatTimestamp } from "@/utils/formatTimestamp";

import { PermissionRoles } from "@/enum";

import { useSocket } from "../../../context/SocketContext";
import { DecisionConfirmationTypes } from "../../../enums/DecisionConfirmationTypes.enum";
import { ScenarioActionTypes } from "../../../enums/ScenarioActionTypes.enum";
import { ScenarioMessageTypes } from "../../../enums/ScenarioMessageTypes.enum";
import { IDecisionInfo, IDecisionOption } from "../../../interfaces/IDecisionInfo.interface";

interface IChatDecision {
	messageId: string;
	decisionInfo: IDecisionInfo;
	timestamp: number;
	onActionClick: (type: ScenarioMessageTypes, messageId: string, data: unknown) => void;
	currentPhaseId: number;
	isLastPhase: boolean;
}

export default function ChatDecision({
	decisionInfo,
	onActionClick,
	messageId,
	timestamp,
	currentPhaseId,
	isLastPhase,
}: IChatDecision) {
	const { t } = useTranslation();
	const { currentUserData, errInfo, sendScenarioAction } = useSocket();
	const ts = (key: string) => t(`courses.${key}`);
	const currentUserId = currentUserData?.id ?? -1;
	const isResponsibleForEmergency = errInfo?.id === currentUserId;
	let isShowNextPhase = false;
	const isHasWriterPermission = !!currentUserData?.role?.permissions?.find(
		(permission) => permission?.code === PermissionRoles.PROTOCOL_WRITER
	);

	const handleOptionChange = (selectedOption: IDecisionOption) => {
		if (typeof currentUserId !== "number" || currentUserId < 0) {
			console.error("Ungültige Benutzer-ID, Stimme wird nicht gezählt:", currentUserId);

			return;
		}

		if (
			(decisionInfo.confirmationRequired === DecisionConfirmationTypes.FROM_LEADER &&
				!isResponsibleForEmergency) ||
			decisionInfo?.finalDecision ||
			!isHasWriterPermission
		) {
			return;
		}

		if (selectedOption.userVotedIds.some((userId) => userId === currentUserId)) {
			return;
		}

		const updatedOptions = decisionInfo.decisionOptions.map((option) => {
			if (option.option === selectedOption.option) {
				return {
					...option,
					userVotedIds: [...option?.userVotedIds, currentUserId],
				};
			}

			return {
				...option,
				userVotedIds: option?.userVotedIds?.filter((userId) => userId !== currentUserId),
			};
		});

		onActionClick(ScenarioMessageTypes.DECISION, messageId, {
			...decisionInfo,
			decisionOptions: updatedOptions,
		});
	};

	// if err vote for something
	if (
		decisionInfo?.confirmationRequired === DecisionConfirmationTypes.FROM_LEADER &&
		decisionInfo.decisionOptions?.some(
			(item) => item.userVotedIds.includes(currentUserId) && item.phaseId !== currentPhaseId
		) &&
		isResponsibleForEmergency
	) {
		isShowNextPhase = true;
		// if someone vote for something
	} else if (decisionInfo?.confirmationRequired === DecisionConfirmationTypes.FROM_ALL) {
		const maxVotes = Math.max(
			...decisionInfo.decisionOptions.map((item) => item.userVotedIds.length)
		);
		const optionsWithMaxVotes = decisionInfo.decisionOptions.filter(
			(item) => item.userVotedIds.length === maxVotes
		);

		isShowNextPhase =
			maxVotes > 0 &&
			optionsWithMaxVotes.length === 1 &&
			optionsWithMaxVotes.some((item) => item.phaseId !== currentPhaseId);
	}

	const onNextPhaseClick = () => {
		let finalDecision: IDecisionOption | null = null;

		if (decisionInfo?.confirmationRequired === DecisionConfirmationTypes.FROM_LEADER) {
			const votedByErr = decisionInfo.decisionOptions?.find((item) =>
				item.userVotedIds.includes(currentUserId)
			);

			if (votedByErr) {
				finalDecision = votedByErr;
			}
		} else if (decisionInfo?.confirmationRequired === DecisionConfirmationTypes.FROM_ALL) {
			const maxVotes = Math.max(
				...decisionInfo.decisionOptions.map((item) => item.userVotedIds.length)
			);
			const optionsWithMaxVotes = decisionInfo.decisionOptions.filter(
				(item) => item.userVotedIds.length === maxVotes
			);

			if (maxVotes > 0 && optionsWithMaxVotes.length === 1) {
				finalDecision = optionsWithMaxVotes[0];
			}
		} else if (decisionInfo?.confirmationRequired === DecisionConfirmationTypes.NONE) {
			const decision = decisionInfo.decisionOptions?.[0];

			if (decision) {
				finalDecision = decision;
			}
		}

		if (finalDecision) {
			onActionClick(ScenarioMessageTypes.DECISION, messageId, {
				...decisionInfo,
				finalDecision,
			});
			if (!isLastPhase) {
				sendScenarioAction(ScenarioActionTypes.NEW_STAGE, {
					nextStageId: finalDecision.phaseId,
				});
			}
		}
	};

	const generalVotesLength = decisionInfo.decisionOptions.reduce(
		(acc, item) => acc + item.userVotedIds.length,
		0
	);

	const nextPhaseButtonTitle =
		decisionInfo?.confirmationRequired === DecisionConfirmationTypes.NONE
			? decisionInfo?.decisionOptions?.[0]?.option ?? ts("progress.next")
			: ts("progress.confirm");

	if (
		decisionInfo?.confirmationRequired === DecisionConfirmationTypes.NONE &&
		!!decisionInfo?.finalDecision?.option
	) {
		return <></>;
	}

	return (
		<div className={`mt-2 space-y-2 ${decisionInfo?.finalDecision ? "pr-32" : ""}`}>
			{decisionInfo?.confirmationRequired === DecisionConfirmationTypes.NONE &&
			!isResponsibleForEmergency ? (
				<></>
			) : (
				<div className="flex justify-between px-1">
					<p className="text-[0.875rem] text-primary-gray font-medium">{decisionInfo.name}</p>
					<p
						className={`text-[0.75rem] text-primary-gray-lighter ${
							decisionInfo?.finalDecision ? "" : "pr-32"
						}`}
					>
						{formatTimestamp(timestamp)}
					</p>
				</div>
			)}
			{decisionInfo?.confirmationRequired !== DecisionConfirmationTypes.NONE && (
				<RadioGroup className="space-y-[6px]">
					{decisionInfo?.decisionOptions
						.filter((optionData) =>
							decisionInfo?.finalDecision
								? decisionInfo?.finalDecision?.option === optionData.option
								: true
						)
						.map((option, index) => {
							const isSelected = decisionInfo?.finalDecision
								? false
								: option?.userVotedIds?.includes(currentUserId) ||
								  (decisionInfo.confirmationRequired === DecisionConfirmationTypes.FROM_LEADER &&
										option?.userVotedIds?.includes(errInfo?.id ?? -1));

							const votedPercent =
								+((option?.userVotedIds?.length ?? 0) / (generalVotesLength || 1)).toFixed(2) * 100;

							return (
								<div key={index} className="flex w-full gap-3 items-center">
									<div
										className={`shadow-[0px_1px_2px_0px_#1C274C1F] bg-white flex-1 text-primary-gray px-[14px] py-[10px] rounded-lg flex justify-between items-center ${
											isSelected && "border-[1px] border-[#4E5BA6]"
										}`}
										onClick={() => handleOptionChange(option)}
									>
										<p className={`text-[14px] text-primary-gray`}>
											<span className="font-semibold">
												Option {decisionInfo?.finalDecision ? "" : index + 1}:{" "}
											</span>{" "}
											{option.option}
										</p>
										{decisionInfo?.finalDecision ? (
											<></>
										) : isSelected ? (
											<p className="w-5 h-5 min-w-5 rounded-full flex items-center justify-center bg-primary-green">
												<Icon className="text-white w-[14px] h-[14px]" icon={faCheck} />
											</p>
										) : (
											<p className="w-5 h-5 min-w-5 rounded-full bg-white border-[1px] border-[#D0D5DD]"></p>
										)}
									</div>
									{decisionInfo?.finalDecision ? (
										<></>
									) : decisionInfo.confirmationRequired === DecisionConfirmationTypes.FROM_ALL ? (
										<div className="flex items-center justify-center gap-1 w-20 mr-8 px-[10px] border-[1px] h-7 border-[#E6E6EC] rounded-[50px]">
											<span className="bg-primary-blue w-1 h-1 rounded-full"></span>
											<p className="text-primary-gray text-[12px] font-semibold flex items-center justify-center shadow-[0px_1px_2px_0px_#1C274C1F] backdrop-blur-[20px]">
												{option?.userVotedIds?.length ?? 0}{" "}
												<span className="ml-[2px] text-[12px]">({votedPercent}%)</span>
											</p>
										</div>
									) : (
										<p className="pr-[120px]" />
									)}
								</div>
							);
						})}
				</RadioGroup>
			)}

			{isResponsibleForEmergency &&
				(decisionInfo?.confirmationRequired === DecisionConfirmationTypes.NONE ||
					(isShowNextPhase && !decisionInfo?.finalDecision)) && (
					<Button
						className={`h-[44px] !py-3 ${
							decisionInfo?.confirmationRequired === DecisionConfirmationTypes.NONE
								? "!w-[calc(100%-128px)]"
								: "!w-fit !max-w-[40vw]"
						} mt-[6px] !font-medium !text-wrap`}
						color={ButtonColor.DECISION}
						disabled={
							decisionInfo?.confirmationRequired === DecisionConfirmationTypes.NONE &&
							!!decisionInfo?.finalDecision?.option
						}
						image={
							<p className="mr-2 w-4 h-4 rounded-full flex items-center justify-center border-[1.25px] border-[#fff]">
								<Icon className="text-[#fff] w-[8px] h-[8px]" icon={faCheck} />
							</p>
						}
						size={ButtonSize.ML}
						testId="new-user-button"
						title={nextPhaseButtonTitle}
						onClick={onNextPhaseClick}
					/>
				)}
		</div>
	);
}
