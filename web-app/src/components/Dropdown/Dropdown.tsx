import { FunctionComponent, useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import { classNames } from "@/utils/classNames";

import { ReactComponent as Tick } from "@assets/icons/inbox/tick.svg";

import { ReactComponent as ChevronUp } from "@assets/icons/inbox/chevron-up.svg";

import { ReactComponent as ChevronDown } from "@assets/icons/inbox/chevron-down.svg";

import { ButtonSize } from "../Button/types";
import { SvgIcon } from "../Icon/SvgIcon";

export interface AutoCompleteItem {
	id: number | string | null;
	title: string;
	icon?: JSX.Element;
}

export interface DropdownProps {
	handleSelect: (value: AutoCompleteItem) => void;
	data: AutoCompleteItem[];
	label?: string;
	title?: string;
	testId?: string;
	floating?: boolean;
	value?: AutoCompleteItem;
	defaultValue?: AutoCompleteItem;
	disabled?: boolean;
	size?: ButtonSize;
	classNameDropdown?: string;
	classNameButton?: string;
	showTickIcon?: boolean;
	closeByClick?: boolean;
}

export const Dropdown: FunctionComponent<DropdownProps> = ({
	handleSelect,
	data,
	label,
	title,
	testId,
	floating,
	value,
	defaultValue,
	disabled,
	size,
	classNameDropdown,
	classNameButton,
	showTickIcon,
	closeByClick = true,
}) => {
	const { t } = useTranslation();
	const [searchValue, setSearchValue] = useState<AutoCompleteItem>();
	const [selectedValue, setSelectedValue] = useState<AutoCompleteItem | undefined>(defaultValue);

	const handleSelectItem = useCallback(
		(selected: AutoCompleteItem) => {
			setSearchValue(selected);
			setSelectedValue(selected);
			handleSelect(selected);
			closeByClick && setShowDropdown(false);
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[handleSelect]
	);

	useEffect(() => {
		if (defaultValue) {
			setSelectedValue(defaultValue);
		} else {
			setSelectedValue(undefined);
		}
	}, [defaultValue]);

	useEffect(() => {
		if (value) {
			const selected = data.find((item) => item.title === value.title);

			if (selected) {
				handleSelectItem(selected);
				setSelectedValue(selected);
			}
		}
	}, [data, handleSelectItem, value]);

	// Dropdown Logic
	const [showDropdown, setShowDropdown] = useState(false);
	const selectFieldRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const handleClick = ({ target }: MouseEvent) => {
			if (!(selectFieldRef.current && selectFieldRef.current?.contains(target as Node))) {
				if (showDropdown) {
					setShowDropdown(false);
				}
			}
		};

		window.addEventListener("click", handleClick);

		return () => window.removeEventListener("click", handleClick);
	}, [selectFieldRef, showDropdown]);

	// Result rendering
	const renderResults = () => {
		const results = data;

		if (!data.length) {
			return <p className="py-2.5 px-3 text-sm italic text-gray-700">{t("basics.noResults")}</p>;
		}

		return (
			<div className={results.length ? "border-b border-b-border items-start" : ""}>
				{results.map((item) => {
					const { id, title, icon } = item;

					return (
						<button
							key={`option-select-${id}`}
							className={classNames(
								"flex flex-row justify-between items-center py-2.5 px-3 text-sm text-left text-gray-900 w-full bg-white hover:bg-gray-100 duration-200 cursor-pointer relative"
							)}
							onClick={() => handleSelectItem(item)}
						>
							<div className="flex flex-row">
								<span className="mr-1">{icon}</span> {title}
							</div>
							{showTickIcon && item.id === selectedValue?.id && (
								<SvgIcon className="w-[20px] h-[20px] text-brand-light" svgIcon={Tick} />
							)}
						</button>
					);
				})}
			</div>
		);
	};

	const handleClickInput = () => setShowDropdown(!showDropdown);

	return (
		<div ref={selectFieldRef} className={classNames("relative ", "w-full")}>
			{label && (
				<label className="block mb-2 text-ssm font-medium text-gray-900 appearance-none">
					{label}
				</label>
			)}

			<button
				className={classNames("relative w-full")}
				data-test={testId}
				onClick={!disabled ? handleClickInput : undefined}
			>
				{title ? (
					<div
						className={classNames(
							"input-styles pr-12",
							" w-max inline-flex ",
							"pl-3",
							size && size === ButtonSize.S ? "py-2" : "py-[10px]",
							classNameButton
						)}
						data-test="search-input"
					>
						<div className="inline-flex flex-shrink-0 w-full">
							<div className="flex-shrink-0">{t(`${title}`)}</div>
							<div className="flex-shrink-0">
								{selectedValue?.title && `: ${selectedValue?.title}`}
							</div>{" "}
						</div>
						<div
							className={classNames(
								"absolute right-[10px] top-[50%] translate-y-[-50%] peer-focus:text-brand-light",
								size && size === ButtonSize.S ? "top-[9px]" : ""
							)}
						>
							<SvgIcon
								className="w-[20px] h-[20px]"
								svgIcon={showDropdown ? ChevronUp : ChevronDown}
							/>
						</div>
					</div>
				) : (
					<div
						className={classNames(
							"input-styles flex flex-row pr-8 peer",
							"pl-3",
							size && size === ButtonSize.S ? "py-2" : "py-[10px]",
							size && size === ButtonSize.S ? "!h-[40px]" : "",
							classNameButton
						)}
						data-test="search-input"
					>
						{searchValue?.icon}{" "}
						{searchValue?.title || selectedValue?.title || t("basics.pleaseSelect")}
						<div
							className={classNames(
								"absolute right-[10px] top-[50%] translate-y-[-50%] transform text-gray-500 peer-focus:text-brand-light",
								size && size === ButtonSize.S ? "top-[9px]" : ""
							)}
						>
							<SvgIcon
								className="w-[20px] h-[20px]"
								svgIcon={showDropdown ? ChevronUp : ChevronDown}
							/>
						</div>
					</div>
				)}
			</button>

			{showDropdown && (
				<div
					className={classNames(
						classNameDropdown ? classNameDropdown : "w-full",
						"z-[2000] mt-1 overflow-hidden bg-white border border-gray-200 rounded-md max-h-[320px] overflow-y-auto bb-scrollbar-darker",
						floating ? "absolute" : "relative"
					)}
				>
					{renderResults()}
				</div>
			)}
		</div>
	);
};
