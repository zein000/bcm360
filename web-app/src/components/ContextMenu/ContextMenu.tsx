import React, { FunctionComponent, useCallback, useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";

import { classNames } from "@/utils/classNames";

import { PermissionRoles } from "@/enum";

import { PermissionCheck } from "../PermissionCheck/PermissionCheck";

export interface MenuItem {
	title: string;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	icon?: any;
	permissions?: PermissionRoles[];
	disabled?: boolean;
	onClick: () => void;
}

export interface ContextMenuProps {
	children?: React.ReactNode;
	data: MenuItem[][];
	label?: string;
	testId?: string;
	floating?: boolean;
	icon?: boolean;
	width?: string;
	containerStyles?: string;
	position?: "top" | "bottom" | "left" | "right" | "bottom-right"; // | "left-center" ;
}

export const ContextMenu: FunctionComponent<ContextMenuProps> = ({
	children,
	data,
	label,
	testId,
	width,
	position = "bottom",
	containerStyles = "w-full",
}) => {
	const selectFieldRef = useRef<HTMLDivElement>(null);
	const dropdownRef = useRef<HTMLDivElement>(null);
	const scrollContainerRef = useRef<HTMLElement | null>(null);
	const [showDropdown, setShowDropdown] = useState(false);
	const [dropdownStyle, setDropdownStyle] = useState<React.CSSProperties>({});

	const updateDropdownPosition = useCallback(() => {
		if (selectFieldRef.current) {
			const rect = selectFieldRef.current.getBoundingClientRect();
			const dropdownPositionStyle: React.CSSProperties = {
				position: "absolute",
			};

			// Dynamically set dropdown position based on `position` prop
			switch (position) {
				case "top":
					dropdownPositionStyle.top =
						rect.top + window.scrollY - (dropdownRef.current?.offsetHeight ?? 0) - 20;
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

	const checkIfDropdownIsVisible = useCallback(() => {
		if (dropdownRef.current && scrollContainerRef.current) {
			const dropdownRect = dropdownRef.current.getBoundingClientRect();
			const containerRect = scrollContainerRef.current.getBoundingClientRect();

			// Check if dropdown is outside the container
			if (
				dropdownRect.bottom > containerRect.bottom ||
				dropdownRect.top < containerRect.top ||
				dropdownRect.right > containerRect.right ||
				dropdownRect.left < containerRect.left
			) {
				setShowDropdown(false);
			}
		}
	}, []);

	useEffect(() => {
		const scrollContainer = document.querySelector("#outlet-container") as HTMLElement;

		scrollContainerRef.current = scrollContainer;
		const handleScroll = () => {
			updateDropdownPosition();
			checkIfDropdownIsVisible();
		};

		if (showDropdown) {
			updateDropdownPosition();
			scrollContainer.addEventListener("scroll", handleScroll);
			window.addEventListener("resize", updateDropdownPosition);
		} else {
			scrollContainer.removeEventListener("scroll", handleScroll);
			window.removeEventListener("resize", updateDropdownPosition);
		}

		return () => {
			scrollContainer.removeEventListener("scroll", checkIfDropdownIsVisible);
			window.removeEventListener("resize", updateDropdownPosition);
		};
	}, [showDropdown, updateDropdownPosition, checkIfDropdownIsVisible]);

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
	const renderItems = () => {
		return (
			<>
				{data.map((block, blockIndex) => (
					<div key={`menu-block-${blockIndex}`}>
						{block.map((item, itemIndex) => (
							<PermissionCheck
								key={`option-select-${item.title}-${itemIndex}`}
								requiredPermissions={item.permissions ?? []}
							>
								<button
									className={classNames(
										"w-full text-left flex py-2.5 px-3 pr-8 text-sm text-primary-gray bg-white hover:text-primary-blue-hover duration-200 cursor-pointer relative",
										item.disabled && "opacity-50 cursor-not-allowed"
									)}
									onClick={() => !item.disabled && item.onClick()}
								>
									<div className="mr-2">{item.icon}</div>
									{item.title} {item.disabled && "(Running)"}
								</button>
							</PermissionCheck>
						))}
						{blockIndex < data.length - 1 && <hr className="border-t border-gray-300 my-2" />}
					</div>
				))}
			</>
		);
	};

	const handleOpen = () => setShowDropdown(!showDropdown);

	return (
		<div
			ref={selectFieldRef}
			className={classNames("relative flex flex-row items-center", containerStyles)}
		>
			{label && (
				<label className="block mb-2 text-sm font-medium text-gray-900 appearance-none">
					{label}
				</label>
			)}

			<div className={`relative`} data-test={testId} onClick={handleOpen}>
				{children}
			</div>
			{showDropdown &&
				ReactDOM.createPortal(
					<div
						ref={dropdownRef}
						className={classNames(
							"z-50 mt-2 mr-5 p-4 overflow-hidden space-y-2 bg-white border border-[#E6E6EC] shadow-md rounded-16 max-h-[300px] overflow-y-auto bb-scrollbar-darker",
							width ? `w-${width}` : "w-[200px]"
						)}
						style={dropdownStyle}
					>
						{renderItems()}
					</div>,
					document.body
				)}
		</div>
	);
};
