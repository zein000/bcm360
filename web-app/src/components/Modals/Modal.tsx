import { FunctionComponent, ReactNode } from "react";
import { Dialog, DialogActions, DialogContent } from "@mui/material";

import { useTranslation } from "react-i18next";
import { Stack } from "@mui/system";

import { faClose } from "@fortawesome/pro-regular-svg-icons";

import { classNames } from "@/utils/classNames";

import { Button } from "../Button/Button";
import { ButtonColor } from "../Button/types";
import { Checkbox } from "../Checkbox/Checkbox";
import { Icon } from "../Icon/Icon";

interface ModalProps {
	children: ReactNode;
	title: string;
	subtitle?: string;
	isOpened: boolean;
	handleClose?: () => void;
	handleClear?: () => void;
	handleSave?: () => void;
	handleThirdSave?: () => void;
	handleSecondSave?: () => void;
	secondSubmitButtonText?: string;
	cancelButtonText?: string;
	thirdSubmitButtonText?: string;
	isLoading?: boolean;
	submitButtonText?: string;
	submitButtonColor?: string;
	clearButtonText?: string;
	clearButtonColor?: string;
	size?: "xs" | "sm" | "md" | "lg" | "xl";
	overflow?: boolean;
	checkbox?: boolean;
	handleCheckboxClick?: () => void;
	checkboxLabel?: string;
	disableSave?: boolean;
	aboveHeader?: ReactNode;
	submitButtonIcon?: JSX.Element;
	showActions?: boolean;
	dialogContentClassName?: string;
	saveButtonContainerClassName?: string;
	saveButtonClassName?: string;
	modalContainerClassName?: string;
}

export const Modal: FunctionComponent<ModalProps> = ({
	title,
	subtitle,
	children,
	isOpened,
	handleClose,
	handleSave,
	handleSecondSave,
	handleThirdSave,
	checkbox,
	handleCheckboxClick,
	secondSubmitButtonText,
	thirdSubmitButtonText,
	submitButtonText,
	submitButtonColor,
	isLoading = false,
	size = "xs",
	handleClear,
	clearButtonText,
	clearButtonColor,
	overflow,
	checkboxLabel,
	disableSave,
	aboveHeader,
	submitButtonIcon,
	showActions = true,
	dialogContentClassName = "",
	cancelButtonText,
	saveButtonContainerClassName,
	saveButtonClassName,
	modalContainerClassName,
}) => {
	const { t } = useTranslation();

	const cssForOverflow = overflow
		? {
				"& .MuiDialogContent-root": {
					overflow: "visible",
				},
		  }
		: {};

	return (
		<Dialog
			fullWidth
			maxWidth={size}
			open={isOpened}
			sx={{
				overflow: "visible!important",
				"& .MuiDialog-paper": {
					borderRadius: "2xl",
					overflow: "visible",
				},
				"& .MuiDialogContent-root": {
					overflowY: "auto",
				},
				...cssForOverflow,
			}}
			onAbort={handleClose}
			onClose={handleClose ? handleClose : handleSave}
		>
			<Button
				className="bg-white !w-11 !h-11 !p-0 border-0 absolute !rounded-lg -top-11 -right-11"
				image={<Icon className="text-primary-gray w-5 h-5" icon={faClose} />}
				title=""
				onClick={() => (handleClose ? handleClose?.() : handleSave?.())}
			/>
			<div className={`!p-1 !bg-[#F7F8FB] !rounded-[20px] ${modalContainerClassName}`}>
				<div className="bg-white rounded-16 p-4 shadow-[0px_1px_2px_0px_rgba(28,39,76,0.12)]">
					{aboveHeader}
					{title && (
						<div
							className={
								aboveHeader
									? `text-ssmd mx-6 mt-[6.5rem] mb-1 z-1 font-bold`
									: `text-md mx-6 mt-6 mb-1`
							}
						>
							{title}
						</div>
					)}
					{subtitle && <div className="text-sm mx-6 mt-1 mb-4">{subtitle ?? ""}</div>}

					<DialogContent
						className={`custom-scrollbar ${dialogContentClassName}`}
						sx={{ pt: 2, pb: 4, height: "fit-content", overflow: "auto" }}
					>
						{children}
					</DialogContent>
				</div>
				{showActions && (
					<DialogActions sx={{ px: 3, py: 2, overflow: "visible" }}>
						{handleCheckboxClick && typeof checkbox === "boolean" && (
							<div className="w-[150px] flex items-center">
								<Checkbox
									className="whitespace-nowrap"
									isChecked={checkbox}
									onChange={handleCheckboxClick}
								>
									{checkboxLabel}
								</Checkbox>
							</div>
						)}
						<div
							className={classNames(
								"w-full flex",
								"justify-between"
								// handleClear && handleSave ? "justify-between" : "justify-end"
							)}
						>
							{handleClear && (
								<div className="w-[150px]">
									<Button
										color={
											clearButtonColor
												? (clearButtonColor as ButtonColor)
												: ButtonColor.ACTION_SECONDARY
										}
										title={clearButtonText ?? t("basics.clear")}
										onClick={handleClear}
									/>
								</div>
							)}
							<Stack
								alignItems="center"
								className="w-full"
								direction="row"
								flexWrap="wrap"
								justifyContent="center"
								spacing={2}
							>
								{handleClose && (
									<div className="w-[180px]">
										<Button
											color={ButtonColor.ACTION_SECONDARY}
											title={cancelButtonText ?? t("basics.cancel")}
											onClick={handleClose}
										></Button>
									</div>
								)}

								{handleSecondSave && (
									<div className="w-[220px]">
										<Button
											color={ButtonColor.ACTION_SECONDARY}
											isLoading={isLoading}
											title={secondSubmitButtonText ?? t("basics.saveChanges")}
											onClick={handleSecondSave}
										></Button>
									</div>
								)}

								{handleThirdSave && (
									<div className="w-[220px]">
										<Button
											color={ButtonColor.ACTION_SECONDARY}
											isLoading={isLoading}
											title={thirdSubmitButtonText ?? t("basics.saveChanges")}
											onClick={handleThirdSave}
										></Button>
									</div>
								)}

								{handleSave && (
									<div className={`w-[180px] ${saveButtonContainerClassName ?? ""}`}>
										<Button
											className={saveButtonClassName}
											color={
												submitButtonColor ? (submitButtonColor as ButtonColor) : ButtonColor.ACTION
											}
											disabled={isLoading || disableSave}
											image={submitButtonIcon}
											isLoading={isLoading}
											title={submitButtonText ?? t("basics.saveChanges")}
											onClick={handleSave}
										></Button>
									</div>
								)}
							</Stack>
						</div>
					</DialogActions>
				)}
			</div>
		</Dialog>
	);
};
