import { FunctionComponent, useState } from "react";

import { useNavigate } from "react-router-dom";

import { useTranslation } from "react-i18next";

import { faChevronLeft, faChevronRight } from "@fortawesome/pro-regular-svg-icons";

import { classNames } from "@/utils/classNames";

import { useNavigationGetter } from "@/constants/sidenav.config";

import { useHasPermissions } from "@/utils/useHasPermissions";

import { authSelector } from "@/pages/Public/redux/auth.slice";

import { useAppSelector } from "@/redux/hooks";

import { ROUTE_CONFIG } from "@/routes/config";

import { PermissionRoles } from "@/enum";

import { ReactComponent as LogoTitle } from "@assets/images/logoTitle.svg";

import { SidebarItem } from "../SidebarItem/SidebarItem";

import { Button } from "../Button/Button";
import { ButtonColor, ButtonSize } from "../Button/types";
import { Icon } from "../Icon/Icon";
import { SvgIcon } from "../Icon/SvgIcon";
import { Logo } from "../Logo/Logo";

const { COURSES } = ROUTE_CONFIG;

export const Sidebar: FunctionComponent = () => {
	const { t } = useTranslation();
	const [isOpen, setIsOpen] = useState(false);

	const ts = (key: string) => t(`sidebar.${key}`);

	const { hasPermissions } = useHasPermissions();
	const navigate = useNavigate();

	const { user } = useAppSelector(authSelector);

	const NavItemConfig = useNavigationGetter();

	const handleNavigateHome = () => {
		if (hasPermissions([PermissionRoles.COURSES])) {
			navigate(COURSES);
		}
	};

	const items = NavItemConfig.ALL;

	const allowedUpperMenu = items.upper
		.filter((item) => !item?.isHidden)
		.filter((item) => {
			if (item.permission) {
				return hasPermissions([item.permission]);
			} else {
				return true;
			}
		})
		.filter((item) => {
			if (item.companyIds && user?.company) {
				return item.companyIds.includes(user.company.id);
			} else {
				return true;
			}
		});
	const allowedLowerMenu = items.lower
		.filter((item) => !item?.isHidden)
		.filter((item) => {
			if (item.permission) {
				return hasPermissions([item.permission]);
			} else {
				return true;
			}
		})
		.filter((item) => {
			if (item.companyIds && user?.company) {
				return item.companyIds.includes(user.company.id);
			} else {
				return true;
			}
		});

	return (
		<div className="h-[calc(100vh)] p-2 pb-4 pr-0 relative">
			{allowedUpperMenu?.length && allowedLowerMenu?.length ? (
				<Button
					className="absolute top-8 -right-3 !z-20 !w-[24px] !rounded-md"
					color={ButtonColor.ACTION_SECONDARY}
					image={<Icon icon={!isOpen ? faChevronRight : faChevronLeft} />}
					size={ButtonSize.XXS}
					title=""
					onClick={() => setIsOpen((prev) => !prev)}
				></Button>
			) : (
				<></>
			)}
			<div
				className={classNames(
					"bg-white relative pt-0 right-0 duration-200 ease-in-out print:hidden overflow-auto bb-scrollbar flex flex-col",
					isOpen ? "w-[200px]" : " w-[80px]",
					"h-full",
					"border-[1px] border-[#E6E6EC] rounded-xl"
				)}
			>
				<div className="flex h-full flex-col items-center p-4">
					<div
						className={classNames(
							"flex items-center w-full transition-all duration-200",
							isOpen ? "justify-start mb-10" : "justify-end mb-4"
						)}
					>
						<Logo handleClick={handleNavigateHome} />

						<SvgIcon
							className={`${isOpen ? "block" : "hidden"} ml-3 w-[90px] h-[18px] text-brand-light`}
							svgIcon={LogoTitle}
						/>
					</div>
					<div className="space-y-1 flex-1 w-full">
						{allowedUpperMenu?.length ? (
							<>
								<h3 className="text-[12px] text-primary-gray-lighter px-3 mb-4 uppercase">
									{isOpen ? ts("menu") : ""}
								</h3>
								{allowedUpperMenu.map((item) => (
									<SidebarItem
										key={item.path}
										additionalContainerClassName={item.additionalContainerClassName}
										additionalTextClassName={item.additionalTextClassName}
										companyId={user?.company?.id}
										icon={item.icon}
										iconActive={item.iconActive}
										iconRight={item.iconRight}
										isOpen={isOpen}
										path={item.path}
										title={item.title}
										type={item.type || "icon"}
									/>
								))}
							</>
						) : (
							<></>
						)}
					</div>
					{allowedLowerMenu?.length ? (
						<div className="space-y-1 w-full">
							<h3 className="text-[12px] text-primary-gray-lighter px-3 mb-4 uppercase">
								{isOpen ? ts("settings") : ""}
							</h3>
							{allowedLowerMenu.map((item) => (
								<SidebarItem
									key={item.path}
									companyId={user?.company?.id}
									icon={item.icon}
									iconActive={item.iconActive}
									isOpen={isOpen}
									path={item.path}
									title={item.title}
									type={item.type || "icon"}
								/>
							))}
						</div>
					) : (
						<></>
					)}
				</div>
			</div>
		</div>
	);
};
