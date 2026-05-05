import { FunctionComponent } from "react";
import { Route, Routes } from "react-router-dom";

import { PermissionRoles } from "@/enum";

import { useHasPermissions } from "@/utils/useHasPermissions";

import { CompaniesOverview } from "./pages/CompaniesOverview/CompaniesOverview";
import { CompanyDetails } from "../Company/components/CompanyDetails";

export const Companies: FunctionComponent = () => {
	const { hasPermissions } = useHasPermissions();

	return (
		<Routes>
			{hasPermissions([PermissionRoles.GLOBAL_ADMIN]) && (
				<Route element={<CompaniesOverview />} path="/" />
			)}
			<Route element={<CompanyDetails />} path="/:id" />
		</Routes>
	);
};
