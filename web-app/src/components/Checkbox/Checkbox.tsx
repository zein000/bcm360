import { FunctionComponent, MouseEventHandler, useState } from "react";

import CheckIcon from "@assets/icons/check.svg";
import QuestionMarkIcon from "@/assets/icons/question-mark.svg";
import InfoIcon from "@/assets/icons/info.svg";

import { classNames } from "@/utils/classNames";

interface CheckboxProps {
	labelClass?: string;
	children?: JSX.Element | JSX.Element[] | string;
	information?: string | JSX.Element | boolean;
	isChecked: boolean;
	onChange?: MouseEventHandler;
	showError?: boolean;
	error?: boolean | string;
	bordered?: boolean;
	testId?: string;
	className?: string;
	name?: string;
	label?: string;
	icon?: "question-mark" | "information";
	position?: "top" | "bottom" | "right" | "left";
	isDisabled?: boolean;
}

export const Checkbox: FunctionComponent<CheckboxProps> = ({
	children,
	isChecked,
	onChange,
	showError,
	error,
	labelClass = "",
	bordered,
	testId,
	className,
	name,
	label,
	information,
	icon,
	position,
	isDisabled = false,
}) => {
	const [showInformation, setShowInformation] = useState(false);

	return (
		<>
			{label && (
				<div className="relative inline-flex w-auto items-center justify-start mb-2">
					<label
						className={classNames("block text-sm font-medium text-gray-900 appearance-none")}
						htmlFor={name}
					>
						{label}
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

			<div
				className={`${className || ""} flex items-center w-full`}
				data-test={testId}
				onClick={!isDisabled ? onChange : undefined}
			>
				<div
					className={classNames(
						"w-5 text-white bg-white h-5 flex items-center justify-center rounded-md border cursor-pointer duration-200",
						isChecked
							? "!bg-blue-action border-blue-action"
							: bordered
							? "border-rb-light-gray hover:bg-gray-100"
							: "border-gray-200 hover:bg-gray-100",
						showError && !!error ? "!border-status-error" : "",
						isDisabled ? "opacity-50" : ""
					)}
				>
					<img
						alt="CheckIcon"
						className={`w-3 invert ${isChecked ? "opacity-1" : "opacity-0"}`}
						src={CheckIcon}
					/>
				</div>
				<input
					readOnly
					aria-label="asd"
					className="hidden"
					disabled={isDisabled}
					name={name || ""}
					type="checkbox"
				/>
				{children && (
					<label className={classNames("ml-2 -mt-0.5 text-sm text-gray-700", labelClass)}>
						{" "}
						{children}
					</label>
				)}
			</div>
		</>
	);
};
