import { FunctionComponent } from "react";
import { Avatar as MuiAvatar } from "@mui/material";

interface AvatarProps {
	firstName?: string;
	lastName?: string;
	imageSrc?: string;
}

export const Avatar: FunctionComponent<AvatarProps> = ({ firstName, lastName, imageSrc }) => {
	return (
		<MuiAvatar
			src={imageSrc}
			sx={{
				height: 32,
				width: 32,
				cursor: "pointer",
			}}
		>
			{firstName &&
				lastName &&
				`${firstName.split("")[0].toUpperCase()}${lastName.split("")[0].toUpperCase()}`}
		</MuiAvatar>
	);
};
