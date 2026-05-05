import { z } from "zod";

import { ERROR_TYPE } from "@/utils";
import { FetchMeResponseSchema } from "@/pages/Public/pages/Login/schema/login";
import { PermissionRoles } from "@/enum";

const { INVALID_EMAIL, REQUIRED } = ERROR_TYPE;

export const InviteOnScenarioSchema = z.object({
	email: z.string().email(INVALID_EMAIL),
	permissions: z.nativeEnum(PermissionRoles).array(),
});

export const AcceptInvitationUserSchema = z.object({
	firstName: z.string().min(2, { message: REQUIRED }).trim(),
	lastName: z.string().min(2, { message: REQUIRED }).trim(),
});

export const AcceptInvitationRequestSchema = z.object({
	user: AcceptInvitationUserSchema,
	courseProgressId: z.string(),
	accessToken: z.string(),
});

export const CheckIfAlreadyExistSchema = z.object({
	courseProgressId: z.string(),
	accessToken: z.string(),
});

export const InviteOnScenarioRequestSchema = z.object({
	users: z.array(InviteOnScenarioSchema),
	courseProgressId: z.string(),
});

export const AcceptInvitationResponseSchema = z.object({
	user: FetchMeResponseSchema,
	accessToken: z.string(),
	courseProgressId: z.string(),
});

export type AcceptInvitationRequest = z.infer<typeof AcceptInvitationRequestSchema>;
export type CheckIfAlreadyExistRequest = z.infer<typeof CheckIfAlreadyExistSchema>;
export type AcceptInvitationResponse = z.infer<typeof AcceptInvitationResponseSchema>;
export type InviteOnScenarioRequest = z.infer<typeof InviteOnScenarioRequestSchema>;
