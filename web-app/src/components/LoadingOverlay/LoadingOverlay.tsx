import { FunctionComponent } from "react";
import { Box, CircularProgress } from "@mui/material";

export const LoadingOverlay: FunctionComponent = () => (
	<Box
		sx={{
			position: "fixed",
			inset: 0,
			display: "flex",
			justifyContent: "center",
			alignItems: "center",
			zIndex: 9999,
		}}
	>
		<CircularProgress />
	</Box>
);
