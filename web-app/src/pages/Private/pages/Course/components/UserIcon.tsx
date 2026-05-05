import { faEllipsis, faQuestion } from "@fortawesome/pro-regular-svg-icons";
import { useMemo } from "react";

import { Icon } from "@/components";

interface IUserIconProps {
	firstName?: string;
	lastName?: string;
	isOnline?: boolean;
	size?: UserIconSize;
	containerClassName?: string;
	isHidden?: boolean;
	isEmpty?: boolean;
	emptyLabel?: string;
	isStatusHidden?: boolean;
}

export enum UserIconSize {
	SuperSmall = "SUPER_SMALL",
	Small = "SMALL",
	Large = "LARGE",
	Medium = "MEDIUM",
}

export default function UserIcon({
	firstName,
	lastName,
	isOnline = true,
	size = UserIconSize.Large,
	containerClassName = "",
	isHidden = false,
	isEmpty = false,
	emptyLabel,
	isStatusHidden,
}: IUserIconProps) {
	const firstNameLetter = firstName?.[0]?.toUpperCase();
	const lastNameLetter = lastName ? lastName?.[0]?.toUpperCase() : "";

	const { statusWidth, statusHeight, iconWidth, iconHeight, textSize, padding } = useMemo(() => {
		switch (size) {
			case UserIconSize.Large:
				return {
					statusWidth: 10,
					statusHeight: 10,
					iconWidth: 44,
					iconHeight: 44,
					textSize: 16,
					padding: 8,
				};
			case UserIconSize.Small:
				return {
					statusWidth: 6,
					statusHeight: 6,
					iconWidth: 24,
					iconHeight: 24,
					textSize: 9,
					padding: 0,
				};
			case UserIconSize.SuperSmall:
				return {
					statusWidth: 4,
					statusHeight: 4,
					iconWidth: 20,
					iconHeight: 20,
					textSize: 9,
					padding: 0,
				};
			case UserIconSize.Medium:
				return {
					statusWidth: 8,
					statusHeight: 8,
					iconWidth: 32,
					iconHeight: 32,
					textSize: 14,
					padding: 4,
				};
			default:
				return {
					statusWidth: 10,
					statusHeight: 10,
					iconWidth: 40,
					iconHeight: 40,
					textSize: 16,
					padding: 8,
				};
		}
	}, [size]);

	return (
		<p
			className={`relative flex items-center justify-center text-center font-semibold rounded-xl hover:cursor-default ${
				!isHidden && "bg-white text-primary-gray-lighter border border-[#E6E6EC]"
			} ${containerClassName}`}
			style={{
				width: `${iconWidth}px`,
				height: `${iconHeight}px`,
				fontSize: `${textSize}px`,
				padding: `${padding}px`,
			}}
		>
			{!isEmpty ? (
				<>
					{!isHidden ? (
						<>
							{firstName && lastName ? (
								firstNameLetter + lastNameLetter
							) : (
								<Icon icon={faQuestion} />
							)}
							{!isStatusHidden && (
								<>
									{isOnline ? (
										<span
											className="absolute left-1/2 -translate-x-1/2 -bottom-1 border-2 border-white rounded-full"
											style={{
												width: `${statusWidth}px`,
												height: `${statusHeight}px`,
												backgroundColor: "#17B26A",
											}}
										></span>
									) : (
										<span
											className={
												"absolute left-1/2 -translate-x-1/2 -bottom-1 border-2 border-white rounded-full"
											}
											style={{
												width: `${statusWidth}px`,
												height: `${statusHeight}px`,
												backgroundColor: "#98A2B3",
											}}
										></span>
									)}
								</>
							)}
						</>
					) : (
						<></>
					)}
				</>
			) : (
				<>
					{emptyLabel ? (
						<p className="text-[14px] text-primary-gray">{emptyLabel ?? "+2"}</p>
					) : (
						<Icon icon={faEllipsis} />
					)}
				</>
			)}
		</p>
	);
}
