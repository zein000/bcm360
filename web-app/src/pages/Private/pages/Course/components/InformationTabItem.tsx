import { useTranslation } from "react-i18next";

import { MutableRefObject, useCallback, useMemo } from "react";

import { formatTimestamp } from "@/utils/formatTimestamp";

import { isValidUrl } from "@/utils/isValidUrl";

import { truncateText } from "@/utils/truncateText";

import FilesIcon from "../../Courses/components/FilesIcon";
import { IStageContentInfo } from "../../Courses/constants/emptyCourseScenario";
import { FileTypes } from "../../Courses/enums/FileTypes.enum";
import CourseTag from "../../Courses/components/CourseList/CourseTag";

interface InformationTabProps {
	info: IStageContentInfo;
	setCurrentShowingContentId: (indx: string) => void;
	setCurrentShowingContentInfo: (info: IStageContentInfo | null) => void;
	alreadyHasOpenedContentIds: MutableRefObject<string[]>

}

export default function InformationTabItem({
	setCurrentShowingContentId,
	setCurrentShowingContentInfo,
	info,
}: InformationTabProps) {
	const { t } = useTranslation();
	const ts = useCallback((key: string) => t(`courses.progress.${key}`), [t]);

	const onItemClickHandler = () => {
		if (info.contentType?.toUpperCase() === FileTypes.Spoiler) {
			setCurrentShowingContentInfo(info);
		} else if (info.autoplay) {
			setCurrentShowingContentInfo(info);
		} else {
			setCurrentShowingContentId(info.id ?? "");
		}
	};





	const description = useMemo(() => {
		switch (info.contentType?.toUpperCase()) {
			case FileTypes.Text:
				return info?.content
					? truncateText(info?.content, 235).replace(/\n/g, " ")
					: ts("no-content-available");
			default:
				switch (info.contentType?.toUpperCase()) {
					case FileTypes.Text:
						return info?.content
							? truncateText(info?.content, 235).replace(/\n/g, " ")
							: ts("no-content-available");
					case FileTypes.Audio:
					case FileTypes.Video:
					case FileTypes.Image:
						return info?.content?.split("/")?.pop()?.replace(/^\d+-/, "") ?? "";
					case FileTypes.Spoiler:
						return "";
					default:
						return ts("unknown-content");
				}

		}
	}, [info, ts]);

	return (
		<button
			key={info.id}
			className={`w-full bg-[#F7F8FB] border border-[#E6E6EC] p-1 pt-4 flex flex-col gap-[10px] rounded-16`}
			onClick={onItemClickHandler}
		>
			<div className="flex justify-between items-center gap-[6px] px-3">
				<p className="text-[12px] text-primary-gray-lighter font-medium">
					{info?.contentType?.toUpperCase() === FileTypes.Spoiler
						? ts("spoiler")
						: ts("information")}
				</p>
				<span className="bg-[#626373] w-1 h-1 rounded-full" />
				<p className="text-[0.75rem] text-primary-gray-lighter">
					{formatTimestamp(info.timeStamp ?? 0)}
				</p>
			</div>
			<div className={`flex flex-col gap-2 bg-white rounded-xl p-4 w-full`}>
				<div className="flex flex-col items-start gap-[6px] justify-center">
					<div className="flex w-full gap-[6px] items-center">
						<FilesIcon
							containerClassNames="!w-[25px] !h-[25px] shadow-sm border-[0.28px] border-[#E6E6EC] rounded-md"
							fileType={info.contentType}
							iconSizeClassNames="w-[15px] h-[15px]"
						/>
						<CourseTag
							className="w-fit !h-fit !py-[0.5px]"
							tag={`${ts("phase")} ${info?.stageNumber}`}
						/>
					</div>
					{info?.title && (
						<p className={`text-left text-[14px] text-primary-gray font-semibold`}>
							{info?.title ?? ts("information")}
						</p>
					)}
				</div>
				{description?.length ? (
					<div className="flex flex-col justify-start items-start">
						<p className={`text-[12px] text-primary-gray-lighter text-left`}>{description}</p>
					</div>
				) : (
					<></>
				)}
			</div>
		</button>
	);
}
