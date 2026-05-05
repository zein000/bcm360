import { createSlice } from "@reduxjs/toolkit";

import { RootState } from "@/redux";
import { AuthState } from "@/types/auth";

import { accountApi } from "@/pages/Private/redux/account/account.api";

import { coursesProgressApi } from "@/pages/Private/redux/course-progress/course-progress.api";

import { PermissionRoles } from "@/enum";

import { authApi } from "./auth.api";

const initialState: AuthState = {
	otpToken: null,
	token: localStorage.getItem("token") || null,
	user: null,
};

export const authSlice = createSlice({
	name: "auth",
	initialState,
	reducers: {
		resetAuth: (state) => {
			localStorage.clear();
			state.user = null;
			state.token = null;
		},
		setAuth: (state, { payload }) => {
			const { otpToken, accessToken, token, user } = payload;

			if (accessToken) {
				localStorage.setItem("token", accessToken);
				state.token = accessToken;
			} else if (token) {
				localStorage.setItem("token", token);
				state.token = token;
			}

			if (otpToken) {
				state.otpToken = otpToken;
			}

			state.user = user;
		},
		updatePermissions: (state, { payload }) => {
			if (state?.user?.role?.permissions) {
				state.user.role.permissions = (payload?.permissions ?? []).map((code: PermissionRoles) => ({
					code,
				}));
			}
		},
	},
	extraReducers: (builder) => {
		builder
			.addMatcher(authApi.endpoints.login.matchFulfilled, (state, { payload }) => {
				const { otpToken, accessToken, user, isRememberMe } = payload;

				if (accessToken) {
					if (isRememberMe) {
						localStorage.setItem("token", accessToken);
					}

					state.token = accessToken;
				}

				if (otpToken) {
					state.otpToken = otpToken;
				}

				state.user = user;
			})
			.addMatcher(authApi.endpoints.fetchMe.matchFulfilled, (state, { payload }) => {
				state.user = payload;
			})
			.addMatcher(accountApi.endpoints.updateMe.matchFulfilled, (state, { payload }) => {
				state.user = payload;
			})
			.addMatcher(authApi.endpoints.authTwoFactorCode.matchFulfilled, (state, { payload }) => {
				const { accessToken, user } = payload;

				if (accessToken) {
					localStorage.setItem("token", accessToken);
					state.token = accessToken;
					state.otpToken = null;
				}

				state.user = user;
			})
			.addMatcher(accountApi.endpoints.verifyTwoFactor.matchFulfilled, (state, { payload }) => {
				state.user = payload;
			})
			.addMatcher(accountApi.endpoints.disableTwoFactor.matchFulfilled, (state, { payload }) => {
				state.user = payload;
			})
			.addMatcher(
				coursesProgressApi.endpoints.acceptCourseProgressInvitation.matchFulfilled,
				(state, { payload }) => {
					const { accessToken, user } = payload;

					if (accessToken) {
						localStorage.setItem("token", accessToken);
						state.token = accessToken;
						state.otpToken = null;
					}

					state.user = user;
				}
			)
			.addMatcher(
				coursesProgressApi.endpoints.checkIfAlreadyAccepted.matchFulfilled,
				(state, { payload }) => {
					const { accessToken, user } = payload;

					if (accessToken) {
						localStorage.setItem("token", accessToken);
						state.token = accessToken;
						state.otpToken = null;
					}

					state.user = user;
				}
			)
			.addMatcher(
				coursesProgressApi.endpoints.acceptCourseProgressInvitation.matchFulfilled,
				(state, { payload }) => {
					const { accessToken, user } = payload;

					if (accessToken) {
						localStorage.setItem("token", accessToken);
						state.token = accessToken;
						state.otpToken = null;
					}

					state.user = user;
				}
			);
	},
});

export const { resetAuth, setAuth, updatePermissions } = authSlice.actions;
export const authReducer = authSlice.reducer;
export const authSelector = (state: RootState) => state[authSlice.name];
