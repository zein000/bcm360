import { FunctionComponent, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { useAppDispatch } from "@/redux/hooks";
import { ROUTE_CONFIG } from "@/routes/config";
import { LoadingOverlay } from "@/components";

import { api } from "@/redux/api";

import { resetAuth } from "../Public/redux/auth.slice";

const { LOGIN } = ROUTE_CONFIG;

export const Logout: FunctionComponent = () => {
	const dispatch = useAppDispatch();
	const navigate = useNavigate();

	useEffect(() => {
		setTimeout(() => {
			dispatch(api.util.resetApiState());
			dispatch(resetAuth());
			navigate(LOGIN);
		}, 1000);
	}, [dispatch, navigate]);

	return <LoadingOverlay />;
};
