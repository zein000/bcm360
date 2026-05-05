import { z } from "zod";

import { MetaDataSchema } from "@/schemas/meta-data";

import { CompanySchema } from "../../Company/schema/company";
import { DecisionConfirmationTypes } from "../../Course/enums/DecisionConfirmationTypes.enum";
import { FileTypes } from "../enums/FileTypes.enum";
import { FileAssignment } from "../enums/FileAssignment.enum";
import { PhaseEndResult } from "../enums/PhaseEndResult.enum";

// Position-Schema definieren
const PositionSchema = z.object({
	x: z.number(),
	y: z.number(),
});

export const CourseFileSchema = z.object({
	id: z.number(),
	fullFilePath: z.string(),
	fileName: z.string(),
	fileType: z.nativeEnum(FileTypes),
	fileAssignment: z.nativeEnum(FileAssignment),
	fileLength: z.number(),
});

export const CourseTagSchema = z.object({
	id: z.number().optional(),
	name: z.string().optional(),
});

export const CoursesSchema = z.object({
	id: z.number(),
	name: z.string(),
	description: z.string(),
	forWhom: z.string(),
	json: z
		.string()
		.transform((arg) => JSON.parse(arg))
		.optional(),
	company: CompanySchema,
	courseFiles: CourseFileSchema.array(),
	tag: CourseTagSchema,
});

export const CreateCoursesSchema = z.object({
	name: z.string(),
	description: z.string(),
	forWhom: z.string(),
	json: z.any().optional(),
	tag: CourseTagSchema.optional(),
});

export const JsonSchema = z.object({
	scenarioName: z.string(),
	author: z.string(),
	Content: z.array(
		z
			.object({
				id: z.number().nullable(),
				phaseName: z.string(),
				timeLimit: z.number().optional(),
				phaseEndText: z.string().optional(),
				phaseEndResult: z.nativeEnum(PhaseEndResult).optional(),
				confirmationRequired: z.nativeEnum(DecisionConfirmationTypes).optional(),
				timeLeftDecisionId: z.number().min(0).optional(),
				content: z.string(),
				contentType: z.nativeEnum(FileTypes),
				decisionName: z.string().optional(),
				autoplay: z.boolean().optional().default(false),
				spoilerContent: z
					.object({
						content: z.string(),
						title: z.string().optional(),
					})
					.optional(),
				decisionOptions: z
					.array(
						z.object({
							option: z.string(),
							phaseId: z.number(),
							position: PositionSchema.optional(), // position hier optional hinzufügen
						})
					)
					.min(1, { message: "The array must have at least one element" })
					.optional(),
				timeDelayedContent: z
					.array(
						z
							.object({
								content: z.string(),
								startTimeInSeconds: z.number(),
								endTimeInSeconds: z.number().optional(),
								contentType: z.nativeEnum(FileTypes),
								title: z.string(),
								autoplay: z.boolean().optional().default(false),
							})
							.refine(
								(data) =>
									!data.endTimeInSeconds || data.endTimeInSeconds > data.startTimeInSeconds + 10,
								{
									message:
										"endTimeInSeconds must be at least 10 seconds greater than startTimeInSeconds",
									path: ["endTimeInSeconds"],
								}
							)
					)
					.optional(),
				position: PositionSchema.optional(), // position hier hinzufügen
			})
			.refine(
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				(data: any) => {
					const fields = [data?.decisionName, data?.decisionOptions, data?.confirmationRequired];
					const definedFields = fields.filter((field) => field !== undefined);

					return definedFields.length === 0 || definedFields.length === fields.length;
				},
				{
					message:
						"If one of 'decisionName', 'decisionOptions', or 'confirmationRequired' is provided, all three are required.",
					path: [],
				}
			)
	),
	timeDelayedContent: z
		.array(
			z
				.object({
					content: z.string(),
					startTimeInSeconds: z.number(),
					endTimeInSeconds: z.number().optional(),
					contentType: z.nativeEnum(FileTypes),
					title: z.string(),
					autoplay: z.boolean().optional().default(false),
				})
				.refine(
					(data) => !data.endTimeInSeconds || data.endTimeInSeconds > data.startTimeInSeconds + 10,
					{
						message: "endTimeInSeconds must be at least 10 seconds greater than startTimeInSeconds",
						path: ["endTimeInSeconds"],
					}
				)
		)
		.optional(),
});

export const UpdateCoursesSchema = z.object({
	id: z.number().optional(),
	name: z.string().min(1, "Name is required").optional(),
	description: z.string().min(1, "Description is required").optional(),
	forWhom: z.string().optional(),
	json: JsonSchema.optional(),
	tag: CourseTagSchema.optional(),
	image_small: z.any(),
	image_big: z.any(),
	trailer_video: z.any(),
	course_file: z.any(),
});

export const CoursesResponseSchema = z.object({
	data: z.array(CoursesSchema),
	meta: MetaDataSchema,
});

export type Courses = z.infer<typeof CoursesSchema>;

export type CourseTag = z.infer<typeof CourseTagSchema>;

export type CourseFile = z.infer<typeof CourseFileSchema>;

export type CreateCourses = z.infer<typeof CreateCoursesSchema>;

export type UpdateCourses = z.infer<typeof UpdateCoursesSchema>;

export type CoursesResponse = z.infer<typeof CoursesResponseSchema>;
