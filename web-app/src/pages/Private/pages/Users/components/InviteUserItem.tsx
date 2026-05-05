import { InputAdornment, MenuItem, TextField } from "@mui/material";
import { ChangeEvent, FunctionComponent } from "react";

import { Role } from "@/enum";

import { SvgIcon } from "@/components/Icon/SvgIcon";

import { ReactComponent as Mail } from "@assets/icons/mail.svg";

import { UserRole } from "../../UserRoles/schema/roles";

interface InviteUserItemProps {
	email: string;
	role: string;
	roles: UserRole[];
	onEmailChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	onRoleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const InviteUserItem: FunctionComponent<InviteUserItemProps> = ({
	email,
	role,
	roles,
	onEmailChange,
	onRoleChange,
}) => {
	return (
		<div className="flex flex-row w-full gap-2">
			<TextField
				InputProps={{
					startAdornment: (
						<InputAdornment
							position="start"
							sx={{
								"&:not(.MuiInputAdornment-hiddenLabel)": {
									marginTop: "0px !important",
								},
							}}
						>
							<div className="mr-2 flex items-center">
								<SvgIcon className="w-[20px] h-[20px] text-gray-500" svgIcon={Mail} />
							</div>{" "}
						</InputAdornment>
					),
				}}
				className="w-full"
				inputProps={{
					style: {
						display: "flex",
						alignItems: "center",
						padding: "10px 0px",
					},
				}}
				placeholder="you@example.com"
				value={email}
				onChange={onEmailChange}
			/>
			<TextField
				select
				SelectProps={{
					MenuProps: {
						PaperProps: {
							sx: {
								"& .MuiMenuItem-root": {
									display: "flex",
									alignItems: "center",
								},
							},
						},
					},
				}}
				className="w-[160px] h-[44px]"
				inputProps={{
					style: {
						display: "flex",
						alignItems: "center",
					},
				}}
				sx={{
					"& .MuiSelect-select": {
						alignSelf: "flex-end",
					},
					"& .MuiInputBase-root": {
						marginBottom: "0px",
					},
				}}
				value={role ?? Role.USER}
				onChange={onRoleChange}
			>
				{roles.map((role) => (
					<MenuItem key={role.id} value={role.name}>
						{role.name}
					</MenuItem>
				))}
			</TextField>
		</div>
	);
};
