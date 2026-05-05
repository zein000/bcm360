import { DeleteOutlineRounded } from "@mui/icons-material";
import { Box } from "@mui/system";

import { IStageContentInfo } from "@/pages/Private/pages/Courses/constants/emptyCourseScenario";
import { FileTypes } from "@/pages/Private/pages/Courses/enums/FileTypes.enum";

interface ImageContainerProps {
	imageUrl: string | null;
	imageContainerClassName?: string;
	deleteFileHandler: () => void;
	setCurrentContentInfo?: (state: IStageContentInfo | null) => void;
}

export default function ImageContainer({
	imageUrl,
	deleteFileHandler,
	imageContainerClassName,
	setCurrentContentInfo,
}: ImageContainerProps) {
	return (
		<Box alignItems="center" display="flex" justifyContent="center" position="relative">
			{imageUrl && (
				<img
					alt=""
					className={`object-cover w-full rounded-xl hover:cursor-pointer ${imageContainerClassName}`}
					src={imageUrl}
					onClick={() => {
						if (setCurrentContentInfo && typeof setCurrentContentInfo === "function") {
							setCurrentContentInfo({
								content: imageUrl,
								contentType: FileTypes.Image,
							});
						}
					}}
				/>
			)}
			{imageUrl && (
				<Box color="#ffbe3a" display="flex" position="absolute" right="0" top="0">
					<Box
						bgcolor="red.main"
						borderRadius={1}
						boxShadow={1}
						height={28}
						p="4px 6px"
						sx={{ cursor: "pointer" }}
						onClick={deleteFileHandler}
					>
						<DeleteOutlineRounded />
					</Box>
				</Box>
			)}
		</Box>
	);
}
