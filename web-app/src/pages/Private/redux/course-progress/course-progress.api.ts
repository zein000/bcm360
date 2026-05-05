import { api } from "@/redux/api";

import { User } from "@/pages/Public/pages/Login/schema/login";

import { RequestPaginationParams } from "@/types/request-params";

import {
	CourseProgressResponse,
	CourseProgressResponseSchema,
	StartCourseProgress,
} from "../../pages/Course/schema/course-progress";
import {
	AcceptInvitationRequest,
	AcceptInvitationRequestSchema,
	AcceptInvitationResponseSchema,
	AcceptInvitationResponse,
	InviteOnScenarioRequest,
	InviteOnScenarioRequestSchema,
	CheckIfAlreadyExistRequest,
} from "../../pages/Course/schema/invite-users";
import {
	CoursesProgressResponse,
	CoursesProgressResponseSchema,
} from "../../pages/Analytics/schema/course-progress";
import { ExportScenarioReport } from "../../pages/Course/schema/export-report";

export const coursesProgressApi = api.injectEndpoints({
	endpoints: (builder) => ({
		getCourseProgresses: builder.query<CoursesProgressResponse, RequestPaginationParams>({
			query: (params) => ({
				url: "course-progress",
				params: {
					...(params && { ...params }),
				},
				responseSchema: CoursesProgressResponseSchema,
			}),
			providesTags: ["CourseProgress"],
		}),
		checkIfScenarioInProgressExist: builder.query<CourseProgressResponse, void>({
			query: () => ({
				url: "course-progress/check-scenario-in-progress",
				responseSchema: CoursesProgressResponseSchema,
			}),
			providesTags: ["CourseProgress"],
		}),
		startScenario: builder.mutation<Partial<CourseProgressResponse>, StartCourseProgress>({
			query: (body) => {
				return {
					url: `course-progress/start`,
					method: "POST",
					body,
					responseSchema: CourseProgressResponseSchema,
				};
			},
			invalidatesTags: ["CourseProgress"],
		}),
		getScenarioProgress: builder.query<CourseProgressResponse, string>({
			query: (id: string) => ({
				url: `course-progress/${id}`,
				params: {
					id,
				},
				responseSchema: CourseProgressResponseSchema,
			}),
		}),
		inviteOnScenarioUser: builder.mutation<Partial<User>[], InviteOnScenarioRequest>({
			query: (body) => ({
				url: "course-progress/invite",
				method: "POST",
				body,
				requestSchema: InviteOnScenarioRequestSchema,
			}),
		}),
		acceptCourseProgressInvitation: builder.mutation<
			AcceptInvitationResponse,
			AcceptInvitationRequest
		>({
			query: (body) => ({
				url: "course-progress/accept-invite",
				method: "POST",
				body,
				headers: {
					authorization: `Bearer ${body.accessToken}`,
				},
				requestSchema: AcceptInvitationRequestSchema,
				responseSchema: AcceptInvitationResponseSchema,
			}),
		}),
		checkIfAlreadyAccepted: builder.mutation<AcceptInvitationResponse, CheckIfAlreadyExistRequest>({
			query: (body) => ({
				url: `course-progress/check-invitation`,
				method: "POST",
				body,
				headers: {
					authorization: `Bearer ${body.accessToken}`,
				},
				responseSchema: AcceptInvitationResponseSchema,
			}),
		}),
		deleteScenarioProgress: builder.mutation<void, string>({
			query: (id) => ({
				url: `course-progress/${id}`,
				method: "DELETE",
			}),
			invalidatesTags: ["CourseProgress"],
		}),
		exportCourseProgress: builder.mutation<Blob, ExportScenarioReport>({
			query: ({ id, fileType, format }) => ({
				url: `course-progress/report/${id}`,
				method: "POST",
				body: { fileType, format },
				responseHandler: async (response) => response.blob(),
			}),
		}),
		generateInviteLink: builder.mutation<string, { courseProgressId: string; email: string }>({
			query: ({ email, courseProgressId }) => ({
				url: "course-progress/generate-invite-link",
				method: "POST",
				body: { email, courseProgressId },
			}),
		}),
	}),
});

export const {
	useGetScenarioProgressQuery,
	useStartScenarioMutation,
	useInviteOnScenarioUserMutation,
	useAcceptCourseProgressInvitationMutation,
	useCheckIfAlreadyAcceptedMutation,
	useGetCourseProgressesQuery,
	useDeleteScenarioProgressMutation,
	useExportCourseProgressMutation,
	useLazyCheckIfScenarioInProgressExistQuery,
	useGenerateInviteLinkMutation,
} = coursesProgressApi;
export const accountApiReducer = coursesProgressApi.reducer;
export const accountApiMiddleware = coursesProgressApi.middleware;
