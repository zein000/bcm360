import { FunctionComponent, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import { classNames } from "@/utils/classNames";

import { ReactComponent as Tick } from "@assets/icons/inbox/tick.svg";

import { ReactComponent as ChevronUp } from "@assets/icons/inbox/chevron-up.svg";

import { ReactComponent as ChevronDown } from "@assets/icons/inbox/chevron-down.svg";

import { ButtonSize } from "../Button/types";
import { SvgIcon } from "../Icon/SvgIcon";
import { Checkbox } from "../Checkbox/Checkbox";

export interface DropdownWithCheckboxesItem {
	id: number | string | null;
	title: string;
	icon?: JSX.Element;
}

export interface DropdownWithCheckboxesState {
	id: number | string | null;
	title: string;
	icon?: JSX.Element;
	checked: boolean;
}

export interface DropdownWithCheckboxesProps {
	handleSelect: (value: DropdownWithCheckboxesItem[]) => void;
	data: DropdownWithCheckboxesItem[];
	label?: string;
	title?: string;
	testId?: string;
	floating?: boolean;
	value?: DropdownWithCheckboxesItem[];
	defaultValue?: DropdownWithCheckboxesItem[];
	disabled?: boolean;
	size?: ButtonSize;
	classNameDropdown?: string;
	classNameButton?: string;
	showTickIcon?: boolean;
	closeByClick?: boolean;
}

export const DropdownWithCheckboxes: FunctionComponent<DropdownWithCheckboxesProps> = ({
	handleSelect,
	data,
	label,
	title,
	testId,
	floating,
	defaultValue,
	disabled,
	size,
	classNameDropdown,
	classNameButton,
	showTickIcon,
}) => {
	const { t } = useTranslation();
	const [selectedValue, setSelectedValue] = useState<DropdownWithCheckboxesState[] | undefined>(
		data?.map((item) => ({
			...item,
			checked: defaultValue?.map((d) => d.id)?.includes(item.id) || false,
		})) as DropdownWithCheckboxesState[]
	);

	const selectedValues = useMemo(() => {
		if (selectedValue) {
			return selectedValue.filter((item) => item.checked);
		}

		return [];
	}, [selectedValue]);
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
				{selectedValue?.map((item) => {
					const { id, title } = item;

					return (
						<div
							key={`option-select-${id}`}
							className={classNames(
								"flex flex-row justify-between items-center py-2.5 px-3 text-sm text-left text-gray-900 w-full bg-white hover:bg-gray-100 duration-200 cursor-pointer relative"
							)}
						>
							<div className="flex flex-row">
								<Checkbox
									className="mr-1"
									isChecked={item.checked}
									onChange={() => {
										const updatedSelectedValue = selectedValue?.map((v) => {
											if (v.id === item.id) {
												return {
													...v,
													checked: !item.checked,
												};
											}

											return v;
										});

										const selected = updatedSelectedValue?.filter((v) => v.checked);

										if (selected.length >= 1) {
											setSelectedValue(updatedSelectedValue);
											handleSelect(selected);
										}
									}}
								>
									{title}
								</Checkbox>
							</div>

							{showTickIcon && item.id === selectedValue?.[0]?.id && (
								<SvgIcon className="w-[20px] h-[20px] text-brand-light" svgIcon={Tick} />
							)}
						</div>
					);
				})}
			</div>
		);
	};

	const handleClickInput = () => setShowDropdown(!showDropdown);

	return (
		<div ref={selectFieldRef} className={classNames("relative ", "w-full")}>
			{label && (
				<label className="block mb-2 text-sm font-medium text-gray-900 appearance-none">
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
								{selectedValues.length > 1
									? `: ${selectedValues.length}`
									: `: ${selectedValues?.[0].title}`}
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
						{selectedValues.length > 1
							? `${selectedValues.length}`
							: (selectedValues?.[0]?.title && `:${selectedValues?.[0]?.title}`) ||
							  t("basics.pleaseSelect")}
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
						"z-[2000] mt-1 overflow-hidden bg-white border border-gray-200 rounded-md max-h-[220px] overflow-y-auto bb-scrollbar-darker",
						floating ? "absolute" : "relative"
					)}
				>
					{renderResults()}
				</div>
			)}
		</div>
	);
};
