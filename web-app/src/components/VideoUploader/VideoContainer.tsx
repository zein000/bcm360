import { DeleteOutlineRounded } from "@mui/icons-material";
import { Box } from "@mui/system";

import { IconButton } from "@mui/material";

import { faPlay } from "@fortawesome/pro-solid-svg-icons";

import { IStageContentInfo } from "@/pages/Private/pages/Courses/constants/emptyCourseScenario";
import { FileTypes } from "@/pages/Private/pages/Courses/enums/FileTypes.enum";

import { Icon } from "../Icon/Icon";

interface VideoContainerProps {
	videoUrl: string | null;
	videoContainerClassName?: string;
	deleteFileHandler?: () => void;
	setCurrentContentInfo?: (state: IStageContentInfo | null) => void;
	isShowDeleteButton?: boolean;
	isDefaultControlsEnabled?: boolean;
}

export default function VideoContainer({
	videoUrl,
	deleteFileHandler,
	videoContainerClassName,
	setCurrentContentInfo,
	isShowDeleteButton = true,
	isDefaultControlsEnabled = false,
}: VideoContainerProps) {
	return (
		<Box alignItems="center" display="flex" justifyContent="center" position="relative">
			{videoUrl && (
				<>
					<video
						className={`w-full object-cover hover:cursor-pointer rounded-xl ${videoContainerClassName}`}
						controls={isDefaultControlsEnabled}
						src={videoUrl}
						onClick={() => {
							if (setCurrentContentInfo && typeof setCurrentContentInfo === "function") {
								setCurrentContentInfo({
									content: videoUrl,
									contentType: FileTypes.Video,
								});
							}
						}}
					/>
					{!isDefaultControlsEnabled && (
						<IconButton
							className="flex items-center justify-center"
							style={{
								position: "absolute",
								top: "50%",
								left: "50%",
								transform: "translate(-50%, -50%)",
								backgroundColor: "rgba(0, 0, 0, 0.5)",
								color: "white",
								fontSize: "2rem",
								width: "40px",
								height: "40px",
							}}
							onClick={(e) => {
								e.stopPropagation();
								if (setCurrentContentInfo && typeof setCurrentContentInfo === "function") {
									setCurrentContentInfo({
										content: videoUrl,
										contentType: FileTypes.Video,
									});
								}
							}}
						>
							<Icon className="-mr-1" icon={faPlay} size="sm" />
						</IconButton>
					)}
				</>
			)}
			{isShowDeleteButton && videoUrl && (
				<Box color="#ffbe3a" display="flex" position="absolute" right="0" top="0">
					<Box
						bgcolor="red.main"
						borderRadius={1}
						boxShadow={1}
						height={28}
						p="4px 6px"
						sx={{ cursor: "pointer" }}
						onClick={() => {
							if (deleteFileHandler && typeof deleteFileHandler === "function") {
								deleteFileHandler();
							}
						}}
					>
						<DeleteOutlineRounded />
					</Box>
				</Box>
			)}
		</Box>
	);
}
