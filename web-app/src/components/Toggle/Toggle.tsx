import { FunctionComponent, MouseEventHandler } from "react";

import { classNames } from "@/utils/classNames";

interface CheckboxProps {
	labelClass?: string;
	children?: JSX.Element | JSX.Element[] | string;
	isChecked: boolean;
	onChange?: MouseEventHandler;
	showError?: boolean;
	error?: boolean | string;
	testId?: string;
	className?: string;
	name?: string;
}

export const Toggle: FunctionComponent<CheckboxProps> = ({
	children,
	isChecked,
	onChange,
	showError,
	error,
	labelClass = "",
	testId,
	className,
	name,
}) => {
	return (
		<div
			className={classNames(
				className || "",
				"flex items-center w-[38px] px-[4px] h-[22px] rounded-full bg-gray-200 cursor-pointer duration-200",
				isChecked ? "justify-end" : ""
			)}
			data-test={testId}
			onClick={onChange}
		>
			<div
				className={classNames(
					"w-4 text-white bg-white h-4 flex items-center justify-center rounded-full cursor-pointer duration-200",
					isChecked ? "!bg-brand-light" : "border-gray-200 hover:bg-gray-100",
					showError && !!error ? "!border-status-error" : ""
				)}
			></div>
			<input readOnly aria-label="asd" className="hidden" name={name || ""} type="checkbox" />
			{children && (
				<label className={classNames("ml-3 -mt-0.5 text-sm text-gray-700", labelClass)}>
					{" "}
					{children}
				</label>
			)}
		</div>
	);
};
