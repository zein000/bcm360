import { IconButton, List, ListItem, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React, { ChangeEventHandler, Dispatch, SetStateAction, useState } from "react";

import {
	faCode,
	faCopy,
	faFileDownload,
	faLoader,
	faTrashCan,
} from "@fortawesome/pro-regular-svg-icons";
import { useTranslation } from "react-i18next";

import { Icon } from "@/components/Icon/Icon";
import { SvgIcon } from "@/components/Icon/SvgIcon";
import { useCourseFiles } from "@/pages/Private/helpers/useCourseFiles";
import { ReactComponent as UploadCloud } from "@assets/icons/upload-cloud.svg";

import { IStageContentInfo } from "../constants/emptyCourseScenario";
import { FileAssignment } from "../enums/FileAssignment.enum";
import { FileTypes } from "../enums/FileTypes.enum";
import FilesIcon from "./FilesIcon";

export interface IFileInfo {
	file?: File;
	id: number;
	fullFilePath: string;
	fileName: string;
	fileLength: number;
	fileType: FileTypes;
	fileAssignment: FileAssignment;
}

export const AllowedFileTypes = {
	[FileTypes.Image]: ["image/jpeg", "image/png", "image/gif", "image/svg+xml"] as const,
	[FileTypes.Video]: ["video/mp4", "video/avi", "video/mkv"] as const,
	[FileTypes.Audio]: ["audio/wav", "audio/mpeg"] as const,
	[FileTypes.Text]: ["application/pdf"] as const,
} as const;

interface IFilesUploaderProps {
	files: IFileInfo[];
	handleChange?: ChangeEventHandler<HTMLTextAreaElement>;
	setFiles: Dispatch<SetStateAction<IFileInfo[]>>;
	containerClassName?: string;
	allowedFileTypes?: FileTypes[];
	maxFileSizeInBytes?: number;
	isSingleFile?: boolean;
	label?: string;
	setCurrentContentInfo?: (state: IStageContentInfo | null) => void;
}

export default function FilesUploader({
	files,
	handleChange,
	setFiles,
	containerClassName = "",
	allowedFileTypes = [],
	maxFileSizeInBytes = 20 * 1024 * 1024,
	isSingleFile = false,
	label = "",
	setCurrentContentInfo,
}: IFilesUploaderProps) {
	const ALLOWED_FILE_TYPES = allowedFileTypes?.length
		? allowedFileTypes.flatMap((type) => AllowedFileTypes[type as keyof typeof AllowedFileTypes])
		: Object.values(AllowedFileTypes).flat();
	const { t } = useTranslation();
	const ts = (key: string, options = {}) => t(`courses.${key}`, options);
	const { isLoading: isFilesLoading, uploadCourseFiles, deleteCourseFile } = useCourseFiles();

	const [uploadedFile, setUploadedFile] = useState<File | null>(null);
	const [isDragging, setIsDragging] = useState(false);

	const handleFileUpload = async (file: File) => {
		setUploadedFile(file);
		const simulatedEvent = {
			target: { value: file.name },
		} as React.ChangeEvent<HTMLTextAreaElement>;

		// Falls handleChange (aus Props) definiert ist, rufe es mit dem simulierten Event auf.
		if (handleChange) {
			handleChange(simulatedEvent);
		}

		try {
			const fileUrls = await uploadCourseFiles([file]);

			const id = fileUrls?.[0]?.id;
			const fullFilePath = fileUrls?.[0]?.fullFilePath;
			const fileName = fileUrls?.[0]?.fileName;
			const fileLength = fileUrls?.[0]?.fileLength;
			const fileType = fileUrls?.[0]?.fileType;
			const fileAssignment = fileUrls?.[0]?.fileAssignment;

			if (id && fullFilePath && fileName && fileLength && fileType && fileAssignment) {
				setFiles((prevFiles) => [
					...prevFiles,
					{ file, fileLength, fileAssignment, fileName, fullFilePath, id, fileType },
				]);
			}
		} catch (e) {
			console.log("Error file uploading:", e);
		} finally {
			setUploadedFile(null);
		}
	};

	const handleRemoveFile = async (fileToRemove: IFileInfo) => {
		try {
			if (fileToRemove.fullFilePath) {
				await deleteCourseFile(fileToRemove.fullFilePath);
			}

			setFiles((prevFiles) =>
				prevFiles.filter((fileInfo: IFileInfo) => fileInfo.fileName !== fileToRemove.fileName)
			);
		} catch (e) {
			console.log("Error file uploading:", e);
		}
	};

	const validateFile = (file: File) => {
		if (file.size > maxFileSizeInBytes) {
			alert("File size exceeds the 20MB limit.");

			return false;
		}

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		if (!ALLOWED_FILE_TYPES.includes(file.type as any)) {
			alert("This file type is not allowed.");

			return false;
		}

		return true;
	};

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];

		if (file && validateFile(file)) {
			handleFileUpload(file);
		}
	};

	const handleDragOver = (e: React.DragEvent) => {
		e.preventDefault();
		e.stopPropagation();
		setIsDragging(true);
	};

	const handleDragLeave = (e: React.DragEvent) => {
		e.preventDefault();
		e.stopPropagation();
		setIsDragging(false);
	};

	const handleDrop = (e: React.DragEvent) => {
		e.preventDefault();
		e.stopPropagation();
		setIsDragging(false);

		const file = e.dataTransfer.files?.[0];

		if (file && validateFile(file)) {
			handleFileUpload(file);
		}
	};

	const getFileMimeType = (fileName: string): string | null => {
		const fileExtension = fileName.split(".").pop()?.toLowerCase();

		const extensionToMimeType: Record<string, string> = {
			jpeg: "image/jpeg",
			jpg: "image/jpeg",
			png: "image/png",
			gif: "image/gif",
			svg: "image/svg+xml",
			pdf: "application/pdf",
			mp4: "video/mp4",
			avi: "video/avi",
			mkv: "video/mkv",
			wav: "audio/wav",
			mp3: "audio/mpeg",
		};

		if (fileExtension && extensionToMimeType[fileExtension]) {
			return extensionToMimeType[fileExtension];
		}

		return null;
	};

	const handleCopyFile = (filePath: string, fileType: FileTypes) => {
		let copiedData = filePath;
		const mimeType = getFileMimeType(filePath);

		switch (fileType?.toUpperCase()) {
			case FileTypes.Video:
				copiedData = `
<video controls style="display: block; margin: auto; width: 100%; height: 100%; max-width: 100vw; max-height: 100vh; object-fit: contain;">
	<source src="${filePath}" type="${mimeType ?? "video/mp4"}" />
	${t("basics.not-support-tag")}
</video>`;
				break;
			case FileTypes.Image:
				copiedData = `<img src="${filePath}" alt="Image" title="Your title"
    style="display: block; margin: auto; width: 100%; height: 100%; max-width: 100vw; max-height: 100vh; object-fit: contain;" />`;
				break;
			case FileTypes.Audio:
				copiedData = `
<audio controls style="display: block; margin: auto; width: 100%; max-width: 600px;">
	<source src="${filePath}" type="${mimeType ?? "audio/mpeg"}" />
	${t("basics.not-support-tag")}
</audio>`;
				break;
			default:
				copiedData = filePath;
				break;
		}

		navigator.clipboard.writeText(copiedData).catch((error) => {
			console.error("Failed to copy to clipboard:", error);
		});
	};

	return (
		<Box className={`space-y-1 ${containerClassName}`}>
			{label && (
				<label className="ml-1 text-[14px] font-bold text-primary-gray mb-[6px]">{label}</label>
			)}
			{!(isSingleFile && files.length > 1) && (
				<Box
					className="max-h-[10vh] min-h-[10vh]"
					display="flex"
					flexDirection="column"
					justifyContent="center"
					sx={{
						border: "1px solid #EAECF0",
						borderRadius: "12px",
						textAlign: "center",
						backgroundColor: isDragging ? "#f0f8ff" : "white",
						cursor: !uploadedFile ? "pointer" : "not-allowed",
						transition: "background-color 0.3s ease-in-out",
					}}
					textAlign="center"
					onDragLeave={handleDragLeave}
					onDragOver={handleDragOver}
					onDrop={handleDrop}
				>
					<label
						htmlFor="file-upload"
						style={{ cursor: !uploadedFile ? "pointer" : "not-allowed" }}
					>
						<Box
							alignItems="center"
							bgcolor={"white"}
							borderRadius="12px"
							display="flex"
							flexDirection="column"
							justifyContent="center"
							textAlign="center"
						>
							{!isDragging ? (
								<>
									<SvgIcon
										className={`h-[40px] w-[40px] p-[10px] border rounded-lg border-gray-200 ${
											!!uploadedFile ? "text-gray-200" : "text-gray-600"
										}`}
										svgIcon={UploadCloud}
									/>
									<Typography
										className={`text-[14px] ${!!uploadedFile ? "text-gray-200" : "text-gray-600"}`}
										variant="body2"
									>
										{ts("upload.title")}
									</Typography>
									<Typography
										className={`text-[14px] ${!!uploadedFile ? "text-gray-200" : "text-gray-600"}`}
										variant="caption"
									>
										{ts("upload.description", {
											sizeInMB: Math.round(maxFileSizeInBytes / 1024 / 1024),
										})}
									</Typography>
								</>
							) : (
								<Box p={4}>
									<Typography variant="body2">{ts("upload.drop")}</Typography>
								</Box>
							)}
						</Box>
					</label>
					<input
						accept={ALLOWED_FILE_TYPES?.join(",")}
						disabled={!!uploadedFile}
						id="file-upload"
						style={{ display: "none" }}
						type="file"
						onChange={handleFileChange}
					/>
				</Box>
			)}

			<List
				className="custom-scrollbar"
				sx={{
					display: "flex",
					flexDirection: "column",
					gap: 1,
					maxHeight: "15vh",
					overflow: "auto",
				}}
			>
				{files?.map((fileInfo, index) => (
					<ListItem
						key={index}
						className="h-[5vh] hover:cursor-pointer"
						sx={{
							backgroundColor: "white",
							borderRadius: "12px",
							display: "flex",
							alignItems: "center",
							gap: 1,
						}}
						onClick={() => {
							if (setCurrentContentInfo && typeof setCurrentContentInfo === "function") {
								setCurrentContentInfo({
									content: fileInfo?.fullFilePath,
									contentType: fileInfo.fileType,
								});
							}
						}}
					>
						<FilesIcon fileType={fileInfo.fileType} />
						<Box flexGrow={1} mr={2}>
							<Typography fontSize={"14px"} fontWeight={500} mb={0}>
								{fileInfo?.fileName}
							</Typography>
							<Typography fontSize={"12px"} mb={0}>
								{(fileInfo?.fileLength / 1024).toFixed(2)} KB
							</Typography>
						</Box>
						<IconButton
							disabled={isFilesLoading}
							onClick={(e) => {
								e.stopPropagation();
								handleCopyFile(fileInfo.fullFilePath, fileInfo.fileType);
							}}
						>
							<Icon icon={faCode} size="xs" />
						</IconButton>
						<IconButton
							disabled={isFilesLoading}
							onClick={(e) => {
								e.stopPropagation();
								navigator.clipboard.writeText(fileInfo.fullFilePath).catch((error) => {
									console.error("Failed to copy to clipboard:", error);
								});
							}}
						>
							<Icon icon={faCopy} size="xs" />
						</IconButton>
						<IconButton
							disabled={isFilesLoading}
							onClick={(e) => {
								e.stopPropagation();
								handleRemoveFile(fileInfo);
							}}
						>
							<Icon icon={faTrashCan} size="xs" />
						</IconButton>
					</ListItem>
				))}
			</List>

			{uploadedFile && (
				<Box
					alignItems="center"
					bgcolor={"white"}
					borderRadius="12px"
					className="h-[5vh]"
					display="flex"
					gap={1}
				>
					<Icon className="w-5 h-5 text-primary-gray-lighter" icon={faFileDownload} size="xl" />
					<Box flexGrow={1} mr={2}>
						<Typography fontSize={"14px"} fontWeight={500} mb={0}>
							{uploadedFile?.name}
						</Typography>
						<Typography fontSize={"12px"} mb={0}>
							{(uploadedFile?.size / 1024).toFixed(2)} KB
						</Typography>
					</Box>
					{isFilesLoading && <Icon className="animate-spin" icon={faLoader} size="xs" />}
				</Box>
			)}
		</Box>
	);
}
