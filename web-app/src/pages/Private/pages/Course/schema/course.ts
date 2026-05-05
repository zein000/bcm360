import { z } from "zod";

import { CompanySchema } from "../../Company/schema/company";
import { CourseFileSchema, CourseTagSchema, JsonSchema } from "../../Courses/schema/courses";

export const CourseSchema = z.object({
	id: z.number().gt(0),
	name: z.string(),
	json: JsonSchema.optional(),
	company: CompanySchema,
	description: z.string(),
	forWhom: z.string(),
	tag: CourseTagSchema.optional(),
	courseFiles: CourseFileSchema.array(),
});

export const UpdateCourseSchema = z.object({
	name: z.string(),
	json: JsonSchema.optional(),
});

export type CourseType = z.infer<typeof CourseSchema>;
export type UpdateCourse = z.infer<typeof UpdateCourseSchema>;
