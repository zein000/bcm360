import { z } from "zod";

import { UserStatus } from "@/enum";
import { UserLanguage } from "@/enum/user.enum";
import { FetchMeResponseSchema } from "@/pages/Public/pages/Login/schema/login";
import { ERROR_TYPE } from "@/utils";

const { REQUIRED, INVALID_EMAIL } = ERROR_TYPE;

export const UserSchema = z.object({
	id: z.number().gt(0),
	firstName: z.string().min(1).optional(),
	lastName: z.string().min(1).optional(),
	email: z.string().email(INVALID_EMAIL),
	is2FAEnabled: z.boolean(),
	isBlocked: z.boolean(),
	status: z.nativeEnum(UserStatus),
	userlanguage: z.nativeEnum(UserLanguage).optional(),
	autoAccept: z.boolean(),
});

export const InviteSchema = z.object({
	firstName: z.string().min(2, { message: REQUIRED }).trim().optional(),
	lastName: z.string().min(2, { message: REQUIRED }).trim().optional(),
	linkedinUrl: z.string().trim().optional(),
	email: z.string().email(INVALID_EMAIL),
	roleId: z.number().gt(0),
});

export const InviteRequestSchema = z.object({
	users: z.array(InviteSchema),
	companyId: z.number().optional(),
});

export const CustomerSchema = z.object({
	firstName: z.string().min(2, { message: REQUIRED }).trim(),
	lastName: z.string().min(2, { message: REQUIRED }).trim(),
	email: z.string().email(INVALID_EMAIL),
});

export const InviteFormSchema = InviteSchema.extend({
	companyId: z.number().optional(),
});

export const InviteResponseSchema = z.array(FetchMeResponseSchema.partial());

export type InviteRequest = z.infer<typeof InviteRequestSchema>;
export type ResendInviteRequest = z.infer<typeof InviteSchema>;
export type InviteForm = z.infer<typeof InviteFormSchema>;
export type Customer = z.infer<typeof CustomerSchema>;
export type UserSchemaType = z.infer<typeof UserSchema>;
