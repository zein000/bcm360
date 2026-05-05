import { useTranslation } from "react-i18next";

import EmptyChatImage from "@/assets/images/empty-chat.png";

export default function EmptyChat() {
	const { t } = useTranslation();
	const ts = (key: string) => t(`courses.progress.${key}`);

	return (
		<div className="flex-1 flex flex-col items-center justify-center w-full gap-4">
			<img alt="empty chat" className="w-[7.5rem]" src={`${EmptyChatImage}`} />
			<p className="text-primary-gray text-[14px] font-semibold">{ts("no-messages-yet")}</p>
		</div>
	);
}
