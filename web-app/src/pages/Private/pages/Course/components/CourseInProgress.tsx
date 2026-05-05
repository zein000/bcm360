/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Typography } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";

import { faPlus, faVrCardboard } from "@fortawesome/pro-regular-svg-icons";

import { useEffect, useMemo, useRef, useState } from "react";

import { useTranslation } from "react-i18next";

import Markdown from "react-markdown";
import rehypeRaw from "rehype-raw";

import { Icon } from "@/components";
import { Button } from "@/components/Button/Button";

import { ButtonColor } from "@/components/Button/types";

import { useAppSelector } from "@/redux/hooks";

import { isValidUrl } from "@/utils/isValidUrl";

import { PermissionRoles } from "@/enum";

import { usePageTitle } from "@/utils/usePageTitle";

import { ROUTE_CONFIG } from "@/routes/config";

import { Tab, TabsContainer } from "@/components/Tabs/TabsContainer";

import { truncateText } from "@/utils/truncateText";

import CourseTag from "../../Courses/components/CourseList/CourseTag";
import {
	EMPTY_COURSE_SCENARIO,
	IStageContentInfo,
} from "../../Courses/constants/emptyCourseScenario";
import { FileTypes } from "../../Courses/enums/FileTypes.enum";
import { useSocket } from "../context/SocketContext";
import { CourseProgressResponse } from "../schema/course-progress";
import AddTeamModal from "./AddTeamModal";
import Breadcrumbs from "./Breadcrumbs";
import Chat from "./ChatComponents/Chat";
import ListConnectedUsers from "./ConnectedUsers/ListConnectedUsers";
import CountdownTimer from "./CountdownTimer";
import InformationTab from "./InformationTab";
import Protocol from "./Protocol";
import SpoilerModal from "./SpoilerModal";
import ShowPinModal from "@/pages/Private/pages/Course/components/ShowPinModal";

interface CourseInProgressProps {
	data?: CourseProgressResponse;
	setCurrentShowingContentInfo: (data: IStageContentInfo | null) => void;
}

export default function CourseInProgress({
	data,
	setCurrentShowingContentInfo,
}: CourseInProgressProps) {
	const { t } = useTranslation();
	const ts = (key: string) => t(`courses.progress.${key}`);

	usePageTitle(t("courses.title"));
	const { id } = useParams();
	const navigate = useNavigate();
	const [isExpandedProtocolOpen, setIsExpandedProtocolOpen] = useState(false);
	const [currentShowingContentId, setCurrentShowingContentId] = useState("");
	const [isSpoilerModalShown, setIsSpoilerModalShown] = useState(false);
	const [isShowPinModal, setIsShowPinModal] = useState(false);
	const [currentPin, setCurrentPin] = useState("");

	const currentUserId = useAppSelector((state) => state.auth?.user?.id ?? -1);
	const alreadyHasOpenedContentIds = useRef<string[]>([]);
	const {
		sendChatMessage,
		chatMessages,
		sendScenarioAction,
		getScenarioActualData,
		currentStage,
		currentStageEndTimestamp,
		stageContent,
	} = useSocket();
	const [isShowAddTeamModal, setIsShowAddTeamModal] = useState(false);

	useEffect(() => {
		console.log("⏱️ useEffect: stageContent changed");
		stageContent?.forEach((info) => {
			console.log("🔍 Checking autoplay condition for item:", info);

			if (
				info?.id &&
				info?.autoplay &&
				info?.timeStamp &&
				info?.timeStamp + 10000 > Date.now() &&
				!alreadyHasOpenedContentIds.current?.includes(info?.id)
			) {
				console.log("✅ Autoplay item triggered:", info);
				setCurrentShowingContentInfo(info);
				alreadyHasOpenedContentIds.current.push(info.id);
				return;
			}
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [stageContent]);

	const currentCourseScenario = useMemo(() => {
		if (data?.course?.json) {
			const courseJson = data.course.json;

			// 🔍 Zeige alle Inhalte mit ID und autoplay
			console.log("📥 Backend course.json.Content:");
			courseJson?.Content?.forEach((item: any) => {
				console.log(`🧩 ID: ${item?.id} | Stage: ${item?.stageNumber} | Autoplay: ${item?.autoplay}`);
			});

			return courseJson;
		}

		console.log("⚠️ Kein course.json vom Backend erhalten. Verwende EMPTY_COURSE_SCENARIO.");
		return EMPTY_COURSE_SCENARIO;
	}, [data]);

	useEffect(() => {
		if (!stageContent?.length) {
			console.log("⛔ stageContent empty or missing");
			return;
		}

		const currentStageId = currentCourseScenario?.Content?.[currentStage]?.id;
		console.log("📌 currentStageId:", currentStageId);

		const autoplayContent = stageContent.find(
			(item) =>
				(item.stageNumber === currentStage ||
					item.stageNumber === currentStageId) &&
				item.autoplay === true
		);

		if (autoplayContent) {
			console.log("🎬 Found autoplayContent in stage:", autoplayContent);
			setCurrentShowingContentInfo(autoplayContent);
		} else {
			console.warn("🔇 No autoplayContent found for current stage");
		}
	}, [currentStage, stageContent, currentCourseScenario, setCurrentShowingContentInfo]);

	const currentStageSpoiler = useMemo(() => {
		if (stageContent?.length) {
			const currentStageId = currentCourseScenario?.Content?.[currentStage]?.id;
			console.log("🧩 Looking for spoiler in stage:", currentStageId);

			if (currentStageId) {
				const spoilerInfo = stageContent.find(
					(item) =>
						(item.stageNumber === currentStage ||
							item.stageNumber === currentStageId) &&
						item.contentType?.toUpperCase() === FileTypes.Spoiler
				);

				if (spoilerInfo) {
					console.log("🛑 Spoiler found:", spoilerInfo);
				} else {
					console.log("✅ No spoiler in this stage");
				}

				return spoilerInfo ?? null;
			}
		}

		return null;
	}, [currentCourseScenario, currentStage, stageContent]);

	useEffect(() => {
		console.log("📡 Calling getScenarioActualData()");
		getScenarioActualData();
	}, [getScenarioActualData]);

	useEffect(() => {
		if (stageContent?.length) {
			const currentStageId = currentCourseScenario?.Content?.[currentStage]?.id;
			console.log("📘 currentStageId for actual content selection:", currentStageId);

			if (currentStageId) {
				const allowedContentTypes: FileTypes[] = [
					FileTypes.Text,
					FileTypes.Video,
					FileTypes.Audio,
					FileTypes.Image,
				];

				const currentStageActualContentId = stageContent?.findIndex(
					(item) =>
						item.stageNumber === currentStageId &&
						item.contentType !== undefined &&
						allowedContentTypes.includes(item.contentType as FileTypes)
				);

				if (currentStageActualContentId !== -1) {
					console.log("✅ Found actual stage content:", stageContent[currentStageActualContentId]);
					setCurrentShowingContentId(stageContent[currentStageActualContentId]?.id ?? "");
				} else {
					console.warn("🕵️ No direct match for stage content, fallback to Text type");
					const lastContentId = stageContent?.findIndex(
						(item) => item.contentType?.toUpperCase() === FileTypes.Text
					);

					if (lastContentId !== -1) {
						console.log("📄 Found fallback Text content:", stageContent[lastContentId]);
						setCurrentShowingContentId(stageContent[lastContentId]?.id ?? "");
					} else {
						console.log("❌ No fallback content found, clearing currentShowingContentId");
						setCurrentShowingContentId("");
					}
				}
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [currentStage, stageContent]);

	const currentContent = useMemo(() => {
		const existedContent = stageContent?.find((item) => item.id === currentShowingContentId);

		return !!existedContent && !isValidUrl(existedContent?.content)
			? existedContent?.content ?? ts("content-cannot-be-displayed")
			: ts("content-cannot-be-displayed");
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [currentShowingContentId, stageContent]);
	const currentContentObj = stageContent?.find((item) => item.id === currentShowingContentId);

	const renderContent = () => {
		if (!currentContentObj) {
			return <Typography>{ts("content-cannot-be-displayed")}</Typography>;
		}

		// 🛑 Skip rendering if it's autoplay or timeDelayedContent
		if (currentContentObj.autoplay) {
			return null;
		}

		const { contentType, content } = currentContentObj;
		const type = contentType?.toUpperCase();
		// mach alles Großbuchstaben, weil dein JSON "IMAGE" ist

		switch (type) {
			case "TEXT":
				return (
					<Typography
						sx={{ fontWeight: "400", color: "#626373", fontSize: "16px", mb: "0px" }}
						variant="body1"
					>
						<Markdown rehypePlugins={[rehypeRaw]}>{content}</Markdown>
					</Typography>
				);

			case "VIDEO":
				return (
					<video controls className="max-h-[500px] w-full object-contain rounded-md bg-black">
						<source src={content} type="video/mp4" />
						{ts("video-not-supported")}
					</video>
				);

			case "AUDIO":
				return (
					<audio controls className="w-full">
						<source src={content} type="audio/mpeg" />
						{ts("audio-not-supported")}
					</audio>
				);

			case "IMAGE":
				return (
					<img
						alt={ts("image-content")}
						className="w-full max-h-[400px] rounded-md object-contain bg-black"
						src={content}
					/>
				);

			default:
				return <Typography>{ts("content-cannot-be-displayed")}</Typography>;
		}
	};

	return (
		<>
			<Breadcrumbs
				items={[
					{
						title: t("course.all-scenarios"),
						url: ROUTE_CONFIG.COURSES,
					},
					{
						title: data?.course?.name ?? "",
						url: `${ROUTE_CONFIG.COURSES}/${data?.course?.id}`,
					},
				]}
				requiredPermissions={[PermissionRoles.USER]}
			/>
			<div className="w-full flex gap-6 p-6 h-[calc(100vh-154px)]">
				<div className="w-[50%] max-h-full lg:w-[70%] flex flex-col justify-between">
					<div className="max-h-24">
						<div className="flex max-h-full justify-between items-start">
							<Typography
								gutterBottom
								className="overflow-hidden text-ellipsis w-[80%] h-full !text-primary-gray"
								sx={{
									fontWeight: "600",
									fontSize: "24px",
									lineHeight: "34px",
									mb: "0px",
								}}
								variant="body1"
							>
								{truncateText(currentCourseScenario?.Content?.[currentStage]?.phaseName ?? "", 140)}
							</Typography>
							{currentStageEndTimestamp > 0 && (
								<CountdownTimer
									key={currentStageEndTimestamp}
									currentStageEndTimestamp={currentStageEndTimestamp}
								/>
							)}
						</div>
						<CourseTag className="w-fit" tag={data?.course?.tag?.name ?? ""} />
					</div>
					<div
						className={`${
							isExpandedProtocolOpen ? "min-h-[20%] max-h-[20%]" : "min-h-[50%] max-h-[50%]"
						} overflow-auto space-y-5 custom-scrollbar flex-1`}
					>
						{renderContent()}
					</div>
					<Protocol
						chatPermissions={[PermissionRoles.PROTOCOL_WRITER]}
						currentPhaseId={currentCourseScenario?.Content?.[currentStage]?.id ?? -1}
						handleOpenSpoilerModal={
							currentCourseScenario?.Content?.[currentStage]?.spoilerContent?.content
								? !currentStageSpoiler
									? () => setIsSpoilerModalShown(true)
									: () => setCurrentShowingContentInfo(currentStageSpoiler)
								: undefined
						}
						isExpandedProtocolOpen={isExpandedProtocolOpen}
						isLastPhase={currentStage === currentCourseScenario?.Content?.length - 1}
						setIsExpandedProtocolOpen={setIsExpandedProtocolOpen}
					/>
				</div>
				<div className="h-full w-[50%] lg:w-[30%] space-y-6">
					<div className="flex items-center justify-end gap-5">
						<ListConnectedUsers />
						{currentUserId && data?.user?.id && currentUserId === data?.user?.id && (
							<>
								<Button
									className="py-2 px-4 !h-[44px] !w-fit"
									color={ButtonColor.ACTION}
									image={
										<div className="mr-2 flex items-center justify-center">
											<Icon className="w-5 h-5" icon={faPlus} />
										</div>
									}
									title={ts("add-team")}
									onClick={() => setIsShowAddTeamModal(true)}
								/>
								<Button
									className="py-2 px-4 !h-[44px] !w-fit"
									color={ButtonColor.ACTION}
									image={
										<div className="mr-2 flex items-center justify-center">
											<Icon className="w-5 h-5" icon={faVrCardboard} />
										</div>
									}
									title={ts("connectAR")}
									onClick={async () => {
										try {
											const res = await fetch("http://localhost:3000/api/connect-quest/pin");
											const data = await res.text();

											setCurrentPin(data);
											setIsShowPinModal(true);
										} catch (error) {
											console.error("Fehler beim Abrufen des PINs", error);
										}
									}}
								/>
							</>
						)}
					</div>

					<TabsContainer
						containerClassName="h-[calc(100%-68px)] flex flex-col rounded-[20px] border border-[#EAECF0]"
						tabContainerClassName="px-4 pt-4 border-b border-[#E6E6EC] w-full"
						tabContentContainerClassName="!mt-0 flex-1 flex flex-col !h-[60px]"
						tabItemClassName="!py-0 !px-4 !pb-3"
					>
						<Tab title={ts("chat")}>
							<Chat
								chatBodyClassName="h-[calc(100%-120px)]"
								chatContainerClassName="h-[calc(100%-120px)]"
								messages={chatMessages}
								sendMessage={sendChatMessage}
							/>
						</Tab>
						<Tab title={ts("information")}>
							<InformationTab
								alreadyHasOpenedContentIds={alreadyHasOpenedContentIds}
								containerClassName="h-[calc(100%-60px)]"
								setCurrentShowingContentId={setCurrentShowingContentId}
								setCurrentShowingContentInfo={setCurrentShowingContentInfo}
								stageContent={stageContent}
							/>
						</Tab>
					</TabsContainer>
				</div>
			</div>
			{isShowAddTeamModal && (
				<AddTeamModal
					courseProgressId={id ?? ""}
					isOpen={isShowAddTeamModal}
					setIsOpen={setIsShowAddTeamModal}
				/>
			)}
			<SpoilerModal
				isShowSpoiler={isSpoilerModalShown}
				sendScenarioAction={sendScenarioAction}
				setIsShowSpoiler={setIsSpoilerModalShown}
			/>
			<ShowPinModal isOpen={isShowPinModal} pin={currentPin} setIsOpen={setIsShowPinModal} />
		</>
	);
}
