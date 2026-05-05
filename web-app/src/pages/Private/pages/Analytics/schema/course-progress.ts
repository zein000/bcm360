import { z } from "zod";

import { MetaDataSchema } from "@/schemas/meta-data";

import { CourseProgressEnum } from "../../Course/enums/CourseProgressEnum.enum";
import { CourseSchema } from "../../Course/schema/course";
import { UserSchema } from "../../Users/schema/invite-user";
import { ScenarioMessageTypes } from "../../Course/enums/ScenarioMessageTypes.enum";
import { FileTypes } from "../../Courses/enums/FileTypes.enum";

export const CourseProgressUserSchema = z.object({
	id: z.string(),
	firstName: z.string(),
	lastName: z.string(),
	email: z.string(),
	isAccepted: z.boolean(),
	isERR: z.boolean(),
	firstJoinTimeStamp: z.number(),
	exitTimeStamp: z.number(),
	invitedTimeStamp: z.number(),
});

export const ProtocolDecisionSchema = z.object({
	id: z.string(),
	decision: z.string(),
	finalDecision: z.string(),
});

export const ProtocolMessageSchema = z.object({
	id: z.string(),
	message: z.string(),
});

export const ProtocolHistoriesSchema = z.object({
	id: z.string(),
	type: z.nativeEnum(ScenarioMessageTypes),
	timestamp: z.number(),
	protocolDecisions: ProtocolDecisionSchema.optional(),
	protocolMessages: ProtocolMessageSchema.optional(),
});

export const CourseProgressContentSchema = z.object({
	id: z.string(),
	title: z.string(),
	content: z.string(),
	stageNumber: z.number(),
	contentType: z.nativeEnum(FileTypes),
	timestamp: z.number(),
});

export const CourseProgressSchema = z.object({
	id: z.string(),
	status: z.nativeEnum(CourseProgressEnum),
	finalPhaseId: z.number(),
	scenarioEndMessage: z.string(),
	course: CourseSchema,
	user: UserSchema,
	users: CourseProgressUserSchema.array(),
	content: CourseProgressContentSchema.array(),
	protocolHistories: ProtocolHistoriesSchema.array(),
	finishDate: z.date().optional(),
	createdAt: z.date(),
});

export const CoursesProgressResponseSchema = z.object({
	data: z.array(CourseProgressSchema),
	meta: MetaDataSchema,
});

export type CourseProgress = z.infer<typeof CourseProgressSchema>;
export type CourseProgressUser = z.infer<typeof CourseProgressUserSchema>;
export type ProtocolDecision = z.infer<typeof ProtocolDecisionSchema>;
export type ProtocolMessage = z.infer<typeof ProtocolMessageSchema>;
export type ProtocolHistories = z.infer<typeof ProtocolHistoriesSchema>;
export type CoursesProgressResponse = z.infer<typeof CoursesProgressResponseSchema>;
