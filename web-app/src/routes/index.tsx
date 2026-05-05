import { useEffect, useState } from "react";
import { Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom";

import { Logout } from "@/pages/Logout/Logout";
import { Private } from "@/pages/Private/Private";
import { authSelector } from "@/pages/Public/redux/auth.slice";
import { useLazyFetchMeQuery } from "@/pages/Public/redux/auth.api";
import { LoadingOverlay } from "@/components";

import { Public } from "@/pages/Public/Public";

import { useAppSelector } from "../redux/hooks";
import { ROUTE_CONFIG } from "./config";

const { LOGIN, LOGOUT } = ROUTE_CONFIG;

export const Routing = () => {
	const { pathname } = useLocation();
	const navigate = useNavigate();
	const { token, user } = useAppSelector(authSelector);
	const [fetchMe] = useLazyFetchMeQuery();
	const onLogoutRoute = pathname === LOGOUT;
	const [isLoading, setIsLoading] = useState(!onLogoutRoute);

	useEffect(() => {
		if (token && !user && isLoading) {
			fetchMe(token)
				.then((res) => {
					if (res.status === "rejected") {
						navigate(LOGOUT);
					}
				})
				.catch((e) => {
					console.error(e.status);
				});
		}
	}, [token, user, isLoading, fetchMe, navigate]);

	useEffect(() => {
		if ((!token || !!user) && isLoading) {
			setTimeout(() => setIsLoading(false), 1000);
		}
	}, [token, user, isLoading]);

	const getFallbackRoute = () => {
		if (user) {
			return "";
		} else {
			return LOGIN;
		}
	};

	return isLoading ? (
		<LoadingOverlay />
	) : (
		<Routes>
			<Route element={<Logout />} path={LOGOUT} />
			<Route element={<Private />} path="/app/*" />
			<Route element={<Navigate to={getFallbackRoute()} />} />
			<Route element={<Public />} path="*" />
		</Routes>
	);
};
