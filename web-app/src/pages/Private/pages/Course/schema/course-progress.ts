import { z } from "zod";

import { CourseProgressEnum } from "@/enum/course-progress.enum";

import { UserSchema } from "../../Users/schema/invite-user";
import { CourseSchema } from "./course";

export const CourseProgressResponseSchema = z.object({
	id: z.string().min(10),
	currentStage: z.number(),
	status: z.enum(Object.values(CourseProgressEnum) as [string, ...string[]]),
	course: CourseSchema,
	user: UserSchema,
});

export const StartCourseSchema = z.object({
	courseId: z.number(),
	userId: z.number(),
});

export type CourseProgressResponse = z.infer<typeof CourseProgressResponseSchema>;
export type StartCourseProgress = z.infer<typeof StartCourseSchema>;
