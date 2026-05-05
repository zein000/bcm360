import { useNavigate, useParams } from "react-router-dom";

import { useState } from "react";

import CircularProgress from "@mui/material/CircularProgress/CircularProgress";

import { useDispatch } from "react-redux";

import {
	coursesProgressApi,
	useGetScenarioProgressQuery,
} from "@/pages/Private/redux/course-progress/course-progress.api";

import { CourseProgressEnum } from "@/enum/course-progress.enum";

import { useAppSelector } from "@/redux/hooks";

import { authSelector } from "@/pages/Public/redux/auth.slice";

import { IStageContentInfo } from "../../Courses/constants/emptyCourseScenario";
import ContentModal from "../components/ContentModal";
import CourseInProgress from "../components/CourseInProgress";
import EndSession from "../components/EndSession";
import { SocketProvider } from "../context/SocketContext";
import { ScenarioActionTypes } from "../enums/ScenarioActionTypes.enum";
import { IEndSessionData } from "../interfaces/IEndSessionData.interface";

export default function CourseInProgressPage() {
	const { id } = useParams();
	const dispatch = useDispatch();
	const { data, isFetching } = useGetScenarioProgressQuery(id ? id : "");
	const [endSessionData, setEndSessionData] = useState<IEndSessionData | null>(null);
	const authState = useAppSelector(authSelector);
	const navigate = useNavigate();
	const [currentShowingContentInfo, setCurrentShowingContentInfo] =
		useState<IStageContentInfo | null>(null);

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	function actionHandler(receivedData: any) {
		if (!receivedData?.type) {
			return;
		}

		switch (receivedData?.type) {
			case ScenarioActionTypes.NEW_STAGE:
				break;
			case ScenarioActionTypes.FINISH_SCENARIO:
				setEndSessionData({
					scenarioName: receivedData.scenarioName,
					status: receivedData.status,
					additionalStatusInfo: receivedData?.additionalStatusInfo,
				});
				if (authState?.user?.id && data?.user?.id && authState.user.id !== data.user.id) {
					localStorage.removeItem("token");
				} else {
					dispatch(coursesProgressApi.util.invalidateTags(["CourseProgress"]));
				}

				setCurrentShowingContentInfo(null);
				break;
			case ScenarioActionTypes.SHOW_SPOILER:
				if (receivedData?.content) {
					setCurrentShowingContentInfo(receivedData.content);
				}

				break;
			case ScenarioActionTypes.LOGOUT:
				if (receivedData?.userId === authState?.user?.id) {
					localStorage.removeItem("token");
					navigate("/logout");
				}

				break;
			default:
				console.log("Received unknown action", receivedData?.type, data);
				break;
		}
	}

	if (isFetching) {
		return (
			<div className="w-full flex-1 flex items-center justify-center">
				<CircularProgress className="!w-16 !h-16 !text-primary-gray" />
			</div>
		);
	}

	return (
		<SocketProvider
			courseId={id ? id : ""}
			currentAuth={authState}
			errInfo={data?.user}
			onActionHandler={actionHandler}
		>
			{endSessionData ||
			data?.status === CourseProgressEnum.Failed ||
			data?.status === CourseProgressEnum.Success ? (
				<EndSession
					data={
						endSessionData ?? {
							status: data?.status ?? CourseProgressEnum.NotStarted,
							scenarioName: data?.course?.name ?? "",
							additionalStatusInfo: "already-end",
						}
					}
				/>
			) : (
				<>
					<CourseInProgress
						data={data}
						setCurrentShowingContentInfo={setCurrentShowingContentInfo}
					/>
					<ContentModal
						contentInfo={currentShowingContentInfo}
						setCurrentContentInfo={setCurrentShowingContentInfo}
					/>
				</>
			)}
		</SocketProvider>
	);
}
