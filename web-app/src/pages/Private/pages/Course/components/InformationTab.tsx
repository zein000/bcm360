import { Dispatch, MutableRefObject, SetStateAction, useEffect, useRef, useState } from "react";

import { useTranslation } from "react-i18next";

import { faArrowUp } from "@fortawesome/pro-regular-svg-icons";

import { Button } from "@/components/Button/Button";

import { ButtonColor } from "@/components/Button/types";

import { Icon } from "@/components";

import { debounce } from "@/utils/debounce";

import { IStageContentInfo } from "../../Courses/constants/emptyCourseScenario";
import BlockTitle from "./ChatComponents/BlockTitle";
import InformationTabItem from "./InformationTabItem";

interface InformationTabProps {
	stageContent: IStageContentInfo[];
	setCurrentShowingContentId: Dispatch<SetStateAction<string>>;
	alreadyHasOpenedContentIds: MutableRefObject<string[]>;
	setCurrentShowingContentInfo: (info: IStageContentInfo | null) => void;
	containerClassName?: string;
}

export default function InformationTab({
	stageContent,
	setCurrentShowingContentId,
	alreadyHasOpenedContentIds,
	setCurrentShowingContentInfo,
	containerClassName,
}: InformationTabProps) {
	const { t } = useTranslation();
	const ts = (key: string) => t(`courses.progress.${key}`);
	const informationContainerRef = useRef<HTMLDivElement>(null);
	const [showScrollButton, setShowScrollButton] = useState(false);

	useEffect(() => {
		if (!informationContainerRef.current) {
			return;
		}

		informationContainerRef.current.scrollTop = 0;
	}, [stageContent]);

	const handleScroll = debounce(() => {
		if (!informationContainerRef.current) {
			return;
		}

		const { scrollTop } = informationContainerRef.current;

		setShowScrollButton(scrollTop > 300);
	}, 100);

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const scrollToTop = (e: any) => {
		e?.stopPropagation();
		setShowScrollButton(false);
		informationContainerRef.current?.scrollTo({
			top: 0,
			behavior: "smooth",
		});
	};

	return (
		<div
			ref={informationContainerRef}
			className={`relative flex-1 flex flex-col rounded-b-[20px] overflow-auto custom-scrollbar items-center p-4 border-b-[1px] border-[#EAECF0] ${containerClassName}`}
			tabIndex={1}
			onScroll={handleScroll}
		>
			{stageContent?.length ? (
				<div className="flex flex-col gap-3 mt-auto w-full">
					{stageContent.map((info, indx) => (
						<InformationTabItem
							key={indx}
							alreadyHasOpenedContentIds={alreadyHasOpenedContentIds}
							info={info}
							setCurrentShowingContentId={setCurrentShowingContentId}
							setCurrentShowingContentInfo={setCurrentShowingContentInfo}
						/>
					))}
				</div>
			) : (
				<p className="flex-1 flex items-center justify-centers w-full">
					{<BlockTitle label={ts("no-messages-yet")} />}
				</p>
			)}
			{showScrollButton && (
				<Button
					className="sticky z-50 bottom-2 left-4 !p-1 !w-fit h-[25px] rounded-full -translate-x-1/2 transition"
					color={ButtonColor.ACTION_SECONDARY}
					image={<Icon className="w-4 h-4" icon={faArrowUp} />}
					title=""
					onClick={scrollToTop}
				></Button>
			)}
		</div>
	);
}
