import { ChangeEvent, FunctionComponent, useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import { IconDefinition } from "@fortawesome/pro-regular-svg-icons";

import ReactDOM from "react-dom";

import { SearchField } from "@/components/SearchField/SearchField";
import { classNames } from "@/utils/classNames";

export interface AutoCompleteItem {
	id: number | string;
	title: string;
	icon?: JSX.Element;
}

export interface AutoCompleteProps {
	handleSelect: (value?: AutoCompleteItem) => void;
	handleSearch?: (value: string) => void;
	handleReset?: () => void;
	selectedItem: string;
	data: AutoCompleteItem[];
	label?: string;
	testId?: string;
	floating?: boolean;
	icon?: IconDefinition;
	position?: "top" | "bottom" | "left" | "right" | "bottom-right"; // | "left-center" ;
}

export const AutoComplete: FunctionComponent<AutoCompleteProps> = ({
	handleSelect,
	handleSearch,
	handleReset,
	selectedItem,
	data,
	label,
	testId,
	position = "bottom",
}) => {
	const { t } = useTranslation();
	const [searchValue, setSearchValue] = useState("");

	// Dropdown Logic
	const dropdownRef = useRef<HTMLDivElement>(null);
	const [showDropdown, setShowDropdown] = useState(false);
	const selectFieldRef = useRef<HTMLDivElement>(null);

	const [dropdownStyle, setDropdownStyle] = useState<React.CSSProperties>({});

	const updateDropdownPosition = useCallback(() => {
		if (selectFieldRef.current) {
			const rect = selectFieldRef.current.getBoundingClientRect();
			const dropdownPositionStyle: React.CSSProperties = {
				position: "absolute",
				width: rect.width,
			};

			// Dynamically set dropdown position based on `position` prop
			switch (position) {
				case "top":
					dropdownPositionStyle.top =
						rect.top + window.scrollY - (dropdownRef.current?.offsetHeight ?? 0);
					dropdownPositionStyle.left = rect.left + window.scrollX;
					break;
				case "bottom":
					dropdownPositionStyle.top = rect.bottom + window.scrollY;
					dropdownPositionStyle.left = rect.left + window.scrollX;
					break;
				case "bottom-right":
					dropdownPositionStyle.top = rect.bottom + window.scrollY;
					dropdownPositionStyle.left = rect.left + window.scrollX - 120;
					break;
				case "left":
					dropdownPositionStyle.top = rect.top + window.scrollY;
					dropdownPositionStyle.left =
						rect.left + window.scrollX - (dropdownRef.current?.offsetWidth ?? 0);
					break;
				case "right":
					dropdownPositionStyle.top = rect.top + window.scrollY;
					dropdownPositionStyle.left = rect.right + window.scrollX;
					break;
				default:
					dropdownPositionStyle.top = rect.bottom + window.scrollY;
					dropdownPositionStyle.left = rect.left + window.scrollX;
					break;
			}

			setDropdownStyle(dropdownPositionStyle);
		}
	}, [position]);

	useEffect(() => {
		if (showDropdown) {
			updateDropdownPosition();
			window.addEventListener("resize", updateDropdownPosition);
		} else {
			window.removeEventListener("resize", updateDropdownPosition);
		}

		return () => {
			window.removeEventListener("resize", updateDropdownPosition);
		};
	}, [showDropdown, updateDropdownPosition]);

	const handleSelectItem = (selected: AutoCompleteItem) => {
		handleSelect(selected);
		setShowDropdown(false);
	};

	const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
		const selectedItem = data.find((item) => item.title === e.target.value);

		handleSearch && handleSearch(e.target.value);

		setSearchValue(e.target.value);

		if (selectedItem) {
			handleSelect(selectedItem);
		} else {
			handleSelect({
				id: -1,
				title: e.target.value,
			});
		}

		setShowDropdown(true);
	};

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

	useEffect(() => {
		if (selectedItem) {
			setSearchValue(selectedItem);
		}
	}, [selectedItem]);

	// Result rendering
	const renderResults = () => {
		const results = data.filter((item) => {
			return item.title
				.toLowerCase()
				.replace(" ", "")
				.includes(searchValue.toLowerCase().replace(" ", ""));
		});

		if (!data.length) {
			return <p className="py-2.5 px-3 text-sm italic text-gray-700">{t("basics.noResults")}</p>;
		}

		return (
			<div
				className={classNames(
					results.length ? "border-b border-b-border" : "",
					"flex flex-col items-start"
				)}
			>
				{results.map((item) => {
					const { id, title, icon } = item;

					return (
						<button
							key={`option-select-${id}`}
							className={classNames(
								"flex py-2.5 px-3 pr-8 text-sm text-gray-900 bg-white hover:bg-gray-100 duration-200 cursor-pointer relative items-center w-full"
							)}
							onClick={() => handleSelectItem({ id, title })}
						>
							{icon && <div className="mr-2">{icon}</div>}

							{title}
						</button>
					);
				})}
			</div>
		);
	};

	const handleClickInput = () => setShowDropdown(!showDropdown);

	return (
		<div ref={selectFieldRef} className="relative z-20 w-full">
			{label && (
				<label className="block text-[14px] font-bold text-primary-gray appearance-none">
					{label}
				</label>
			)}
			<div className="relative">
				{handleSearch ? (
					<SearchField
						handleChange={handleSearchChange}
						handleReset={() => {
							setSearchValue("");
							handleSelect();
							handleReset && handleReset();
						}}
						// icon={
						// 	icon ? (
						// 		<Icon className="h-[14px] mt-1" icon={icon} />
						// 	) : (
						// 		<img alt="Book icon" className="mt-0.5" src={BookIcon} width={15} />
						// 	)
						// }
						name="item"
						placeholder={t("basics.pleaseSelect")}
						testId={testId}
						value={searchValue}
						onClick={handleClickInput}
					/>
				) : (
					""
				)}
			</div>
			{showDropdown &&
				ReactDOM.createPortal(
					<div
						ref={dropdownRef}
						className={classNames(
							"mt-1 overflow-hidden bg-white border border-gray-200 rounded-md max-h-[220px] overflow-y-auto bb-scrollbar-darker",
							"z-[2000]"
							// floating ? "absolute" : "relative"
						)}
						style={dropdownStyle}
					>
						{renderResults()}
					</div>,
					document.body
				)}
		</div>
	);
};
