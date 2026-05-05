import { FunctionComponent } from "react";
import { Box, CircularProgress } from "@mui/material";

export const Loader: FunctionComponent = () => (
	<Box
		sx={{
			padding: "5rem",
			display: "flex",
			justifyContent: "center",
			alignItems: "center",
		}}
	>
		<CircularProgress />
	</Box>
);
