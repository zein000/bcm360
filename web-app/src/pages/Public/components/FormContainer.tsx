import { useEffect, useState } from "react";

import { useTranslation } from "react-i18next";

import { Button } from "@/components/Button/Button";
import { ButtonColor, ButtonSize } from "@/components/Button/types";
import { ERROR_TYPE, translateError } from "@/utils";
import AppLogo from "@/assets/images/favicon.png";

interface FormContainerProps {
	children: React.ReactNode;
	formFooter?: React.ReactNode;
	icon?: React.ReactNode;
	submitButtonText: string;
	isLoading: boolean;
	handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
	title: string;
	description: string;
	hideActions?: boolean;
	secondaryButtonText?: string;
	secondaryButtonAction?: () => void;
	formContainerClassName?: string;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	formError?: any;
}

export default function FormContainer({
	children,
	submitButtonText,
	isLoading,
	description,
	title,
	handleSubmit,
	formFooter = <></>,
	icon = <img alt="logo" className="w-[38px] h-[15px] text-primary-blue" src={`${AppLogo}`} />,
	hideActions = false,
	secondaryButtonAction,
	secondaryButtonText,
	formContainerClassName = "-mt-32",
	formError,
}: FormContainerProps) {
	const [error, setFormError] = useState<string>();
	const { t } = useTranslation();

	useEffect(() => {
		if (formError?.data?.message) {
			setFormError(
				translateError[formError?.data?.message?.toUpperCase() as unknown as ERROR_TYPE] ??
					t("basics.request-error")
			);
		} else if (typeof formError === "string") {
			setFormError(formError);
		}
	}, [formError, t]);

	return (
		<form
			className={`p-1 ${
				hideActions ? "" : "pb-4"
			} relative bg-[#F7F8FB] font-urbanist rounded-[20px] w-[600px] border border-[#E6E6EC] flex flex-col gap-4 ${formContainerClassName}`}
			onSubmit={handleSubmit}
		>
			<div className="absolute w-[300px] h-[300px] -z-20 -top-[120px] left-1/2 -translate-x-1/2 bg-gradient-to-b from-white to-[#4680FC] rounded-full blur-3xl opacity-50" />
			<div className="bg-white p-6 shadow-sm rounded-16">
				<div className="mb-4 w-[44px] flex items-center justify-center shadow-medium h-[44px] rounded-xl border-[0.28px] border-[#E6E6EC]">
					{icon}
				</div>
				<h2 className="mb-[6px] text-primary-gray text-[28px] leading-[34px] font-bold">{title}</h2>
				<p className="text-primary-gray-lighter text-[14px] leading-[20px] mb-6">{description}</p>
				{children}
				{formFooter}
			</div>
			{!hideActions || (submitButtonText && secondaryButtonText) ? (
				<div className="px-3 space-y-2">
					{submitButtonText && (
						<Button
							className="!h-[44px]"
							isLoading={isLoading}
							size={ButtonSize.ML}
							title={submitButtonText}
							type="submit"
						/>
					)}
					{secondaryButtonText && secondaryButtonAction && (
						<Button
							className="!h-[44px]"
							color={ButtonColor.ACTION_SECONDARY}
							isLoading={isLoading}
							size={ButtonSize.ML}
							title={secondaryButtonText}
							type="submit"
							onClick={secondaryButtonAction}
						/>
					)}
				</div>
			) : (
				<></>
			)}
			{error && (
				<p className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-[14px] text-[#FF1034]">
					{error}
				</p>
			)}
		</form>
	);
}
