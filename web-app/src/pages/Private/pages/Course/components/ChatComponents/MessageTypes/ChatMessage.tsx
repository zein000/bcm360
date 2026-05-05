import { useTranslation } from "react-i18next";

import { useAppSelector } from "@/redux/hooks";

import { formatTimestamp } from "@/utils/formatTimestamp";

import UserIcon from "../../UserIcon";
import { ScenarioMessageInfo } from "../../../interfaces/ScenarioMessageInfo.interface";

interface IChatMessageProps {
	messageInfo: ScenarioMessageInfo;
	isStacked: boolean;
	isProtocol: boolean;
}

export default function ChatMessage({
	messageInfo,
	isStacked,
	isProtocol = false,
}: IChatMessageProps) {
	const { t, i18n } = useTranslation();
	const ts = (key: string, options = {}) => t(`courses.progress.${key}`, options);
	const user = useAppSelector((state) => state.auth?.user);
	const isMyOwnMessage =
		messageInfo.data?.userId === user?.id || messageInfo.data?.email === user?.email;

	const messageContainerStyles = isMyOwnMessage
		? "bg-primary-blue text-white"
		: "bg-white text-primary-gray border-[#EAECF0] border-[1px]";
	const borderRadiusStyles = isMyOwnMessage
		? "rounded-tl-xl rounded-br-xl rounded-bl-xl"
		: "rounded-tr-xl rounded-br-xl rounded-bl-xl";
	const messageTextColor = isMyOwnMessage ? "text-white " : "text-primary-gray";

	return (
		<div
			key={messageInfo.data?.id}
			className={`w-full ${isMyOwnMessage ? "space-y-[6px]" : "flex gap-3"} ${
				isProtocol && isMyOwnMessage
					? "pl-14 pr-32"
					: isProtocol
					? "pr-32"
					: isMyOwnMessage
					? "pl-14"
					: ""
			} ${!isStacked ? "mt-4" : "mt-1"} ${
				isProtocol
					? ""
					: isMyOwnMessage
					? "ml-auto !min-w-[150px] !w-fit !max-w-[100%]"
					: "!min-w-[150px] !w-fit mr-auto !max-w-[80%]"
			}`}
		>
			{!isMyOwnMessage && (
				<UserIcon
					containerClassName="!rounded-full"
					firstName={messageInfo.data?.firstName}
					isHidden={isStacked}
					lastName={messageInfo.data?.lastName}
				/>
			)}
			<div className={`flex-1 w-full ${isStacked ? "space-y-[2px]" : "space-y-[6px]"}`}>
				{!isStacked && (
					<div className="flex justify-between px-1 gap-2">
						<p className="text-[0.875rem] text-primary-gray font-medium">
							{isMyOwnMessage
								? ts("you")
								: messageInfo.data?.firstName + " " + messageInfo.data?.lastName}
						</p>
						<p className="text-[0.75rem] text-primary-gray-lighter">
							{formatTimestamp(messageInfo.timestamp)}
						</p>
					</div>
				)}
				<div
					className={`${messageContainerStyles} overflow-hidden px-[14px] py-[10px] ${borderRadiusStyles}`}
				>
					<p
						className={`text-[1rem] w-full text-wrap overflow-hidden text-ellipsis ${messageTextColor}`}
					>
						{i18n.exists(`courses.progress.${messageInfo.data?.message}`)
							? ts(messageInfo.data?.message, messageInfo.data?.options)
							: messageInfo.data?.message}
					</p>
				</div>
			</div>
		</div>
	);
}
