import { api } from "@/redux/api";

import { User } from "@/pages/Public/pages/Login/schema/login";

import { UpdateCourse } from "../../pages/Course/schema/course";

export const courseApi = api.injectEndpoints({
	endpoints: (builder) => ({
		update: builder.mutation<User, UpdateCourse>({
			query: (body) => ({
				url: "course",
				method: "PATCH",
				body,
			}),
			invalidatesTags: ["Me", "Course"],
		}),
		getCourse: builder.query<User, { id: number }>({
			query: ({ id }) => ({
				url: `course/${id}`,
				method: "GET",
			}),
			providesTags: (result, error, arg) => [{ type: "Course", id: arg.id }],
		}),
	}),
});

export const { useUpdateMutation, useGetCourseQuery } = courseApi;
export const courseApiReducer = courseApi.reducer;
export const courseApiMiddleware = courseApi.middleware;
