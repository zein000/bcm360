import { configureStore, isRejectedWithValue, Middleware } from "@reduxjs/toolkit";

import { authReducer, authSlice } from "@/pages/Public/redux/auth.slice";

import { companiesReducer, companiesSlice } from "@/pages/Private/redux/companies/companies.slice";

import { coursesReducer, coursesSlice } from "@/pages/Private/redux/courses/courses";

import {
	courseProgressSlice,
	coursesProgressReducer,
} from "@/pages/Private/redux/course-progress/course-progress.slice";

import { ROUTE_CONFIG } from "../routes/config";
import { api } from "./api";

const { LOGOUT, ERROR_PAGE } = ROUTE_CONFIG;

const rtkRejectQueryMiddleware: Middleware = () => (next) => (action) => {
	if (isRejectedWithValue(action)) {
		if (action.payload.status === 401) {
			if (
				!["login", "authTwoFactorCode", "verifyTwoFactor", "disableTwoFactor"].includes(
					action.meta.arg.endpointName
				)
			) {
				window.location.href = LOGOUT;
			}
		} else if (action.payload.status === 403) {
			window.location.href = ERROR_PAGE;
		}
	}

	return next(action);
};

export const store = configureStore({
	reducer: {
		[authSlice.name]: authReducer,
		[api.reducerPath]: api.reducer,
		[companiesSlice.name]: companiesReducer,
		[coursesSlice.name]: coursesReducer,
		[courseProgressSlice.name]: coursesProgressReducer,
	},
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware({ serializableCheck: false })
			.concat(rtkRejectQueryMiddleware)
			.concat(api.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
