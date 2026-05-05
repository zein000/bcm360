import { FunctionComponent, MouseEventHandler } from "react";
import { useTheme } from "@mui/material/styles";
import { Box, Chip as MuiChip } from "@mui/material";
import { faXmark } from "@fortawesome/pro-regular-svg-icons";

import { ChipColor } from "@/schemas/chips";

import { Icon } from "../Icon/Icon";

interface ChipProps {
	label: string;
	color: ChipColor;
	handleDelete?: MouseEventHandler;
}

export const Chip: FunctionComponent<ChipProps> = ({ label, color = "primary", handleDelete }) => {
	const theme = useTheme();

	const backgroundColor = theme.palette[color].alpha12;
	const textColor =
		theme.palette.mode === "dark" ? theme.palette[color].main : theme.palette[color].dark;

	return (
		<Box
			sx={{
				display: "inline-flex",
				position: "relative",
				"&:hover": {
					"& > .MuiChip-root > .MuiChip-label": {
						opacity: handleDelete ? 0.3 : 1,
					},
				},
			}}
			onClick={handleDelete}
		>
			<MuiChip
				label={label}
				size="small"
				sx={{ backgroundColor, color: textColor, textTransform: "capitalize" }}
			/>

			{handleDelete && (
				<Box
					sx={{
						alignItems: "center",
						cursor: "pointer",
						display: "flex",
						justifyContent: "center",
						inset: 0,
						opacity: 0,
						position: "absolute",
						"&:hover": {
							opacity: 1,
						},
					}}
				>
					<Icon icon={faXmark} size="lg" />
				</Box>
			)}
		</Box>
	);
};
