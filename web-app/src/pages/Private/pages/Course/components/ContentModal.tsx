import { useCallback, useEffect, useMemo, useRef } from "react";
import { useTranslation } from "react-i18next";

import Markdown from "react-markdown";
import rehypeRaw from "rehype-raw";

import { Modal } from "@/components";

import { isValidUrl } from "@/utils/isValidUrl";

import { ButtonColor } from "@/components/Button/types";

import { IStageContentInfo } from "../../Courses/constants/emptyCourseScenario";
import { FileTypes } from "../../Courses/enums/FileTypes.enum";

interface IContentModal {
	setCurrentContentInfo: (state: IStageContentInfo | null) => void;
	contentInfo: IStageContentInfo | null;
}

export default function ContentModal({ contentInfo, setCurrentContentInfo }: IContentModal) {
	const { t } = useTranslation();
	const ts = useCallback((key: string) => t(`courses.progress.${key}`), [t]);

	const contentRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (!contentInfo?.autoplay) {
			return;
		}

		requestAnimationFrame(() => {
			if (!contentRef.current) {
				return;
			}

			const mediaElements = contentRef.current.querySelectorAll("audio, video");

			mediaElements.forEach((media) => {
				(media as HTMLMediaElement).play().catch((err) => console.log("Autoplay error:", err));
			});
		});
	}, [contentInfo]);

	const title = useMemo(() => {
		if (!contentInfo) {
			return ts("no-content-available");
		}

		if (contentInfo?.title) {
			return contentInfo?.title;
		}

		switch (contentInfo.contentType?.toUpperCase()) {
			case FileTypes.Text:
				return contentInfo.content?.split("\n")[0]?.slice(0, 40) || ts("no-content-available");
			case FileTypes.Audio:
			case FileTypes.Video:
			case FileTypes.Image:
				return contentInfo.content?.split("/")?.pop()?.replace(/^\d+-/, "") ?? "";
			default:
				return ts("unknown-content");
		}
	}, [contentInfo, ts]);

	const renderContent = () => {
		if (!contentInfo) {
			return null;
		}

		// Falls kein gültiger URL, rendern wir keinen JSX-Content, sondern den Text nur direkt via Markdown
		if (!isValidUrl(contentInfo.content)) {
			return null; // In dem Fall rendern wir im JSX unten direkt <Markdown>{contentInfo.content}</Markdown>
		}

		switch (contentInfo.contentType?.toUpperCase()) {
			case FileTypes.Image:
				return (
					<img
						alt="Content"
						className="block mx-auto w-full h-full max-w-screen-w max-h-[80vh] object-contain"
						src={contentInfo.content}
					/>
				);
			case FileTypes.Video:
				return (
					<video
						autoPlay
						controls
						className="block mx-auto w-full h-full max-w-screen-w max-h-[80vh] object-contain"
					>
						<source src={contentInfo.content} type="video/mp4" />
						{t("basics.not-support-tag")}
					</video>
				);
			case FileTypes.Audio:
				return (
					<audio autoPlay controls className="block mx-auto w-full max-w-xl">
						<source src={contentInfo.content} type="audio/mpeg" />
						{t("basics.not-support-tag")}
					</audio>
				);
			default:
				return <p>{ts("unsupported-content-type")}</p>;
		}
	};

	const size = useMemo(() => {
		switch (contentInfo?.contentType?.toUpperCase()) {
			case FileTypes.Image:
				return "lg";
			case FileTypes.Audio:
				return "xs";
			case FileTypes.Video:
				return "lg";
			case FileTypes.Spoiler:
				return "xs";
			default:
				return "xs";
		}
	}, [contentInfo]);

	return (
		<Modal
			dialogContentClassName="!px-4 max-h-[80vh] overflow-auto mr-1 custom-scrollbar"
			handleSave={() => setCurrentContentInfo(null)}
			isLoading={false}
			isOpened={!!contentInfo}
			saveButtonContainerClassName="!w-full"
			showActions={contentInfo?.contentType === FileTypes.Spoiler}
			size={size}
			submitButtonColor={ButtonColor.ACTION}
			submitButtonText={ts("i-see")}
			title={""}
		>
			<div ref={contentRef} className="flex flex-col">
				<div className="flex-grow w-full mb-4 flex justify-between">
					<h3 className="mb-1">{title}</h3>
				</div>

				{/* Hier wenn content kein valider URL ist, geben wir reinen Text an Markdown weiter */}
				{contentInfo?.content && !isValidUrl(contentInfo.content) ? (
					<Markdown key={contentInfo.content} rehypePlugins={[rehypeRaw]}>
						{contentInfo.content}
					</Markdown>
				) : (
					<div className="flex-1 flex items-center justify-center">{renderContent()}</div>
				)}
			</div>
		</Modal>
	);
}
