import { faBuilding, faChevronRight } from "@fortawesome/pro-regular-svg-icons";

import { faChartPieSimple, faUsers } from "@fortawesome/pro-solid-svg-icons";

import { useEffect, useState } from "react";

import i18n from "@/i18n";
import { ROUTE_CONFIG } from "@/routes/config";

import { Icon } from "@/components";
import { PermissionRoles } from "@/enum";

import { SvgIcon } from "@/components/Icon/SvgIcon";
import { authSelector } from "@/pages/Public/redux/auth.slice";
import { useAppSelector } from "@/redux/hooks";
import { ReactComponent as Clipboard } from "@assets/icons/sidebar/clipboard.svg";
import { ReactComponent as Settings } from "@assets/icons/sidebar/settings.svg";
import { useLazyCheckIfScenarioInProgressExistQuery } from "@/pages/Private/redux/course-progress/course-progress.api";
import { CourseProgressResponse } from "@/pages/Private/pages/Course/schema/course-progress";
import { hasPermission } from "@/utils";

export interface SidenavItem {
	title: string;
	path: string;
	onClick?: () => void;
	strictPath?: boolean;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	icon?: any;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	iconActive?: any;
	type?: string;
	permission?: PermissionRoles;
	companyIds?: number[];
	additionalTextClassName?: string;
	additionalContainerClassName?: string;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	iconRight?: any;
	isHidden?: boolean;
}

interface NavItemInner {
	upper: SidenavItem[];
	middle?: SidenavItem[];
	secondMiddle?: SidenavItem[];
	lower: SidenavItem[];
}

interface NavItemConfig {
	ALL: NavItemInner;
}

export const useNavigationGetter = (): NavItemConfig => {
	const { user } = useAppSelector(authSelector);
	const [checkIfScenarioInProgressExist, { data }] = useLazyCheckIfScenarioInProgressExistQuery();
	const [currentActiveScenarioData, setCurrentActiveScenarioData] =
		useState<CourseProgressResponse | null>(null);

	useEffect(() => {
		if (data !== undefined) {
			setCurrentActiveScenarioData(data);
		}
	}, [data]);

	useEffect(() => {
		if (user && hasPermission(user, [PermissionRoles.USER])) {
			checkIfScenarioInProgressExist().catch(() => {
				setCurrentActiveScenarioData(null);
			});
		}
	}, [user, checkIfScenarioInProgressExist]);

	return {
		ALL: {
			upper: [
				{
					title: i18n.t("sidebar.courses"),
					path: ROUTE_CONFIG.COURSES,
					icon: <SvgIcon className="w-[24px] h-[24px] fill-primary-blue" svgIcon={Clipboard} />,
					iconActive: <SvgIcon className="w-[24px] h-[24px] fill-white" svgIcon={Clipboard} />,
					type: "icon",
					permission: PermissionRoles.COURSES,
				},
				{
					title: i18n.t("sidebar.analytics"),
					path: `${ROUTE_CONFIG.ANALYTICS}`,
					icon: <Icon className="w-[24px] h-[24px] text-primary-blue" icon={faChartPieSimple} />,
					iconActive: <Icon className="w-[24px] h-[24px] text-white" icon={faChartPieSimple} />,
					type: "icon",
					permission: PermissionRoles.GLOBAL_ADMIN,
				},
				{
					isHidden: !currentActiveScenarioData || currentActiveScenarioData?.id === undefined,
					title: i18n.t("sidebar.current-scenario"),
					path: `${ROUTE_CONFIG.COURSES}/${currentActiveScenarioData?.id}/progress`,
					iconRight: (
						<Icon className="w-[16px] h-[16px] text-primary-blue-hover" icon={faChevronRight} />
					),
					type: "icon",
					permission: PermissionRoles.USER,
					additionalTextClassName: "!text-primary-blue-hover !ml-0 mr-4 text-nowrap",
					additionalContainerClassName:
						"!bg-white !rounded-none border-t border-t-[#E6E6EC] !mt-4 !pt-5",
				},
			],
			middle: [],
			lower: [
				{
					title: i18n.t("sidebar.settings"),
					path: ROUTE_CONFIG.ACCOUNT,
					icon: <SvgIcon className="w-[24px] h-[24px] fill-primary-blue" svgIcon={Settings} />,
					iconActive: <SvgIcon className="w-[24px] h-[24px] fill-white" svgIcon={Settings} />,
					type: "icon",
					permission: PermissionRoles.COURSES,
				},
				{
					title: i18n.t("sidebar.users"),
					path: `${ROUTE_CONFIG.COMPANIES}/${user?.company?.id}`,
					icon: <Icon className="w-[24px] h-[24px] text-primary-blue" icon={faUsers} />,
					iconActive: <Icon className="w-[24px] h-[24px] text-white" icon={faUsers} />,
					type: "icon",
					permission: PermissionRoles.UPDATE_USER,
				},
				{
					title: i18n.t("sidebar.companies"),
					path: ROUTE_CONFIG.COMPANIES,
					icon: <Icon className="w-[24px] h-[24px] text-primary-blue" icon={faBuilding} />,
					iconActive: <Icon className="w-[24px] h-[24px] text-white" icon={faBuilding} />,
					type: "icon",
					permission: PermissionRoles.GLOBAL_ADMIN,
				},
			],
		},
	};
};
