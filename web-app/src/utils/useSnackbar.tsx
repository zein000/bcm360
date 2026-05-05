import { Snackbar } from "@mui/material";
import { useState } from "react";

export const useSnackBar = () => {
	const [openAlert, setOpenAlert] = useState(false);
	const [message, setMessage] = useState("");

	const handleOpenSnackbar = (text: string) => {
		setMessage(text);
		setOpenAlert(true);
	};

	const renderMessageSnackbar = () => {
		return (
			<Snackbar
				anchorOrigin={{ vertical: "top", horizontal: "center" }}
				autoHideDuration={2000}
				message={message}
				open={openAlert}
				onClose={() => setOpenAlert(false)}
			/>
		);
	};

	return { handleOpenSnackbar, renderMessageSnackbar };
};
