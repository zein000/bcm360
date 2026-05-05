import { FunctionComponent, ReactNode } from "react";
import { Popover } from "@mui/material";

interface PopupProps {
	anchorEl: HTMLElement | null;
	showPopover: boolean;
	onClose: () => void;
	children: ReactNode;
}

export const Popup: FunctionComponent<PopupProps> = ({
	anchorEl,
	showPopover,
	onClose,
	children,
}) => {
	return (
		<Popover
			disableScrollLock
			PaperProps={{ sx: { width: 220 } }}
			anchorEl={anchorEl}
			anchorOrigin={{
				horizontal: "right",
				vertical: "bottom",
			}}
			open={showPopover}
			transformOrigin={{
				horizontal: "right",
				vertical: "top",
			}}
			onClose={onClose}
		>
			{children}
		</Popover>
	);
};
