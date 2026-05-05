import { api } from "@/redux/api";

import {
	ForgotPasswordRequestSchema,
	ForgotPasswordType,
} from "../pages/ForgotPassword/schema/forgot-password";
import {
	FetchMeResponseSchema,
	LoginRequestSchema,
	LoginResponse,
	LoginResponseSchema,
	LoginType,
	User,
} from "../pages/Login/schema/login";
import {
	AcceptInvitationBody,
	AcceptInvitationRequestSchema,
	SetPasswordBody,
	SetPasswordRequestSchema,
} from "../pages/AcceptInvitation/schema/set-password";

export const authApi = api.injectEndpoints({
	endpoints: (builder) => ({
		fetchMe: builder.query<User, string>({
			query: (token) => ({
				url: "users/me",
				headers: {
					Authorization: `Bearer ${token}`,
				},
				responseSchema: FetchMeResponseSchema,
			}),
			providesTags: ["Me"],
		}),
		login: builder.mutation<LoginResponse, LoginType>({
			query: (body) => ({
				url: "users/login",
				method: "POST",
				body,
				requestSchema: LoginRequestSchema,
				responseSchema: LoginResponseSchema,
			}),
			invalidatesTags: ["Roles"],
		}),
		resetPassword: builder.mutation<void, ForgotPasswordType>({
			query: (body) => ({
				url: "users/reset-password",
				method: "POST",
				body,
				requestSchema: ForgotPasswordRequestSchema,
			}),
		}),
		setPassword: builder.mutation<void, SetPasswordBody>({
			query: (body) => ({
				url: "users/set-password",
				method: "POST",
				body,
				requestSchema: SetPasswordRequestSchema,
			}),
		}),
		acceptInvitation: builder.mutation<{ status?: string; user?: User }, AcceptInvitationBody>({
			query: (body) => ({
				url: "users/accept-invitation",
				method: "POST",
				body,
				requestSchema: AcceptInvitationRequestSchema,
			}),
		}),
		authTwoFactorCode: builder.mutation<LoginResponse, { code: string; token: string }>({
			query: ({ code, token }) => ({
				url: "2fa/authenticate",
				method: "POST",
				body: { code },
				headers: {
					Authorization: `Bearer ${token}`,
				},
			}),
		}),
	}),
});

export const {
	useLoginMutation,
	useResetPasswordMutation,
	useSetPasswordMutation,
	useLazyFetchMeQuery,
	useAuthTwoFactorCodeMutation,
	useAcceptInvitationMutation,
} = authApi;
export const authApiReducer = authApi.reducer;
export const authApiMiddleware = authApi.middleware;
