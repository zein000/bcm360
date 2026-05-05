import { FunctionComponent } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";

import { AuthLayout, ErrorPage } from "@/components";
import { ErrorPageType } from "@/enum";
import { useAppSelector } from "@/redux/hooks";
import { PUBLIC_PAGES_AFTER_LOGIN, ROUTE_CONFIG } from "@/routes/config";

import { AcceptInvitation } from "./pages/AcceptInvitation/AcceptInvitation";
import { ChangePassword } from "./pages/ChangePassword/ChangePassword";
import CheckYourEmail from "./pages/CheckYourEmail/CheckYourEmail";
import { ForgotPassword } from "./pages/ForgotPassword/ForgotPassword";
import { Login } from "./pages/Login/Login";
import ScenarioJoining from "./pages/ScenarioJoining/ScenarioJoining";
import { TwoFactorAuth } from "./pages/TwoFactorAuth/TwoFactorAuth";
import { authSelector } from "./redux/auth.slice";

const { TFA, COURSES } = ROUTE_CONFIG;

export const Public: FunctionComponent = () => {
	const { user, otpToken } = useAppSelector(authSelector);
	const { pathname } = useLocation();

	const publicPages = PUBLIC_PAGES_AFTER_LOGIN.find((pp: string) => pathname.includes(pp));

	if (user && !otpToken && !publicPages && pathname !== "/error-page") {
		return <Navigate to={COURSES} />;
	}

	if (user && otpToken && pathname !== TFA && pathname !== "/error-page") {
		return <Navigate to={TFA} />;
	}

	return (
		<Routes>
			<Route element={<Navigate to="/login" />} path="/" />
			<Route element={<AuthLayout />}>
				<Route element={<Login />} path="login" />
				<Route element={<TwoFactorAuth />} path="2fa" />
				<Route element={<AcceptInvitation />} path="/accept-invitation" />
				<Route element={<ChangePassword />} path="/change-password" />
				<Route element={<ForgotPassword />} path="/forgot-password" />
				<Route element={<ScenarioJoining />} path="/first-login" />
				<Route element={<CheckYourEmail />} path="/check-email" />
			</Route>
			<Route element={<ErrorPage type={ErrorPageType.NotFound} />} path="*" />
			<Route element={<ErrorPage type={ErrorPageType.Forbidden} />} path="/error-page" />
		</Routes>
	);
};
