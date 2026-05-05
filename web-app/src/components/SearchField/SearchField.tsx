import { ChangeEventHandler, FocusEventHandler, FunctionComponent } from "react";

import { faSearch } from "@fortawesome/pro-regular-svg-icons";

import CloseIcon from "@/assets/icons/close.svg";
import { classNames } from "@/utils/classNames";

import { Icon } from "../Icon/Icon";

interface InputProps {
	value: string;
	handleChange: ChangeEventHandler<HTMLInputElement>;
	placeholder?: string;
	handleBlur?: FocusEventHandler;
	name: string;
	onClick?: () => void;
	icon?: JSX.Element;
	image?: JSX.Element;
	iconPosition?: "left" | "right";
	disabled?: boolean;
	isError?: boolean;
	handleReset?: () => void;
	testId?: string;
	className?: string;
}

export const SearchField: FunctionComponent<InputProps> = ({
	value,
	handleChange,
	placeholder,
	handleBlur,
	name,
	onClick,
	icon,
	image,
	iconPosition,
	disabled,
	isError,
	handleReset,
	testId,
	className,
}) => {
	return (
		<>
			<div className="relative" data-test={testId} onClick={onClick}>
				<input
					autoComplete="off"
					className={classNames(
						"input-styles pr-8 peer",
						icon ? "pl-16" : "",
						image ? "pl-16" : "",
						isError && "border-status-error"
					)}
					data-test="search-input"
					disabled={disabled}
					name={name}
					placeholder={placeholder}
					type="text"
					value={value}
					onBlur={handleBlur}
					onChange={handleChange}
				/>
				{!!icon && (
					<div
						className={classNames(
							"absolute flex left-[14px] top-[14px] text-gray-500 peer-focus:text-brand-light",
							className
						)}
					>
						{icon}
					</div>
				)}
				{!!image && (
					<div
						className={classNames(
							"absolute flex left-[0] top-[0] text-gray-500 peer-focus:text-brand-light",
							className
						)}
					>
						{image}
					</div>
				)}
				{handleReset && !!value ? (
					<div className="absolute right-[14px] top-[50%] translate-y-[-50%] transform text-gray-500 peer-focus:text-brand-light cursor-pointer hover:text-brand-light">
						<img alt="closeicon" id="closeIcon" src={CloseIcon} width={12} onClick={handleReset} />
					</div>
				) : (
					<>
						{iconPosition !== "left" && (
							<div
								className={classNames(
									"absolute flex mt-0.5 right-[14px] top-[14px] text-gray-500 peer-focus:text-brand-light"
								)}
							>
								<Icon className="h-[16px]" icon={faSearch} />
							</div>
						)}
					</>
				)}
			</div>
		</>
	);
};
