import { api } from "@/redux/api";

import { User } from "@/pages/Public/pages/Login/schema/login";

import { UpdateCompany } from "../../pages/Company/schema/company";

export const companyApi = api.injectEndpoints({
	endpoints: (builder) => ({
		update: builder.mutation<User, UpdateCompany>({
			query: (body) => ({
				url: "company",
				method: "PATCH",
				body,
			}),
			invalidatesTags: ["Me", "Company"],
		}),
		getCompany: builder.query<User, { id: number }>({
			query: ({ id }) => ({
				url: `company/${id}`,
				method: "GET",
			}),
			providesTags: (result, error, arg) => [{ type: "Company", id: arg.id }],
		}),
	}),
});

export const { useUpdateMutation, useGetCompanyQuery } = companyApi;
export const companyApiReducer = companyApi.reducer;
export const companyApiMiddleware = companyApi.middleware;
