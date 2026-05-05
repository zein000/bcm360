import { FunctionComponent, MouseEventHandler, ReactElement } from "react";
import { useTranslation } from "react-i18next";

import { classNames } from "@/utils/classNames";

import { Spinner } from "../Spinner/Spinner";
import { ButtonColor, ButtonSize, ButtonStatus, FontSize } from "./types";

interface ButtonProps {
	title: string;
	onClick?: MouseEventHandler;
	type?: "submit" | "reset" | "button";
	disabled?: boolean;
	disabledInGray?: boolean;
	status?: ButtonStatus;
	color?: ButtonColor;
	size?: ButtonSize;
	fontSize?: FontSize;
	isLoading?: boolean;
	image?: ReactElement;
	className?: string;
	testId?: string;
	iconRight?: boolean;
}

export const Button: FunctionComponent<ButtonProps> = ({
	title,
	onClick,
	type = "submit",
	status,
	disabled,
	disabledInGray,
	isLoading,
	color = ButtonColor.BRAND,
	fontSize = FontSize.SM,
	size = ButtonSize.M,
	image,
	className,
	testId,
	iconRight,
}) => {
	const { t } = useTranslation();
	const getStatusClasses = () => {
		switch (status) {
			case ButtonStatus.SUCCESS:
				return "!border-brand-light !bg-transparent !text-brand-light";
			case ButtonStatus.ACTION:
				return "!border-blue-action !bg-white !text-blue-action";
		}
	};

	const getColorClasses = () => {
		switch (color) {
			case ButtonColor.BRAND:
				return "bg-primary-blue text-white border-transparent";
			case ButtonColor.ACTION:
				return "bg-primary-blue text-white border-transparent hover:bg-primary-blue-hover";
			case ButtonColor.PRIMARY:
				return "bg-primary-green text-white";
			case ButtonColor.ACTION_SECONDARY:
				return classNames(
					"bg-white border border-gray-200 text-text",
					disabledInGray ? "disabled:!border-gray-300 disabled:!bg-transparent" : ""
				);
			case ButtonColor.DANGER:
			case ButtonColor.ERROR:
				return "bg-status-error border-status-error text-white";
			case ButtonColor.DANGER_SECONDARY:
				return "bg-white border-status-error text-status-error";
			case ButtonColor.WARNING:
				return "bg-status-warning text-white border-transparent";
			case ButtonColor.SUCCESS:
				return "bg-status-success text-white";
			case ButtonColor.DISABLED:
				return "bg-status-disabled text-gray-500 border-transparent";
			case ButtonColor.DECISION:
				return "border border-[#E6E6EC] bg-primary-green text-white rounded-xl";
		}
	};

	const getSizeClasses = () => {
		switch (size) {
			case ButtonSize.XXS:
				return "h-[24px] w-[24px] px-1 text-xs";
			case ButtonSize.XS:
				return "h-[28px] px-2 text-xs";
			case ButtonSize.S:
				return "h-[32px] px-4 text-xs";
			case ButtonSize.M:
				return "h-[38px] px-4";
			case ButtonSize.ML:
				return "h-[42px] px-4";
			case ButtonSize.L:
				return "h-[48px] px-6";
		}
	};

	const getFontSizeClasses = () => {
		switch (fontSize) {
			case FontSize.XS:
				return "text-xs";
			case FontSize.SM:
				return "text-sm";
			case FontSize.M:
				return "text-[16px]";
			default:
				return "";
		}
	};

	return (
		<button
			className={classNames(
				"appearance-none text-center font-semibold rounded-[10px] w-full border duration-200 shadow-sm",
				getColorClasses(),
				status ? getStatusClasses() : "",
				getSizeClasses(),
				getFontSizeClasses(),
				disabled ? "opacity-60" : "",
				disabledInGray ? "disabled:bg-gray-300 disabled:text-gray-500" : "",
				className || ""
			)}
			data-clicktarget="tableaction"
			data-test={testId}
			disabled={isLoading || disabled}
			type={type}
			onClick={onClick}
		>
			{isLoading ? (
				<div className="flex items-center justify-center">
					<Spinner />
					<div className="ml-3 whitespace-nowrap">{t("basics.wait")}</div>
				</div>
			) : (
				<div className="flex items-center justify-center max-w-full overflow-hidden text-center whitespace-nowrap text-ellipsis">
					{iconRight ? (
						<>
							{title}
							{image}
						</>
					) : (
						<>
							{image}
							{title}
						</>
					)}
				</div>
			)}
		</button>
	);
};
