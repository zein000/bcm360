import { PropsWithChildren } from "react";
import { createPortal } from "react-dom";
import { Box } from "@mui/material";

export const AuthError = ({ children }: PropsWithChildren) => {
	const authSection = document.getElementById("portal-auth");

	return authSection
		? createPortal(<Box sx={{ width: "100%", maxWidth: 444 }}>{children}</Box>, authSection)
		: null;
};
