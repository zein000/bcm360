import { FunctionComponent } from "react";
import { useTranslation } from "react-i18next";
import { Button, Dialog, DialogActions, DialogContent, Typography } from "@mui/material";

import { File, FileDropzone } from "../FileDropzone/FileDropzone";

interface FileUploaderProps {
	isOpened: boolean;
	handleClose: () => void;
	handleFile: (file: File) => void;
	caption?: string;
	maxFilesNumber?: number;
}

export const FileUploader: FunctionComponent<FileUploaderProps> = ({
	isOpened,
	handleClose,
	handleFile,
	caption,
	maxFilesNumber = 1,
}) => {
	const { t } = useTranslation();

	const handleDrop = (files: File[]): void => {
		if (files.length) {
			handleFile(files[0]);
		}

		handleClose();
	};

	return (
		<Dialog fullWidth maxWidth="xs" open={isOpened} onClose={handleClose}>
			<Typography sx={{ py: 4, px: 3 }} variant="h6">
				{t("modals.addAvatar.title")}
			</Typography>

			<DialogContent sx={{ py: 0 }}>
				<FileDropzone
					accept={{ "image/*": [".png", ".jpeg", ".jpg"] }}
					caption={caption}
					maxFiles={maxFilesNumber}
					onDrop={handleDrop}
				/>
			</DialogContent>

			<DialogActions sx={{ px: 3, py: 2 }}>
				<Button color="inherit" onClick={handleClose}>
					{t("basics.cancel")}
				</Button>
			</DialogActions>
		</Dialog>
	);
};
