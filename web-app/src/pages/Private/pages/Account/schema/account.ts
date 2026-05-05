import { z } from "zod";

import { PASSWORD_REGEX } from "@/constants";
import { ERROR_TYPE } from "@/utils";

import { UserLanguage } from "@/enum/user.enum";

import { UpdateUserFormSchema } from "../../Users/schema/update-user";

const { PASSWORD_GUIDELINES, PASSWORD_MISMATCH, REQUIRED, INVALID_EMAIL } = ERROR_TYPE;

export const UpdateFirstNameSchema = UpdateUserFormSchema.pick({ firstName: true });
export const UpdateLastNameSchema = UpdateUserFormSchema.pick({ lastName: true });
export const UpdateLinkedinUrlSchema = UpdateUserFormSchema.pick({ linkedinUrl: true });

export const UpdateMeRequestSchema = UpdateUserFormSchema.omit({ email: true, role: true })
	.extend({
		is2FAEnabled: z.boolean().optional(),
		autoAccept: z.boolean().optional(),
		userLanguage: z.nativeEnum(UserLanguage).optional(),
	})
	.partial();

export const ChangePasswordSchema = z
	.object({
		oldPassword: z.string().min(1, { message: REQUIRED }).trim(),
		password: z
			.string()
			.min(1, { message: REQUIRED })
			.regex(PASSWORD_REGEX, PASSWORD_GUIDELINES)
			.trim(),
		confirmPassword: z.string().min(1, { message: REQUIRED }).trim(),
	})
	.superRefine(({ confirmPassword, password }, ctx) => {
		if (confirmPassword !== password) {
			ctx.addIssue({
				code: "custom",
				path: ["confirmPassword"],
				message: PASSWORD_MISMATCH,
			});
		}
	});

export const LinkedinConnectionsSchema = z.object({
	file: z.string(),
});

export const UpdateMyProfileInformationSchema = z.object({
	firstName: z.string().min(2, { message: REQUIRED }).trim(),
	lastName: z.string().min(2, { message: REQUIRED }).trim(),
	email: z.string().email(INVALID_EMAIL),
});

export type UpdateFirstName = z.infer<typeof UpdateFirstNameSchema>;
export type UpdateLastName = z.infer<typeof UpdateLastNameSchema>;
export type UpdateLinkedinUrl = z.infer<typeof UpdateLinkedinUrlSchema>;
export type UpdateMeBody = z.infer<typeof UpdateMeRequestSchema>;
export type ChangePassword = z.infer<typeof ChangePasswordSchema>;
export type LinkedinConnections = z.infer<typeof LinkedinConnectionsSchema>;
export type UpdateMyProfileInformation = z.infer<typeof UpdateMyProfileInformationSchema>;
