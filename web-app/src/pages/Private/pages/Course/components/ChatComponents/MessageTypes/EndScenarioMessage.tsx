import { faFlag } from "@fortawesome/pro-regular-svg-icons";

import { useTranslation } from "react-i18next";

import { Icon } from "@/components";
import { Button } from "@/components/Button/Button";
import { ButtonColor, ButtonSize, FontSize } from "@/components/Button/types";
import { formatTimestamp } from "@/utils/formatTimestamp";

import { useSocket } from "../../../context/SocketContext";
import { ScenarioActionTypes } from "../../../enums/ScenarioActionTypes.enum";

interface IEndScenarioMessageProps {
	timestamp: number;
}

export default function EndScenarioMessage({ timestamp }: IEndScenarioMessageProps) {
	const { t } = useTranslation();
	const ts = (key: string) => t(`courses.${key}`);
	const { isCurrentUserERR, sendScenarioAction } = useSocket();

	const onClickFinishScenario = () => {
		if (isCurrentUserERR) {
			sendScenarioAction(ScenarioActionTypes.FINISH_SCENARIO, {});
		}
	};

	return (
		<>
			{isCurrentUserERR ? (
				<div className="my-6 pr-32">
					<div className="flex justify-between px-1">
						<p className="text-[0.875rem] text-primary-gray font-medium">
							{ts("progress.end-session")}
						</p>
						<p className="text-[0.75rem] text-primary-gray-lighter">{formatTimestamp(timestamp)}</p>
					</div>
					<Button
						color={ButtonColor.DECISION}
						disabled={!isCurrentUserERR}
						fontSize={FontSize.M}
						image={
							<div className="mr-2 flex items-center justify-center">
								<Icon className="w-4 h-4" icon={faFlag} />
							</div>
						}
						size={ButtonSize.L}
						testId="new-user-button"
						title={ts("progress.complete")}
						onClick={onClickFinishScenario}
					/>
				</div>
			) : (
				<></>
			)}
		</>
	);
}
