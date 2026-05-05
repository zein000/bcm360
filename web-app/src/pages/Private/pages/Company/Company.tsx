import { ChangeEvent, FunctionComponent, useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { Stack, Tab } from "@mui/material";
import { TabContext, TabList, TabPanel } from "@mui/lab";

import { useAppSelector } from "@/redux/hooks";
import { authSelector } from "@/pages/Public/redux/auth.slice";

import { PermissionRoles } from "@/enum";

import { useHasPermissions } from "@/utils/useHasPermissions";

import { usePageTitle } from "@/utils/usePageTitle";

import { CompanyInformation } from "./components/CompanyInformation";
import { CompanyType } from "./schema/company";
import { Users } from "../Users/Users";
import { UserRoles } from "../UserRoles/UserRoles";

enum Tabs {
	GENERAL = "GENERAL",
	USER = "USER",
	ROLES = "ROLES",
}

export const Company: FunctionComponent = () => {
	const { t } = useTranslation();
	const ts = (key: string) => t(`company.${key}`);

	const [currentTab, setCurrentTab] = useState<Tabs>(Tabs.GENERAL);

	const { user } = useAppSelector(authSelector);

	const { hasPermissions } = useHasPermissions();

	usePageTitle(ts("title"));
	let tabs = [
		{ label: ts("tabs.general"), value: Tabs.GENERAL, permission: PermissionRoles.UPDATE_USER },
		{ label: ts("tabs.user"), value: Tabs.USER, permission: PermissionRoles.UPDATE_USER },
		{ label: ts("tabs.roles"), value: Tabs.ROLES, permission: PermissionRoles.UPDATE_USER },
	];

	tabs = tabs.filter((tab) => hasPermissions([tab.permission]));

	const handleTabsChange = useCallback((_: ChangeEvent<{}>, value: Tabs): void => {
		setCurrentTab(value);
	}, []);

	return (
		<div className="px-4">
			<TabContext value={currentTab}>
				<TabList aria-label="Account tabs" sx={{ mb: 4 }} onChange={handleTabsChange}>
					{tabs.map((tab, index) => (
						<Tab key={index} label={tab.label} value={tab.value} />
					))}
				</TabList>

				<TabPanel sx={{ p: 0 }} value={Tabs.GENERAL}>
					<Stack spacing={4}>
						<CompanyInformation company={user?.company as CompanyType} />
					</Stack>
				</TabPanel>

				<TabPanel sx={{ p: 0 }} value={Tabs.USER}>
					<Users />
				</TabPanel>

				<TabPanel sx={{ p: 0 }} value={Tabs.ROLES}>
					<UserRoles />
				</TabPanel>
			</TabContext>
		</div>
	);
};
