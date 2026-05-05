import { Snackbar } from "@mui/material";
import { useState } from "react";

export const useCopyToClipboard = () => {
	const [openAlert, setOpenAlert] = useState(false);

	const handleCopyClick = (text: string) => {
		navigator.clipboard.writeText(text);
		setOpenAlert(true);
	};

	const renderSnackbar = () => {
		return (
			<Snackbar
				autoHideDuration={2000}
				message="Copied to clipboard"
				open={openAlert}
				onClose={() => setOpenAlert(false)}
			/>
		);
	};

	return { handleCopyClick, renderSnackbar };
};
