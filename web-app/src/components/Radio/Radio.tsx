import { FunctionComponent, MouseEventHandler } from "react";

import { classNames } from "@/utils/classNames";

interface RadioProps {
	labelClass?: string;
	children?: JSX.Element | JSX.Element[] | string;
	isChecked: boolean;
	onChange?: MouseEventHandler;
	showError?: boolean;
	error?: boolean | string;
	bordered?: boolean;
	testId?: string;
	name?: string;
	className?: string;
	value?: string;
	isDisabled?: boolean;
}

export const Radio: FunctionComponent<RadioProps> = ({
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
	value,
	isDisabled,
}) => {
	return (
		<div
			className={classNames(
				"flex items-center",
				isDisabled ? "cursor-not-allowed opacity-[0.5]" : "cursor-pointer"
			)}
			data-test={testId}
			onClick={!isDisabled ? onChange : undefined}
		>
			<div
				className={classNames(
					"w-5 text-white bg-white h-5 flex items-center justify-center rounded-full border cursor-pointer duration-200",
					isChecked
						? "!color-brand-light border-brand-light"
						: bordered
						? "border-rb-light-gray hover:bg-gray-100"
						: "border-gray-200 hover:bg-gray-100",
					showError && !!error ? "!border-status-error" : "",
					className || ""
				)}
			>
				<div
					className={`w-3.5 h-3.5 ${
						isChecked ? "opacity-1" : "opacity-0"
					} rounded-full bg-brand-light`}
				/>
			</div>
			<input
				readOnly
				aria-label="asd"
				className="hidden"
				disabled={isDisabled ?? false}
				name={name}
				type="radio"
				value={value}
			/>
			{children && (
				<label className={classNames("ml-2 text-sm text-gray-700", labelClass)}> {children}</label>
			)}
		</div>
	);
};
