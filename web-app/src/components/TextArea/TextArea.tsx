import {
	ChangeEventHandler,
	FocusEventHandler,
	FunctionComponent,
	RefObject,
	useState,
} from "react";
import TextareaAutosize from "react-textarea-autosize";

import QuestionMarkIcon from "@/assets/icons/question-mark.svg";
import { classNames } from "@/utils/classNames";

interface TextAreaProps {
	value: string;
	placeholder?: string;
	handleChange?: ChangeEventHandler<HTMLTextAreaElement>;
	name: string;
	error?: boolean | string;
	touched?: boolean;
	showError: boolean;
	handleBlur?: FocusEventHandler<HTMLTextAreaElement>;
	label?: string;
	information?: string;
	isOptional?: boolean;
	maxLength?: number;
	className?: string;
	onKeyDown?: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
	ref?: RefObject<HTMLTextAreaElement>;
	disabled?: boolean;
	labelClassName?: string;
	errorMessage?: string;
	containerClassName?: string;
	mainContainerClassName?: string;
}

export const TextArea: FunctionComponent<TextAreaProps> = ({
	value,
	placeholder,
	handleChange,
	name,
	error,
	showError,
	touched,
	handleBlur,
	label,
	information,
	isOptional,
	maxLength,
	className,
	onKeyDown,
	ref,
	disabled,
	labelClassName,
	errorMessage = "",
	containerClassName,
	mainContainerClassName,
}) => {
	const [showInformation, setShowInformation] = useState(false);

	return (
		<div className={mainContainerClassName}>
			{label && (
				<div className="relative flex w-full items-center justify-between mb-[6px]">
					<label
						className={classNames(
							"block label-styles text-[14px] font-bold text-primary-gray appearance-none",
							labelClassName
						)}
						htmlFor={name}
					>
						{label}
						{isOptional && " (Optional)"}
					</label>
					{information && (
						<img
							alt="Question mark icon"
							className="w-4 h-4 ml-2 text-gray-500 cursor-pointer hover:text-brand-light"
							src={QuestionMarkIcon}
							onMouseLeave={() => setShowInformation(false)}
							onMouseOver={() => setShowInformation(true)}
						/>
					)}
					{showInformation && (
						<p className="absolute bottom-7 right-0 left-20 bg-white shadow-all p-3 rounded-md text-xs">
							{information}
						</p>
					)}
				</div>
			)}
			<div className={`relative w-full ${containerClassName}`}>
				<TextareaAutosize
					ref={ref}
					className={classNames(
						"sm:shadow-mb-card sm:border-none",
						"input-styles resize-none w-full min-h-[300px] py-2 px-3",
						showError && error ? "border-status-error" : "",
						touched && !error ? "border-status-success" : "",
						!!maxLength && "pb-6",
						className || ""
					)}
					disabled={disabled}
					maxLength={maxLength}
					minRows={1}
					name={name}
					placeholder={placeholder}
					value={value}
					onBlur={handleBlur}
					onChange={handleChange}
					onKeyDown={onKeyDown}
				/>
				{maxLength && (
					<p className="absolute right-2 bottom-2 text-xs text-gray-500">{value.length}/500</p>
				)}
				{errorMessage && (
					<p className="absolute text-[#F04438] text-[14px] -bottom-5 left-2">{errorMessage}</p>
				)}
			</div>
		</div>
	);
};
