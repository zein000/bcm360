import { FunctionComponent } from "react";
import { NavLink, useLocation } from "react-router-dom";

import { SidenavItem } from "@/constants/sidenav.config";
import { classNames } from "@/utils/classNames";

import { ROUTE_CONFIG } from "@/routes/config";

interface SidenavItemProps extends SidenavItem {
	// isAdmin: boolean;
	testId?: string;
	companyId?: number;
	isOpen?: boolean;
	title: string;
}

export const SidebarItem: FunctionComponent<SidenavItemProps> = ({
	path,
	strictPath,
	icon,
	iconActive,
	onClick,
	testId,
	type,
	companyId,
	title,
	isOpen,
	iconRight,
	additionalTextClassName,
	additionalContainerClassName,
}) => {
	const location = useLocation();
	const isCompaniesPage = location.pathname === ROUTE_CONFIG.COMPANIES;

	const matchCompanyId = location.pathname.match(new RegExp(`${ROUTE_CONFIG.COMPANIES}/(\\d+)`));

	const isMyCompanyPage = matchCompanyId?.[1] === String(companyId);

	let match: boolean;

	if (strictPath) {
		match = location.pathname === path;
	} else {
		if (path === ROUTE_CONFIG.COMPANIES) {
			match = isCompaniesPage;
		} else if (matchCompanyId && path === `${ROUTE_CONFIG.COMPANIES}/${companyId}`) {
			match = isMyCompanyPage;
		} else {
			match = location.pathname.includes(path);
		}
	}

	const isActive = !!match as boolean;

	const getClassName = (isActive: boolean) => {
		const itemClassNames = isActive
			? classNames("rounded-[12px] bg-primary-blue text-white")
			: classNames("text-primary-gray");

		return classNames(
			"h-[44px] px-4 py-3 flex items-center w-full transition-all duration-200",
			isOpen ? "justify-start" : "justify-end",
			itemClassNames,
			additionalContainerClassName
		);
	};

	const getIcon = (isActive: boolean) => {
		const existedIcon = icon || iconRight;
		const currentIcon = isActive && iconActive ? iconActive : existedIcon;

		return typeof currentIcon === "string" ? (
			<img
				alt="icon"
				className={classNames(
					`w-[20px] rounded`,
					type === "logo" ? "bg-gray-700" : "",
					type === "icon" ? "invert" : ""
				)}
				src={currentIcon}
			/>
		) : (
			currentIcon
		);
	};

	return (
		<NavLink className={getClassName(isActive)} data-test={testId} to={path} onClick={onClick}>
			{icon && <div className="w-[20px]">{getIcon(isActive)}</div>}
			<span
				className={classNames(
					"ml-2 text-[14px] leading-none transition-all duration-200",
					isOpen ? "block" : "hidden",
					isActive ? "text-white" : "text-primary-gray",
					additionalTextClassName
				)}
			>
				{title}
			</span>
			{iconRight && <div className="w-[20px]">{getIcon(isActive)}</div>}
		</NavLink>
	);
};
