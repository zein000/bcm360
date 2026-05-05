import {
	FetchMeResponseSchema,
	LoginResponse,
	LoginResponseSchema,
	User,
} from "@/pages/Public/pages/Login/schema/login";
import { api } from "@/redux/api";
import { StatusResponse, StatusResponseSchema } from "@/schemas/status-response";
import {
	GetAllPermissionsResponse,
	GetAllRolesResponse,
	GetAllUsersResponse,
	UpdateRoleBody,
	UpdateRolePermissionsBody,
	UpdateUserBody,
	UpdateUserRoleBody,
} from "@/types/admin";
import { RequestPaginationParams } from "@/types/request-params";

import {
	CreateRoleRequest,
	CreateRoleRequestSchema,
	CreateRoleResponseSchema,
	DeleteRoleRequestSchema,
	DeleteRoleResponseSchema,
	GetRolesResponseSchema,
	UpdateRolePermissionResponseSchema,
	UpdateRoleResponseSchema,
	UpdateRoleSchema,
	UserRole,
} from "../../pages/UserRoles/schema/roles";
import { DeleteUserSchema, DeletedUser } from "../../pages/Users/schema/delete-user";
import { GetAllUsersResponseSchema } from "../../pages/Users/schema/get-users";
import {
	InviteRequest,
	InviteRequestSchema,
	InviteResponseSchema,
	InviteSchema,
	ResendInviteRequest,
} from "../../pages/Users/schema/invite-user";
import {
	GetPermissionsResponseSchema,
	UpdateRolePermissionsRequestSchema,
} from "../../pages/Users/schema/permissions";
import { UpdateUserRolesSchema } from "../../pages/Users/schema/update-user";

export const adminApi = api.injectEndpoints({
	endpoints: (builder) => ({
		getUsers: builder.query<GetAllUsersResponse, RequestPaginationParams>({
			query: (params) => {
				const queryParams = new URLSearchParams();

				if (params.page) {
					queryParams.append("page", params.page.toString());
				}

				if (params.limit) {
					queryParams.append("limit", params.limit.toString());
				}

				if (params.fieldName) {
					queryParams.append("fieldName", params.fieldName);
				}

				if (params.searchValue) {
					queryParams.append("value", params.searchValue);
				}

				if (params.companyId) {
					queryParams.append("companyId", params.companyId.toString());
				}

				if (params.sortBy) {
					queryParams.append("sortBy", params.sortBy);
				}

				if (params.sortOrder) {
					queryParams.append("sortOrder", params.sortOrder);
				}

				if (params.filters) {
					Object.entries(params.filters).forEach(([key, values]) => {
						if (Array.isArray(values)) {
							values.forEach((value) => queryParams.append(`filters[${key}]`, value));
						} else {
							queryParams.append(`filters[${key}]`, values);
						}
					});
				}

				return {
					url: `users?${queryParams.toString()}`,
					responseSchema: GetAllUsersResponseSchema,
				};
			},
			providesTags: ["Users"],
		}),
		loginAs: builder.mutation<LoginResponse, number>({
			query: (id) => ({
				url: "users/loginAs",
				method: "POST",
				body: {
					id,
				},
				responseSchema: LoginResponseSchema,
			}),
		}),
		inviteUser: builder.mutation<Partial<User>[], InviteRequest>({
			query: (body) => ({
				url: "users/invite",
				method: "POST",
				body,
				requestSchema: InviteRequestSchema,
				responseSchema: InviteResponseSchema,
			}),
			invalidatesTags: ["Users"],
		}),
		resendInviteEmail: builder.mutation<Partial<User>, ResendInviteRequest>({
			query: (body) => ({
				url: "users/resend-invite",
				method: "POST",
				body,
				requestSchema: InviteSchema,
				responseSchema: InviteResponseSchema,
			}),
			invalidatesTags: ["Users"],
		}),
		updateUser: builder.mutation<User, UpdateUserBody>({
			query: ({ body, id }) => ({
				url: `users/${id}`,
				method: "PATCH",
				body,
				responseSchema: FetchMeResponseSchema,
			}),
			invalidatesTags: ["Users"],
		}),
		deleteUser: builder.mutation<DeletedUser, number>({
			query: (id) => ({
				url: `users/${id}`,
				method: "DELETE",
				responseSchema: DeleteUserSchema,
			}),
			invalidatesTags: ["Users"],
		}),
		resetUserPassword: builder.mutation<StatusResponse, number>({
			query: (id) => ({
				url: `users/${id}/reset-password`,
				method: "POST",
				responseSchema: StatusResponseSchema,
			}),
		}),
		assignUserRoles: builder.mutation<User, UpdateUserRoleBody>({
			query: ({ id, body }) => ({
				url: `users/${id}/roles`,
				method: "POST",
				body,
				requestSchema: UpdateUserRolesSchema,
				responseSchema: FetchMeResponseSchema,
			}),
			invalidatesTags: ["Users"],
		}),
		unAssignUserRoles: builder.mutation<User, UpdateUserRoleBody>({
			query: ({ id, body }) => ({
				url: `users/${id}/roles`,
				method: "DELETE",
				body,
				requestSchema: UpdateUserRolesSchema,
				responseSchema: FetchMeResponseSchema,
			}),
			invalidatesTags: ["Users"],
		}),
		getRoles: builder.query<GetAllRolesResponse, void>({
			query: () => ({
				url: "/roles",
				responseSchema: GetRolesResponseSchema,
			}),
			providesTags: ["Roles"],
		}),
		createRole: builder.mutation<UserRole, CreateRoleRequest>({
			query: (body) => ({
				url: `/roles`,
				method: "POST",
				body,
				requestSchema: CreateRoleRequestSchema,
				responseSchema: CreateRoleResponseSchema,
			}),
			invalidatesTags: ["Roles"],
		}),
		updateRole: builder.mutation<Partial<UserRole>, UpdateRoleBody>({
			query: ({ id, body }) => ({
				url: `/roles/${id}`,
				method: "PATCH",
				body,
				requestSchema: UpdateRoleSchema,
				responseSchema: UpdateRoleResponseSchema,
			}),
			invalidatesTags: ["Roles"],
		}),
		deleteRole: builder.mutation<UserRole, number>({
			query: (id) => ({
				url: `/roles/${id}`,
				method: "DELETE",
				requestSchema: DeleteRoleRequestSchema,
				responseSchema: DeleteRoleResponseSchema,
			}),
			invalidatesTags: ["Roles"],
		}),
		assignPermissions: builder.mutation<UserRole, UpdateRolePermissionsBody>({
			query: ({ id, body }) => ({
				url: `/roles/${id}/permissions`,
				method: "POST",
				body,
				requestSchema: UpdateRolePermissionsRequestSchema,
				responseSchema: UpdateRolePermissionResponseSchema,
			}),
			invalidatesTags: ["Roles"],
		}),
		unassignPermissions: builder.mutation<UserRole, UpdateRolePermissionsBody>({
			query: ({ id, body }) => ({
				url: `/roles/${id}/permissions`,
				method: "DELETE",
				body,
				requestSchema: UpdateRolePermissionsRequestSchema,
				responseSchema: UpdateRolePermissionResponseSchema,
			}),
			invalidatesTags: ["Roles"],
		}),
		getPermissions: builder.query<GetAllPermissionsResponse, void>({
			query: () => ({
				url: "/permissions",
				responseSchema: GetPermissionsResponseSchema,
			}),
		}),
	}),
});

export const {
	useGetUsersQuery,
	useUpdateUserMutation,
	useLoginAsMutation,
	useDeleteUserMutation,
	useInviteUserMutation,
	useResendInviteEmailMutation,
	useResetUserPasswordMutation,
	useAssignUserRolesMutation,
	useUnAssignUserRolesMutation,
	useGetRolesQuery,
	useCreateRoleMutation,
	useUpdateRoleMutation,
	useAssignPermissionsMutation,
	useUnassignPermissionsMutation,
	useGetPermissionsQuery,
	useDeleteRoleMutation,
} = adminApi;
export const adminApiReducer = adminApi.reducer;
export const adminApiMiddleware = adminApi.middleware;
