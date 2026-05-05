import { FunctionComponent } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

import { ROUTE_CONFIG } from "@/routes/config";
import { useAppSelector } from "@/redux/hooks";
import { ErrorPage } from "@/components";
import { authSelector } from "@/pages/Public/redux/auth.slice";
import { isAdmin } from "@/utils";
import { ErrorPageType } from "@/enum";

import { UserRoles } from "../pages/UserRoles/UserRoles";
import { Users } from "../pages/Users/Users";

const { LOGIN, USERS } = ROUTE_CONFIG;

export const Admin: FunctionComponent = () => {
	const { user } = useAppSelector(authSelector);

	if (!user) {
		return <Navigate to={LOGIN} />;
	}

	if (!isAdmin(user)) {
		return <Navigate to={USERS} />; // Home page,
	}

	return (
		<Routes>
			<Route element={<Users />} path="/" />
			<Route element={<UserRoles />} path="/user-roles" />
			<Route element={<ErrorPage type={ErrorPageType.NotFound} />} path="*" />
			<Route element={<ErrorPage type={ErrorPageType.Forbidden} />} path="/error-page" />
		</Routes>
	);
};
