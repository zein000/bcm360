import { faLightbulb } from "@fortawesome/pro-solid-svg-icons";

import { useTranslation } from "react-i18next";

import { useSelector } from "react-redux";

import { Icon, Modal } from "@/components";

import { authSelector } from "@/pages/Public/redux/auth.slice";

import { ScenarioActionTypes } from "../enums/ScenarioActionTypes.enum";

interface ISpoilerModal {
	isShowSpoiler: boolean;
	setIsShowSpoiler: (state: boolean) => void;
	sendScenarioAction: (type: ScenarioActionTypes, data: unknown) => void;
}

export default function SpoilerModal({
	isShowSpoiler,
	setIsShowSpoiler,
	sendScenarioAction,
}: ISpoilerModal) {
	const { t } = useTranslation();
	const ts = (key: string) => t(`courses.progress.${key}`);
	const authState = useSelector(authSelector);
	const onShowSpoilerClick = () => {
		if (authState?.user?.email) {
			sendScenarioAction(ScenarioActionTypes.SHOW_SPOILER, {
				requesterEmail: authState.user.email,
			});
			setIsShowSpoiler(false);
		}
	};

	return (
		<Modal
			aboveHeader={
				<div
					className="flex justify-center items-center rounded-xl border border-blue-100 text-gray-700 cursor-pointer pointer-events-auto"
					style={{
						width: "44px",
						height: "44px",
						boxShadow: "0px 1.38px 2.75px 0px rgba(16, 24, 40, 0.06)",
					}}
				>
					<Icon className="w-[20px] h-[20px]" icon={faLightbulb} />
				</div>
			}
			cancelButtonText={ts("no")}
			dialogContentClassName="!p-0 max-h-[80vh] overflow-auto mr-1 custom-scrollbar"
			handleClose={() => setIsShowSpoiler(false)}
			handleSave={onShowSpoilerClick}
			isLoading={false}
			isOpened={isShowSpoiler}
			size="xs"
			submitButtonText={ts("yes")}
			title={""}
		>
			<div className="flex-grow w-full mt-3">
				<h3 className="mb-1">{ts("sure-want-to-view-title")}</h3>
				<p className="text-primary-gray-lighter lg:max-w-[650px] text-xs pr-5">
					{ts("sure-want-to-view-description")}
				</p>
			</div>
		</Modal>
	);
}
