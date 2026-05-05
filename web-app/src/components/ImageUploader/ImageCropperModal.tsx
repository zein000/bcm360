import { FunctionComponent, SyntheticEvent } from "react";
import ReactCrop, { centerCrop, Crop, makeAspectCrop } from "react-image-crop";

import "react-image-crop/dist/ReactCrop.css";
import { Modal } from "../Modals/Modal";

interface ImageCropperModalProps {
	crop: Crop | undefined;
	setCrop: (c: Crop) => void;
	image: string | null;
	setImage: (img: HTMLImageElement) => void;
	handleSaveCrop: () => void;
	resetFile: () => void;
	aspectRatio: number;
}

export const ImageCropperModal: FunctionComponent<ImageCropperModalProps> = ({
	crop,
	setCrop,
	image,
	setImage,
	handleSaveCrop,
	resetFile,
	aspectRatio,
}) => {
	const onImageLoad = (e: SyntheticEvent<HTMLImageElement, Event>) => {
		setImage(e.currentTarget);
		const { width, height } = e.currentTarget;

		const smallestVal = width < height ? width : height;

		const crop = makeAspectCrop(
			centerCrop(
				{
					// You don't need to pass a complete crop into
					// makeAspectCrop or centerCrop.
					unit: "px",
					height: smallestVal,
					width: smallestVal,
				},
				width,
				height
			),
			aspectRatio,
			width,
			height
		);

		setCrop(crop);
	};

	return (
		<Modal
			handleClose={resetFile}
			handleSave={() => {
				if (crop) {
					handleSaveCrop();
				}
			}}
			isLoading={false}
			isOpened={!!image}
			size="lg"
			submitButtonText="Save"
			title={""}
		>
			<ReactCrop
				aspect={aspectRatio}
				className="react-cropper"
				crop={crop}
				style={{ width: "100%", height: "100%" }}
				onChange={(c) => setCrop(c)}
			>
				<img
					alt=""
					className="rounded-lg w-full h-full object-contain"
					crossOrigin="anonymous"
					src={image!}
					style={{ height: "60vh" }}
					onLoad={(e) => onImageLoad(e)}
				/>
			</ReactCrop>
		</Modal>
	);
};
