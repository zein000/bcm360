import { api } from "@/redux/api";

import { User } from "@/pages/Public/pages/Login/schema/login";

import { TwoFactorAuth } from "@/pages/Public/pages/TwoFactorAuth/schema/twoFactorAuth";

import { ChangePassword, UpdateMeBody } from "../../pages/Account/schema/account";

export const accountApi = api.injectEndpoints({
	endpoints: (builder) => ({
		updateMe: builder.mutation<User, UpdateMeBody>({
			query: (body) => ({
				url: "users",
				method: "PATCH",
				body,
			}),
		}),
		changePassword: builder.mutation<User, ChangePassword>({
			query: (body) => ({
				url: "users/change-password",
				method: "PATCH",
				body,
			}),
		}),
		generateTwoFactorCode: builder.mutation<string, void>({
			query: () => ({
				url: "2fa/generate",
				method: "POST",
				responseHandler: async (response) => {
					const res = await response.blob();
					const img = URL.createObjectURL(res);

					return img;
				},
			}),
		}),
		verifyTwoFactor: builder.mutation<User, TwoFactorAuth>({
			query: ({ code }) => ({
				url: "2fa/verify",
				method: "POST",
				body: { code },
			}),
		}),
		upload: builder.mutation<User, FormData>({
			query: (body) => ({
				url: "users/upload",
				method: "POST",
				body: body,
			}),
		}),
		disableTwoFactor: builder.mutation<User, TwoFactorAuth>({
			query: ({ code }) => ({
				url: "2fa/disable",
				method: "POST",
				body: { code },
			}),
		}),
	}),
});

export const {
	useUpdateMeMutation,
	useChangePasswordMutation,
	useGenerateTwoFactorCodeMutation,
	useVerifyTwoFactorMutation,
	useDisableTwoFactorMutation,
	useUploadMutation,
} = accountApi;
export const accountApiReducer = accountApi.reducer;
export const accountApiMiddleware = accountApi.middleware;
