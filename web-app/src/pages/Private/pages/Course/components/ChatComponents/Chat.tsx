/* eslint-disable @typescript-eslint/no-explicit-any */
import { faArrowDown } from "@fortawesome/pro-regular-svg-icons";
import { useEffect, useRef, useState } from "react";

import { Icon } from "@/components";
import { Button } from "@/components/Button/Button";

import { ButtonColor } from "@/components/Button/types";

import { debounce } from "@/utils/debounce";

import { PermissionRoles } from "@/enum";

import { ScenarioMessageTypes } from "../../enums/ScenarioMessageTypes.enum";
import { ScenarioMessageInfo } from "../../interfaces/ScenarioMessageInfo.interface";
import ChatInputField from "./ChatInputField";
import EmptyChat from "./EmptyChat";
import ChatDecision from "./MessageTypes/ChatDecision";
import ChatMessage from "./MessageTypes/ChatMessage";
import EndScenarioMessage from "./MessageTypes/EndScenarioMessage";
import ServiceMessage from "./MessageTypes/ServiceMessage";

interface IChatProps {
	handleAction?: (type: ScenarioMessageTypes, messageId: string, data: unknown) => void;
	sendMessage: (message: string) => void;
	messages: ScenarioMessageInfo[];
	chatBodyClassName?: string;
	chatInputClassName?: string;
	isProtocol?: boolean;
	currentPhaseId?: number;
	isLastPhase?: boolean;
	chatPermissions?: PermissionRoles[];
	chatContainerClassName?: string;
}

export default function Chat({
	messages,
	handleAction,
	sendMessage,
	chatBodyClassName,
	chatInputClassName,
	isProtocol = false,
	currentPhaseId,
	isLastPhase,
	chatPermissions,
	chatContainerClassName,
}: IChatProps) {
	const chatContainerRef = useRef<HTMLDivElement>(null);
	const previousMessageLength = useRef<number>(0);
	const [showScrollButton, setShowScrollButton] = useState(false);

	useEffect(() => {
		if (!chatContainerRef.current || previousMessageLength.current === messages.length) {
			return;
		}

		previousMessageLength.current = messages.length;
		chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
	}, [messages]);

	const handleScroll = debounce(() => {
		if (!chatContainerRef.current) {
			return;
		}

		const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;

		setShowScrollButton(scrollTop + clientHeight < scrollHeight - 500);
	}, 100);

	const scrollToBottom = () => {
		setShowScrollButton(false);
		chatContainerRef.current?.scrollTo({
			top: chatContainerRef.current.scrollHeight,
			behavior: "smooth",
		});
	};

	return (
		<div
			className={`flex flex-col h-full justify-between w-full relative gap-1 flex-1 bg-[#F7F8FB] overflow-y-auto p-2 rounded-b-[20px] ${
				chatContainerClassName ?? ""
			}`}
		>
			<div
				ref={chatContainerRef}
				className={`flex-1 w-full pb-2 flex flex-col overflow-y-auto custom-scrollbar items-center transition-all  ${chatBodyClassName}`}
				tabIndex={0}
				onScroll={handleScroll}
			>
				{messages?.length ? (
					<div className="px-4 flex flex-col mt-auto w-full flex-1">
						{/* {<BlockTitle label="Today" />} */}
						{messages?.map((messageInfo, indx) => {
							if (messageInfo.type === ScenarioMessageTypes.MESSAGE) {
								const isTheSameUser =
									indx !== 0 && messages[indx - 1].data?.userId === messageInfo?.data?.userId;
								const isLessThanOneMinute =
									indx !== 0 && messageInfo.timestamp - messages[indx - 1].timestamp < 60000;

								return (
									<ChatMessage
										key={messageInfo.id}
										isProtocol={isProtocol}
										isStacked={isTheSameUser && isLessThanOneMinute}
										messageInfo={messageInfo}
									/>
								);
							} else if (messageInfo.type === ScenarioMessageTypes.DECISION) {
								return (
									<ChatDecision
										key={indx}
										currentPhaseId={currentPhaseId ?? -1}
										decisionInfo={messageInfo.data}
										isLastPhase={!!isLastPhase}
										messageId={messageInfo.id}
										timestamp={messageInfo?.timestamp}
										onActionClick={handleAction ?? console.log}
									/>
								);
							} else if (messageInfo.type === ScenarioMessageTypes.END) {
								return <EndScenarioMessage key={indx} timestamp={messageInfo?.timestamp} />;
							} else if (messageInfo.type === ScenarioMessageTypes.SERVICE) {
								return (
									<ServiceMessage
										key={indx}
										data={messageInfo.data}
										timestamp={messageInfo.timestamp}
									/>
								);
							}
						})}
					</div>
				) : (
					<EmptyChat />
				)}
				{showScrollButton && (
					<Button
						className="!p-0 absolute top-1 left-1/2 !px-2 !w-fit h-[25px] rounded-full -translate-x-1/2 transition"
						color={ButtonColor.ACTION_SECONDARY}
						image={<Icon className="w-4 h-4" icon={faArrowDown} />}
						title=""
						onClick={scrollToBottom}
					></Button>
				)}
			</div>
			<ChatInputField
				chatInputClassName={chatInputClassName}
				chatPermissions={chatPermissions}
				isProtocol={isProtocol}
				sendMessage={sendMessage}
			/>
		</div>
	);
}
