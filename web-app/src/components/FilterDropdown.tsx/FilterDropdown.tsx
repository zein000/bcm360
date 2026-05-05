import { FunctionComponent, useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import { faChevronDown } from "@fortawesome/pro-regular-svg-icons";

import { classNames } from "@/utils/classNames";

import { Icon } from "../Icon/Icon";
import { ButtonSize } from "../Button/types";

export interface AutoCompleteItem {
	id: number | string | null;
	title: string;
	icon?: JSX.Element;
}

export interface FilterDropdownProps {
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
	className?: string;
}

export const FilterDropdown: FunctionComponent<FilterDropdownProps> = ({
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
	className,
}) => {
	const { t } = useTranslation();
	const [searchValue, setSearchValue] = useState<AutoCompleteItem>();
	const [selectedValue, setSelectedValue] = useState<AutoCompleteItem | undefined>(defaultValue);

	const handleSelectItem = useCallback(
		(selected: AutoCompleteItem) => {
			setSearchValue(selected);
			setSelectedValue(selected);
			handleSelect(selected);
			setShowDropdown(false);
		},
		[handleSelect]
	);

	useEffect(() => {
		if (value) {
			const selected = data.find((item) => item.title === value.title);

			if (selected) {
				setSearchValue(selected);
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
								"flex flex-row items-start py-2.5 px-3 pr-8 text-sm text-left text-gray-900 w-full bg-white hover:bg-gray-100 duration-200 cursor-pointer relative"
							)}
							onClick={() => handleSelectItem(item)}
						>
							{icon} {title}
						</button>
					);
				})}
			</div>
		);
	};

	const handleClickInput = () => setShowDropdown(!showDropdown);

	return (
		<div ref={selectFieldRef} className={classNames("relative w-full", className)}>
			{label && (
				<label className="block mb-2 text-sm font-medium text-gray-900 appearance-none">
					{label}
				</label>
			)}

			<button
				className="relative w-full"
				data-test={testId}
				onClick={!disabled ? handleClickInput : undefined}
			>
				{title ? (
					<div
						className={classNames(
							"input-styles pr-12",
							" w-max inline-flex ",
							"pl-3",
							size && size === ButtonSize.S ? "py-2" : "py-[10px]"
						)}
						data-test="search-input"
					>
						<div className="inline-flex flex-shrink-0 w-full">
							<div className="flex-shrink-0">{t(`${title}`)}</div>
							<div className="flex-shrink-0">
								{selectedValue?.title && `:${selectedValue?.title}`}
							</div>{" "}
						</div>
					</div>
				) : (
					<div
						className={classNames(
							"input-styles flex flex-row pr-8 peer",
							"pl-3",
							size && size === ButtonSize.S ? "py-2" : "py-[10px]",
							size && size === ButtonSize.S ? "!h-[40px]" : ""
						)}
						data-test="search-input"
					>
						{searchValue?.icon} {searchValue?.title || t("basics.pleaseSelect")}
					</div>
				)}

				<div
					className={classNames(
						"absolute right-[14px] top-[11px] text-gray-500 peer-focus:text-brand-light",
						size && size === ButtonSize.S ? "top-[9px]" : ""
					)}
				>
					{/* <img alt="Book icon" className="mt-0.5" src={BookIcon} width={15} /> */}
					<Icon icon={faChevronDown} size="sm" />
				</div>
			</button>

			{showDropdown && (
				<div
					className={classNames(
						"z-[2000] w-full mt-1 overflow-hidden bg-white border border-gray-200 rounded-md max-h-[220px] overflow-y-auto bb-scrollbar-darker",
						floating ? "absolute" : "relative"
					)}
				>
					{renderResults()}
				</div>
			)}
		</div>
	);
};
