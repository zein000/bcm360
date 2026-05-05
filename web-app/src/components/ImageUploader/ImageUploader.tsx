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
import { Crop } from "react-image-crop";

import { faLoader } from "@fortawesome/pro-regular-svg-icons";

import { ReactComponent as UploadCloud } from "@assets/icons/upload-cloud.svg";

import { useCourseFiles } from "@/pages/Private/helpers/useCourseFiles";

import { FileAssignment } from "@/pages/Private/pages/Courses/enums/FileAssignment.enum";

import { IFileInfo } from "@/pages/Private/pages/Courses/components/FilesUploader";

import { IStageContentInfo } from "@/pages/Private/pages/Courses/constants/emptyCourseScenario";

import { Icon } from "../Icon/Icon";
import { SvgIcon } from "../Icon/SvgIcon";
import ImageContainer from "./ImageContainer";
import { ImageCropperModal } from "./ImageCropperModal";

interface ImageUploaderProps {
	border?: boolean;
	label: string;
	description?: string;
	handleChange?: ChangeEventHandler<HTMLTextAreaElement>;
	setCurrentImgFileInfo: (fileInfo: IFileInfo | null) => void;
	currentImgFileInfo?: IFileInfo | null;
	maxFileSizeInBytes?: number;
	imageContainerClassName?: string;
	imagePrefix?: string;
	aspectRatio?: number;
	fileAssignment: FileAssignment;
	setCurrentContentInfo?: (state: IStageContentInfo | null) => void;
}

export const ImageUploader: FunctionComponent<ImageUploaderProps> = ({
	border,
	setCurrentImgFileInfo,
	currentImgFileInfo,
	label,
	description,
	handleChange,
	imageContainerClassName = "max-h-[10vh] min-h-[10vh]",
	maxFileSizeInBytes = 5 * 1024 * 1024,
	imagePrefix = "cropped-image",
	aspectRatio = 3 / 4,
	fileAssignment,
	setCurrentContentInfo,
}) => {
	const { t } = useTranslation();

	const { uploadCourseFiles, deleteCourseFile, isLoading } = useCourseFiles();
	// The file that is uploaded in the File Uploader
	const [uploadedFile, setUploadedFile] = useState<null | File>(null);

	// this state is used to store the current fileUrl that is the current uploaded image
	const [fileUrl, setFileUrl] = useState<null | string>(null);

	// Crop state for Cropper
	const [image, setImage] = useState<HTMLImageElement | null>(null);
	const [crop, setCrop] = useState<Crop>();

	const handleSaveCrop = () => {
		if (image && crop) {
			const canvas = document.createElement("canvas");
			const scaleX = image.naturalWidth / image.width;
			const scaleY = image.naturalHeight / image.height;

			canvas.width = crop.width;
			canvas.height = crop.height;
			const ctx = canvas.getContext("2d");

			if (ctx) {
				const pixelRatio = window.devicePixelRatio;

				canvas.width = crop.width * pixelRatio;
				canvas.height = crop.height * pixelRatio;
				ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
				ctx.imageSmoothingQuality = "high";

				ctx.drawImage(
					image,
					crop.x * scaleX,
					crop.y * scaleY,
					crop.width * scaleX,
					crop.height * scaleY,
					0,
					0,
					crop.width,
					crop.height
				);

				canvas.toBlob(async (blob) => {
					if (blob) {
						const file = new File([blob], `${imagePrefix}.png`, { type: "image/png" });
						const uploadedUrl = await uploadCourseFiles([file], fileAssignment);

						if (uploadedUrl?.length) {
							setCurrentImgFileInfo(uploadedUrl[0] as IFileInfo);
						}
					}
				}, "image/png");
				setCrop(undefined);
				setFileUrl(null);
			}
		}
	};

	const resetFile = useCallback(async () => {
		if (currentImgFileInfo && currentImgFileInfo?.fullFilePath) {
			try {
				await deleteCourseFile(currentImgFileInfo?.fullFilePath);
				setCurrentImgFileInfo(null);
			} catch (error) {
				console.error("Error deleting file:", error);
			}
		}

		setUploadedFile(null);
		setFileUrl(null);
		setCrop(undefined);
	}, [currentImgFileInfo, deleteCourseFile, setCurrentImgFileInfo]);

	useEffect(() => {
		if (uploadedFile) {
			const reader = new FileReader();

			reader.readAsDataURL(uploadedFile);
			reader.onload = () => setFileUrl(reader.result as string);
		}
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
				{!currentImgFileInfo ? (
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
						types={["JPG", "JPEG", "PNG"]}
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
					<ImageContainer
						deleteFileHandler={resetFile}
						imageContainerClassName={imageContainerClassName}
						imageUrl={fileUrl || currentImgFileInfo?.fullFilePath}
						setCurrentContentInfo={setCurrentContentInfo}
					/>
				)}

				<ImageCropperModal
					aspectRatio={aspectRatio}
					crop={crop}
					handleSaveCrop={handleSaveCrop}
					image={fileUrl}
					resetFile={resetFile}
					setCrop={setCrop}
					setImage={setImage}
				/>
			</Box>
		</div>
	);
};
