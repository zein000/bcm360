import { faPaperPlane } from "@fortawesome/pro-regular-svg-icons";
import { ChangeEvent, useState } from "react";
import { useTranslation } from "react-i18next";

import { ButtonColor } from "@/components/Button/types";
import { Button } from "@/components/Button/Button";
import { Icon, PermissionCheck } from "@/components";
import { PermissionRoles } from "@/enum";

interface ChatInputFieldProps {
	sendMessage: (message: string) => void;
	chatInputClassName?: string;
	chatPermissions?: PermissionRoles[];
	isProtocol?: boolean;
}

export default function ChatInputField({
	sendMessage,
	chatInputClassName,
	chatPermissions,
	isProtocol = false,
}: ChatInputFieldProps) {
	const { t } = useTranslation();
	const ts = (key: string) => t(`courses.progress.${key}`);

	const [errorMessage, setErrorMessage] = useState("");
	const [message, setMessage] = useState("");
	const handleMessageSend = () => {
		if (message && message?.length) {
			sendMessage(message);
			setErrorMessage("");
			setMessage("");
		} else {
			setErrorMessage(ts("cant-sent-empty"));
		}
	};

	const onMessageInput = (event: ChangeEvent<{ value: string }>) => {
		if (event?.target?.value) {
			if (errorMessage) {
				setErrorMessage("");
			}
		}

		setMessage(event.target.value);
	};

	const onKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
		if (event.key === "Enter") {
			event.preventDefault();
			handleMessageSend();
		}
	};

	return (
		<PermissionCheck
			requiredPermissions={chatPermissions && chatPermissions?.length ? chatPermissions : []}
		>
			<div className={`flex relative w-full ${chatInputClassName}`}>
				<input
					className="text-[14px] h-[60px] text-primary-gray p-5 !pr-[120px] rounded-[16px] w-full shadow-[0px_1px_2px_0px_rgba(28,39,76,0.12)] placeholder:text-primary-gray-lighter ring-0 outline-none"
					placeholder={isProtocol ? ts("type-a-new-message-protocol") : ts("type-a-new-message")}
					type="text"
					value={message}
					onChange={onMessageInput}
					onKeyDown={onKeyPress}
				/>
				<Button
					className="h-[50px] !w-fit absolute right-2 top-1/2 -translate-y-1/2 rounded-xl"
					color={ButtonColor.ACTION}
					image={<Icon className="mr-2 w-4 h-4" icon={faPaperPlane} />}
					title={isProtocol ? ts("send-protocol") : ts("send")}
					onClick={() => {
						handleMessageSend();
					}}
				></Button>
			</div>
		</PermissionCheck>
	);
}
