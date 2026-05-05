import { api } from "@/redux/api";

import { RequestPaginationParams } from "@/types/request-params";

import {
	Companies,
	CompaniesResponse,
	CompaniesResponseSchema,
	CompaniesSchema,
	CreateCompanies,
} from "../../pages/Companies/schema/companies";

export const companiesApi = api.injectEndpoints({
	endpoints: (builder) => ({
		getCompanies: builder.query<CompaniesResponse, RequestPaginationParams>({
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
					url: `company?${queryParams.toString()}`,
					responseSchema: CompaniesResponseSchema,
				};
			},
			providesTags: ["Companies"],
		}),
		getCompany: builder.query<Companies, number>({
			query: (id: number) => ({
				url: `company/${id}`,
				params: {
					id,
				},
				responseSchema: CompaniesSchema,
			}),
			providesTags: ["Companies"],
		}),
		createCompanies: builder.mutation<Partial<Companies>, CreateCompanies>({
			query: (body) => ({
				url: `company`,
				method: "POST",
				body,
				responseSchema: CompaniesSchema,
			}),
			invalidatesTags: ["Companies"],
		}),
		updateCompanies: builder.mutation<Partial<Companies>, Partial<Companies>>({
			query: ({ id, ...body }) => ({
				url: `company/${id}`,
				method: "PATCH",
				body,
				responseSchema: CompaniesSchema,
			}),
			invalidatesTags: ["Companies"],
		}),
		deleteCompanies: builder.mutation<Partial<Companies>, number>({
			query: (id) => ({
				url: `company/${id}`,
				method: "DELETE",
				responseSchema: CompaniesSchema,
			}),
			invalidatesTags: ["Companies"],
		}),
	}),
});

export const {
	useGetCompaniesQuery,
	useGetCompanyQuery,
	useUpdateCompaniesMutation,
	useDeleteCompaniesMutation,
	useCreateCompaniesMutation,
} = companiesApi;
export const accountApiReducer = companiesApi.reducer;
export const accountApiMiddleware = companiesApi.middleware;
