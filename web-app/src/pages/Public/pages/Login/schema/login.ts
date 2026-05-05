import { z } from "zod";

import { UserStatus } from "@/enum";
import { UserLanguage } from "@/enum/user.enum";
import { UserRoleSchema } from "@/pages/Private/pages/UserRoles/schema/roles";
import { ERROR_TYPE } from "@/utils";

const { REQUIRED, INVALID_EMAIL, INVALID_VALUE } = ERROR_TYPE;

export const LoginSchema = z.object({
	email: z.string().min(1, { message: REQUIRED }).email(INVALID_EMAIL),
	password: z.string().min(1, { message: REQUIRED }).trim(),
	isRememberMe: z.boolean().optional(),
});

export const LoginRequestSchema = z.object({
	email: z.string().email(INVALID_EMAIL),
	password: z.string().min(8, { message: INVALID_VALUE }),
});

export const CompanySchema = z
	.object({
		id: z.number().gt(0),
		name: z.string().nullable(),
	})
	.nullable();

export const FetchMeResponseSchema = z.object({
	id: z.number().gt(0),
	firstName: z.string().min(1).optional(),
	lastName: z.string().min(1).optional(),
	courseProgressId: z.string().optional(),
	email: z.string().email(INVALID_EMAIL),
	is2FAEnabled: z.boolean(),
	isBlocked: z.boolean(),
	status: z.nativeEnum(UserStatus),
	userLanguage: z.nativeEnum(UserLanguage),
	company: CompanySchema,
	role: UserRoleSchema,
	autoAccept: z.boolean(),
});

export const LoginResponseSchema = z.object({
	accessToken: z.string().optional(),
	otpToken: z.string().optional(),
	user: FetchMeResponseSchema,
	isRememberMe: z.boolean().optional(),
});

export type LoginType = z.infer<typeof LoginSchema>;
export type User = z.infer<typeof FetchMeResponseSchema>;
export type LoginResponse = z.infer<typeof LoginResponseSchema>;
