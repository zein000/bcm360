import { MenuItem, TextField } from "@mui/material";
import { ChangeEvent } from "react";
import { useTranslation } from "react-i18next";

import { faCheck, faTrash } from "@fortawesome/pro-regular-svg-icons";

import { PermissionRoles } from "@/enum";
import { Icon } from "@/components";

interface ISelectParticipantPermissionProps {
	value: string;
	onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
	className?: string;
	inputPadding?: string;
	isNeedRemove?: boolean;
}

export const PARTICIPANT_PERMISSIONS = [PermissionRoles.PROTOCOL_WRITER];
export const PARTICIPANT_PERMISSION_NONE = "None";
export const PARTICIPANT_REMOVE = "Remove";

export default function SelectParticipantPermission({
	onChange,
	value,
	className = "w-[240px] h-[44px]",
	inputPadding = "8px",
	isNeedRemove = true,
}: ISelectParticipantPermissionProps) {
	const { t } = useTranslation();
	const ts = (key: string) => t(`courses.${key}`);

	return (
		<TextField
			select
			SelectProps={{
				renderValue: (selected) => <>{ts(`progress.permissions.${selected}`)}</>,
				MenuProps: {
					PaperProps: {
						sx: {
							padding: "8px",
							width: "140px",
							marginTop: "4px",
							borderRadius: "12px",
							"& .MuiList-root": {
								margin: "0px",
								padding: "0px",
								gap: "8px",
								display: "flex",
								flexDirection: "column",
							},
							"& .MuiMenuItem-root": {
								display: "flex",
								alignItems: "center",
								justifyContent: "space-between",
								fontSize: "14px",
								margin: "0px",
								padding: "0px",
								backgroundColor: "transparent !important",
								"&.Mui-selected": {
									color: "#4680FC",
								},
								"&:hover": {
									backgroundColor: "transparent !important",
								},
							},
							"& .MuiMenuItem-root:last-of-type": !isNeedRemove
								? {}
								: {
										borderTop: "1px solid #E6E6EC",
										paddingTop: "8px",
										justifyContent: "start",
								  },
						},
					},
				},
			}}
			className={className}
			inputProps={{
				style: {
					display: "flex",
					alignItems: "center",
					fontSize: "14px",
				},
			}}
			sx={{
				"min-width": "100px",
				"& .MuiSelect-select": {
					alignSelf: "flex-end",
					padding: inputPadding,
					fontSize: "14px",
				},
				"& .MuiInputBase-root": {
					marginBottom: "0px",
					borderRadius: "12px",
					fontSize: "14px",
				},
			}}
			value={value}
			onChange={onChange}
		>
			<MenuItem key={-1} value={PARTICIPANT_PERMISSION_NONE}>
				{ts(`progress.permissions.${PARTICIPANT_PERMISSION_NONE}`)}
				{value === PARTICIPANT_PERMISSION_NONE && <Icon className="ml-2 w-5 h-5" icon={faCheck} />}
			</MenuItem>
			{PARTICIPANT_PERMISSIONS.map((role, index) => (
				<MenuItem key={index} value={role}>
					{ts(`progress.permissions.${role}`)}
					{value === role && <Icon className="ml-2 w-5 h-5" icon={faCheck} />}
				</MenuItem>
			))}
			{isNeedRemove ? (
				<MenuItem key={-2} value={PARTICIPANT_REMOVE}>
					<Icon className="w-5 h-5 mr-2 text-primary-gray-lighter" icon={faTrash} />
					<span className="text-primary-gray-lighter">{ts(`progress.remove`)}</span>
				</MenuItem>
			) : (
				<></>
			)}
		</TextField>
	);
}
