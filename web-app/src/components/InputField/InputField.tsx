import {
	ChangeEventHandler,
	FocusEventHandler,
	FunctionComponent,
	useState,
	HTMLInputTypeAttribute,
} from "react";

import { IconDefinition } from "@fortawesome/pro-regular-svg-icons";

import QuestionMarkIcon from "@/assets/icons/question-mark.svg";
import InfoIcon from "@/assets/icons/info.svg";

import { classNames } from "@/utils/classNames";

import { Icon } from "..";

interface InputProps {
	value: string | number;
	handleChange?: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>;
	label?: string;
	type?: HTMLInputTypeAttribute;
	information?: string | JSX.Element | boolean;
	placeholder?: string;
	isOptional?: boolean;
	handleBlur?: FocusEventHandler | ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>;
	name: string;
	touched?: boolean;
	error?: string | boolean;
	showError?: boolean;
	isDisabled?: boolean;
	autocompleteValue?: string;
	onClick?: () => void;
	testId?: string;
	icon?: "question-mark" | "information" | IconDefinition;
	iconInside?: string | JSX.Element;
	position?: "top" | "bottom" | "right" | "left";
	className?: string;
	onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
	autoFocus?: boolean;
	multiline?: boolean;
	errorMessage?: string;
	containerClassName?: string;
}

export const InputField: FunctionComponent<InputProps> = ({
	isDisabled = false,
	value,
	isOptional,
	handleChange,
	label,
	type = "text",
	information,
	placeholder,
	handleBlur,
	name,
	error = false,
	touched,
	showError = true,
	autocompleteValue,
	onClick,
	testId,
	icon = "question-mark",
	iconInside,
	position = "top",
	className,
	onKeyDown,
	autoFocus = false,
	multiline = false,
	errorMessage = "",
	containerClassName = "mb-3 grow",
}) => {
	const [showInformation, setShowInformation] = useState(false);

	return (
		<div className={containerClassName}>
			{label && (
				<div className="relative flex items-center justify-between mb-[2px]">
					<label
						className={classNames(
							"capitalize block text-[14px] font-bold text-primary-gray appearance-none"
						)}
						htmlFor={name}
					>
						{label}
						{isOptional && " (Optional)"}
					</label>
					{information && (
						<div onMouseOver={() => setShowInformation(true)}>
							{icon === "question-mark" && (
								<img
									alt="tst"
									className="w-4 h-4 ml-2 text-gray-500 cursor-pointer hover:text-brand-light"
									src={QuestionMarkIcon}
								/>
							)}
							{icon === "information" && (
								<img
									alt="InfoIcon"
									className="w-4 h-4 ml-2 text-gray-500 cursor-pointer hover:text-brand-light"
									src={InfoIcon}
								/>
							)}
							{typeof icon !== "string" && icon ? <Icon icon={icon} /> : ""}
						</div>
					)}
					{showInformation && (
						<p
							className={classNames(
								"absolute right-0 left-20 bg-white shadow-all p-3 rounded-md text-xs z-10",
								position === "top" && "-top-[80px]",
								position === "bottom" && "-top-[20px] z-10"
							)}
							onMouseLeave={() => setShowInformation(false)}
						>
							{information}
						</p>
					)}
				</div>
			)}
			<div className="relative">
				{multiline ? (
					<textarea
						autoComplete={autocompleteValue || "off"}
						autoFocus={autoFocus}
						className={classNames(
							"sm:shadow-mb-card sm:border-none",
							"input-styles",
							"placeholder-placeholder",
							"text-ssm font-normal",
							"py-3 px-4 w-full", // Added padding to account for icon
							iconInside ? "pl-10" : "pl-3",
							showError && !!error ? "!border-status-error" : "",
							touched && !error ? "!border-status-success" : "",
							isDisabled && "!border-border cursor-not-allowed opacity-[0.5]",
							className || ""
						)}
						data-test={testId}
						disabled={isDisabled}
						name={name}
						placeholder={placeholder}
						rows={4}
						value={value}
						onBlur={handleBlur}
						onChange={handleChange}
						onClick={onClick}
						onKeyDown={onKeyDown}
					/>
				) : (
					<input
						autoComplete={autocompleteValue || "off"}
						autoFocus={autoFocus}
						className={classNames(
							"sm:shadow-mb-card",
							"input-styles",
							"placeholder-placeholder",
							"text-ssm font-normal",
							"py-3 px-4 w-full", // Added padding to account for icon
							iconInside ? "pl-10" : "pl-3",
							showError && !!error ? "!border-status-error" : "",
							touched && !error ? "!border-status-success" : "",
							isDisabled && "!border-border cursor-not-allowed opacity-[0.5]",
							className || ""
						)}
						data-test={testId}
						disabled={isDisabled}
						name={name}
						placeholder={placeholder}
						type={type}
						value={value}
						onBlur={handleBlur}
						onChange={handleChange}
						onClick={onClick}
						onKeyDown={onKeyDown}
					/>
				)}
				{iconInside && (
					<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
						{typeof iconInside === "string" ? (
							<img alt="Icon" className="w-5 h-5" src={iconInside} />
						) : (
							iconInside
						)}
					</div>
				)}
				{showError && errorMessage && (
					<p className="absolute text-[#F04438] text-[14px] -bottom-5 left-2">{errorMessage}</p>
				)}
			</div>
		</div>
	);
};
