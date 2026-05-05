import {
	BaseQueryFn,
	createApi,
	FetchArgs,
	fetchBaseQuery,
	FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";

import { ZodSchema } from "zod";

import { PARSED_ENV } from "@/constants/common";
import { RootState } from "@/redux";

interface FetchArgsWithSchemas extends FetchArgs {
	requestSchema?: ZodSchema;
	responseSchema?: ZodSchema;
}

export const API_REDUCER_KEY = "api";

const baseQuery = fetchBaseQuery({
	baseUrl: PARSED_ENV.REACT_APP_API_URL + "/api",
	prepareHeaders: (headers: Headers, { getState }) => {
		const token = (getState() as RootState).auth.token;

		if (token) {
			headers.set("authorization", `Bearer ${token}`);
		}

		return headers;
	},
});

const baseQueryWithValidation: BaseQueryFn<
	FetchArgsWithSchemas,
	unknown,
	FetchBaseQueryError
> = async (args, api, extraOptions) => {
	try {
		args.requestSchema?.parse(args.body);
	} catch (err) {
		// console.error(err);
	}

	const result = await baseQuery(args, api, extraOptions);

	try {
		await args.responseSchema?.parseAsync(result.data);
	} catch (err) {
		// console.error(`"${args.url}" response schema validation error\n`, err);
	}

	return result;
};

export const api = createApi({
	reducerPath: API_REDUCER_KEY,
	baseQuery: baseQueryWithValidation,
	tagTypes: [
		"Users",
		"Roles",
		"Companies",
		"Company",
		"Course",
		"CourseProgress",
		"Courses",
		"Me",
		"Campaign",
		"TableConfig",
	],
	endpoints: () => ({}),
});
