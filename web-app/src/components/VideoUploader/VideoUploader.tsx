import { Box, Typography } from "@mui/material";
import React, {
	ChangeEventHandler,
	FunctionComponent,
	useCallback,
	useEffect,
	useState,
} from "react";
import { FileUploader } from "react-drag-drop-files";
import { useTranslation } from "react-i18next";

import { faLoader } from "@fortawesome/pro-regular-svg-icons";

import { ReactComponent as UploadCloud } from "@assets/icons/upload-cloud.svg";

import { useCourseFiles } from "@/pages/Private/helpers/useCourseFiles";

import { FileAssignment } from "@/pages/Private/pages/Courses/enums/FileAssignment.enum";

import { IFileInfo } from "@/pages/Private/pages/Courses/components/FilesUploader";

import { IStageContentInfo } from "@/pages/Private/pages/Courses/constants/emptyCourseScenario";

import { Icon } from "../Icon/Icon";
import { SvgIcon } from "../Icon/SvgIcon";
import VideoContainer from "./VideoContainer";

interface VideoUploaderProps {
	border?: boolean;
	label: string;
	description?: string;
	handleChange?: ChangeEventHandler<HTMLTextAreaElement>;
	setCurrentVideoFileInfo: (fileInfo: IFileInfo | null) => void;
	currentVideoFileInfo?: IFileInfo | null;
	maxFileSizeInBytes?: number;
	videoContainerClassName?: string;
	videoPrefix?: string;
	fileAssignment: FileAssignment;
	setCurrentContentInfo?: (state: IStageContentInfo | null) => void;
}

export const VideoUploader: FunctionComponent<VideoUploaderProps> = ({
	border,
	setCurrentVideoFileInfo,
	currentVideoFileInfo,
	label,
	description,
	handleChange,
	videoContainerClassName = "max-h-[10vh] min-h-[10vh]",
	maxFileSizeInBytes = 30 * 1024 * 1024,
	videoPrefix = "uploaded-video",
	fileAssignment,
	setCurrentContentInfo,
}) => {
	const { t } = useTranslation();
	const { uploadCourseFiles, deleteCourseFile, isLoading } = useCourseFiles();
	const [uploadedFile, setUploadedFile] = useState<null | File>(null);

	const handleUpload = async (file: File) => {
		try {
			const fileExtension = file.name.split(".").pop();
			const newFileName = `${videoPrefix}.${fileExtension}`;

			const renamedFile = new File([file], newFileName, { type: file.type });

			const uploadedUrl = await uploadCourseFiles([renamedFile], fileAssignment);

			if (uploadedUrl?.length) {
				setCurrentVideoFileInfo(uploadedUrl[0] as IFileInfo);
			} else {
				throw new Error("Upload failed");
			}
		} catch (error) {
			console.error(error);
			setCurrentVideoFileInfo(null);
		}
	};

	const resetFile = useCallback(async () => {
		if (currentVideoFileInfo?.fullFilePath) {
			try {
				await deleteCourseFile(currentVideoFileInfo?.fullFilePath);
				setCurrentVideoFileInfo(null);
			} catch (error) {
				console.error("Error deleting video:", error);
			}
		}

		setUploadedFile(null);
	}, [currentVideoFileInfo, deleteCourseFile, setCurrentVideoFileInfo]);

	useEffect(() => {
		if (uploadedFile) {
			handleUpload(uploadedFile);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [uploadedFile]);

	return (
		<div className="w-full">
			{label && (
				<label className="ml-1 text-[14px] font-bold text-primary-gray mb-[6px]">{label}</label>
			)}
			{description && (
				<p className="ml-1 mt-1 text-[14px] text-primary-gray-lighter mb-[6px]">{description}</p>
			)}
			<Box
				className="max-h-[10vh] min-h-[10vh]"
				display="flex"
				flexDirection="column"
				justifyContent="center"
				sx={{
					borderRadius: "12px",
					textAlign: "center",
					backgroundColor: "white",
					transition: "background-color 0.3s ease-in-out",
					...(border ? { border: "1px solid", borderColor: "#EAECF0" } : { boxShadow: 1 }),
				}}
				textAlign="center"
				width="100%"
			>
				{!currentVideoFileInfo ? (
					<FileUploader
						disabled={isLoading}
						handleChange={(file: File) => {
							setUploadedFile(file);
							// Erzeuge ein simuliertes Event, das den erwarteten Typ hat.
							// Hier wird z. B. der Dateiname als value genutzt.
							const simulatedEvent = {
								target: { value: file.name },
							} as React.ChangeEvent<HTMLTextAreaElement>;

							// Falls handleChange (aus Props) definiert ist, rufe es mit dem simulierten Event auf.
							if (handleChange) {
								handleChange(simulatedEvent);
							}
						}}
						maxSize={Math.round(maxFileSizeInBytes / 1024 / 1024)}
						name="file"
						types={["MP4", "MOV", "AVI"]}
					>
						<Box
							alignItems="center"
							color="gray600.main"
							display="flex"
							flexDirection="column"
							height="100%"
							justifyContent="center"
							sx={{ cursor: "pointer" }}
							textAlign="center"
						>
							{isLoading ? (
								<Icon className="animate-spin" icon={faLoader} size="lg" />
							) : (
								<>
									<SvgIcon
										className="h-[40px] w-[40px] p-[10px] border rounded-lg border-gray-200 text-gray-600"
										svgIcon={UploadCloud}
									/>
									<Typography className="text-primary-gray" variant="body2">
										{t("courses.upload.title")}
									</Typography>
									<Typography className="text-primary-gray" variant="caption">
										{t("courses.upload.description", {
											sizeInMB: Math.round(maxFileSizeInBytes / 1024 / 1024),
										})}
									</Typography>
								</>
							)}
						</Box>
					</FileUploader>
				) : (
					<VideoContainer
						deleteFileHandler={resetFile}
						setCurrentContentInfo={setCurrentContentInfo}
						videoContainerClassName={videoContainerClassName}
						videoUrl={currentVideoFileInfo?.fullFilePath}
					/>
				)}
			</Box>
		</div>
	);
};
