/* eslint-disable @typescript-eslint/no-explicit-any */
import { Typography } from "@mui/material";

import {
	faArrowDownLeftAndArrowUpRightToCenter,
	faArrowUpRightAndArrowDownLeftFromCenter,
	faLightbulb,
} from "@fortawesome/pro-regular-svg-icons";

import { Dispatch, SetStateAction } from "react";

import { useTranslation } from "react-i18next";

import { Icon } from "@/components";

import { Button } from "@/components/Button/Button";

import { PermissionRoles } from "@/enum";

import { useSocket } from "../context/SocketContext";
import { ScenarioMessageTypes } from "../enums/ScenarioMessageTypes.enum";
import Chat from "./ChatComponents/Chat";

interface IProtocolProps {
	isExpandedProtocolOpen: boolean;
	setIsExpandedProtocolOpen: Dispatch<SetStateAction<boolean>>;
	currentPhaseId: number;
	isLastPhase: boolean;
	chatPermissions?: PermissionRoles[];
	handleOpenSpoilerModal?: () => void;
}

export default function Protocol({
	isExpandedProtocolOpen,
	setIsExpandedProtocolOpen,
	currentPhaseId,
	isLastPhase,
	chatPermissions,
	handleOpenSpoilerModal,
}: IProtocolProps) {
	const { protocolMessages, sendProtocolMessage, updateProtocolMessage } = useSocket();
	const { t } = useTranslation();
	const ts = (key: string) => t(`courses.${key}`);

	return (
		<div
			className={`flex flex-col border border-[#E6E6EC] rounded-[20px] ${
				isExpandedProtocolOpen ? "min-h-[67%] max-h-[67%]" : "min-h-[37%] max-h-[37%]"
			}`}
		>
			<div className="flex justify-between items-center p-2 border-b-[1px] h-[60px] pl-4 border-[#EAECF0]">
				<Typography
					gutterBottom
					sx={{ fontWeight: "600", fontSize: "24px", color: "#101828", mb: "0px" }}
					variant="h4"
				>
					{ts("progress.protocol")}
				</Typography>
				<div className="space-x-2">
					{handleOpenSpoilerModal && (
						<Button
							className="bg-white !w-[44px] !h-[44px] !p-0 !border !border-[#E6E6EC]"
							image={<Icon className="text-primary-blue w-5 h-5" icon={faLightbulb} />}
							title=""
							onClick={() => handleOpenSpoilerModal()}
						/>
					)}
					<Button
						className="bg-white !w-[44px] !h-[44px] !p-0 !border !border-[#E6E6EC]"
						image={
							<Icon
								className="text-primary-blue w-5 h-5"
								icon={
									isExpandedProtocolOpen
										? faArrowDownLeftAndArrowUpRightToCenter
										: faArrowUpRightAndArrowDownLeftFromCenter
								}
							/>
						}
						title=""
						onClick={() => setIsExpandedProtocolOpen((prev) => !prev)}
					/>
				</div>
			</div>
			<div className={`flex-1 flex flex-col w-full gap-4 h-[calc(100%-60px)]`}>
				<Chat
					isProtocol
					chatPermissions={chatPermissions}
					currentPhaseId={currentPhaseId}
					handleAction={updateProtocolMessage}
					isLastPhase={isLastPhase}
					messages={protocolMessages}
					sendMessage={(message) => sendProtocolMessage(ScenarioMessageTypes.MESSAGE, { message })}
				/>
			</div>
		</div>
	);
}
