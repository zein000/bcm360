import { FormLabel, TextField } from "@mui/material";
import { HTMLInputTypeAttribute } from "react";
import { UseFormRegisterReturn } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { ERROR_TYPE, translateError } from "@/utils";

interface IFormTextField {
	label: string;
	errorMessage?: string;
	startAdornment?: JSX.Element;
	endAdornment?: JSX.Element;
	containerClassName?: string;
	formRegister?: UseFormRegisterReturn;
	autoComplete?: string;
	type?: HTMLInputTypeAttribute;
	placeHolder?: string;
	required?: boolean;
}

export default function FormTextField({
	label,
	errorMessage,
	startAdornment,
	containerClassName,
	formRegister,
	autoComplete,
	type,
	placeHolder,
	required = true,
	endAdornment,
}: IFormTextField) {
	const { t } = useTranslation();

	return (
		<div className={`space-y-1 mb-2 relative ${containerClassName}`}>
			<FormLabel
				component="label"
				sx={{
					color: "#1D243C",
					fontSize: "14px",
					fontWeight: "500",
				}}
			>
				{label} {required && <span className="text-red-500">*</span>}
			</FormLabel>
			<TextField
				fullWidth
				InputProps={{
					autoComplete: autoComplete,
					sx: {
						fontSize: "14px",
						color: "#1D243C",
						fontWeight: "400",
						lineHeight: "1.2rem",
						fontFamily: "Urbanist, sans-serif",
						"&:focus-visible": {
							outline: "none",
							inset: "none",
							border: "none",
						},
						paddingY: "5px",
						"& input": {
							paddingY: "5px",
							"&::placeholder": {
								color: "#626373",
								fontSize: "14px",
								fontWeight: "400",
								fontFamily: "Urbanist, sans-serif",
								opacity: 1,
							},
						},
						"&:focus": {
							outline: "none",
							boxShadow: "none",
							inset: "none",
							border: "none",
						},
						backgroundColor: "#fff",
					},
					startAdornment,
					endAdornment,
				}}
				autoComplete={autoComplete}
				className="autofill:bg-white autofill:p-0 autofill:text-[14px] autofill:font-normal autofill:text-[#1D243C] autofill:font-urbanist"
				error={!!errorMessage}
				placeholder={placeHolder ?? t("basics.enter-your") + label}
				sx={{
					"& .MuiOutlinedInput-root": {
						"& fieldset": {
							border: "1px solid #E6E6EC",
						},
						"&:hover fieldset": {
							border: "1px solid #3E478470",
						},
						"&.Mui-focused fieldset": {
							border: "none",
							outline: "none",
							inset: "none",
						},
						borderRadius: "12px",
						"&.Mui-error fieldset": {
							border: "none !important",
							outline: "none !important",
							inset: "none !important",
						},
						fontFamily: "Urbanist, sans-serif",
					},
				}}
				type={type}
				variant="outlined"
				{...(formRegister ?? {})}
			/>
			<p className="absolute -bottom-3 text-[12px] text-[#FF1034]">
				{translateError[errorMessage as unknown as ERROR_TYPE]}
			</p>
		</div>
	);
}
