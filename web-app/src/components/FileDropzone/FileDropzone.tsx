import { FunctionComponent } from "react";
import { useDropzone, DropzoneOptions, FileWithPath } from "react-dropzone";
import { Box, Stack, Typography } from "@mui/material";
import { Trans } from "react-i18next";

export type File = FileWithPath;

interface FileDropzoneProps extends DropzoneOptions {
	caption?: string;
}

export const FileDropzone: FunctionComponent<FileDropzoneProps> = ({ caption, ...other }) => {
	const { getRootProps, getInputProps, isDragActive } = useDropzone(other);

	return (
		<Box
			sx={{
				border: 1,
				borderRadius: 1,
				borderStyle: "dashed",
				borderColor: "divider",
				p: 6,
				...(isDragActive && {
					backgroundColor: "action.active",
					opacity: 0.5,
				}),
				"&:hover": {
					backgroundColor: "action.hover",
					cursor: "pointer",
					opacity: 0.5,
				},
			}}
			{...getRootProps()}
		>
			<input {...getInputProps()} />

			<Stack alignItems="center" spacing={2}>
				<Typography
					sx={{
						"& span": {
							textDecoration: "underline",
						},
					}}
					variant="body1"
				>
					<Trans
						components={{
							underline: <Typography component="span" ml={0.5} variant="body1" />,
						}}
						i18nKey="modals.addAvatar.description"
					/>
				</Typography>

				{caption && (
					<Typography color="text.secondary" variant="caption">
						{caption}
					</Typography>
				)}
			</Stack>
		</Box>
	);
};
