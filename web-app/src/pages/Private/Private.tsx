import { FunctionComponent } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";

import { ErrorPage, MainLayout } from "@/components";
import { ErrorPageType, PermissionRoles } from "@/enum";
import { useAppSelector } from "@/redux/hooks";
import { ROUTE_CONFIG } from "@/routes/config";

import { useHasPermissions } from "@/utils/useHasPermissions";

import { authSelector } from "../Public/redux/auth.slice";
import { Account } from "./pages/Account/Account";
import Analytics from "./pages/Analytics/Analytics";
import { Companies } from "./pages/Companies/Companies";
import { Company } from "./pages/Company/Company";
import { Courses } from "./pages/Courses/Courses";
import { Admin } from "./routes/Admin";

const { LOGIN, COURSES } = ROUTE_CONFIG;

export const Private: FunctionComponent = () => {
	const { hasPermissions } = useHasPermissions();
	const { user } = useAppSelector(authSelector);
	const { pathname } = useLocation();

	if (
		user &&
		user?.courseProgressId &&
		pathname !== COURSES + `/${user?.courseProgressId}/progress` &&
		pathname !== "/error-page"
	) {
		return <Navigate replace={true} to={COURSES + `/${user?.courseProgressId}/progress`} />;
	}

	if (!user) {
		return <Navigate to={LOGIN} />;
	}

	return (
		<Routes>
			<Route element={<MainLayout />}>
				<Route element={<Account />} path="/account" />
				<Route element={<Company />} path="/company" />
				<Route element={<Admin />} path="/users/*" />
				<Route element={<Companies />} path="/companies/*" />
				<Route element={<Courses />} path="/courses/*" />
				{hasPermissions([PermissionRoles.GLOBAL_ADMIN]) && (
					<Route element={<Analytics />} path="/analytics" />
				)}
			</Route>
			<Route element={<ErrorPage type={ErrorPageType.NotFound} />} path="*" />
			<Route element={<ErrorPage type={ErrorPageType.Forbidden} />} path="/error-page" />
		</Routes>
	);
};
