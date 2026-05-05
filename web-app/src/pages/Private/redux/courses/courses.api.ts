import { api } from "@/redux/api";

import { RequestPaginationParams } from "@/types/request-params";

import {
	CourseFile,
	Courses,
	CoursesResponse,
	CoursesResponseSchema,
	CoursesSchema,
	CourseTag,
	CourseTagSchema,
} from "../../pages/Courses/schema/courses";

export const coursesApi = api.injectEndpoints({
	endpoints: (builder) => ({
		getCourses: builder.query<CoursesResponse, RequestPaginationParams>({
			query: (params) => ({
				url: "course",
				params: {
					...(params && { ...params }),
				},
				responseSchema: CoursesResponseSchema,
			}),
			providesTags: ["Courses"],
		}),
		getTags: builder.query<CourseTag[], void>({
			query: () => ({
				url: "course/tags",
				responseSchema: CourseTagSchema,
			}),
		}),
		getCourse: builder.query<Courses, number>({
			query: (id: number) => ({
				url: `course/${id}`,
				params: {
					id,
				},
				responseSchema: CoursesSchema,
			}),
			providesTags: ["Courses"],
		}),
		getRelatedCourses: builder.query<Courses[], number>({
			query: (id: number) => ({
				url: `course/${id}/related`,
				responseSchema: CoursesSchema.array(),
			}),
			providesTags: ["Courses"],
		}),
		createCourses: builder.mutation<Partial<Courses>, Partial<Courses>>({
			query: (body) => {
				const { json, ...rest } = body;

				return {
					url: `course`,
					method: "POST",
					body: {
						...rest,
						json: typeof json === "string" ? json : JSON.stringify(json),
					},
					responseSchema: CoursesSchema,
				};
			},
			invalidatesTags: ["Courses"],
		}),

		updateCourses: builder.mutation<Partial<Courses>, Partial<Courses>>({
			query: ({ id, json, ...rest }) => {
				return {
					url: `course/${id}`,
					method: "PATCH",
					body: {
						...rest,
						json: typeof json === "string" ? json : JSON.stringify(json),
					},
					responseSchema: CoursesSchema,
				};
			},
			invalidatesTags: ["Courses"],
		}),
		deleteCourses: builder.mutation<Partial<Courses>, number>({
			query: (id) => ({
				url: `course/${id}`,
				method: "DELETE",
				responseSchema: CoursesSchema,
			}),
			invalidatesTags: ["Courses"],
		}),
		uploadCourseFiles: builder.mutation<Partial<CourseFile>[], FormData>({
			query: (body) => ({
				url: "course/files/upload",
				method: "POST",
				body,
			}),
		}),
		deleteCourseFile: builder.mutation<void, string>({
			query: (filePath) => ({
				url: `course/file/delete`,
				method: "DELETE",
				body: {
					filePath,
				},
			}),
		}),
	}),
});

export const {
	useGetCoursesQuery,
	useGetTagsQuery,
	useGetCourseQuery,
	useGetRelatedCoursesQuery,
	useUpdateCoursesMutation,
	useDeleteCoursesMutation,
	useCreateCoursesMutation,
	useDeleteCourseFileMutation,
	useUploadCourseFilesMutation,
} = coursesApi;
export const accountApiReducer = coursesApi.reducer;
export const accountApiMiddleware = coursesApi.middleware;
