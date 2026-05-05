import { z } from "zod";

import { ERROR_TYPE } from "@/utils";
import { TokenPurpose } from "@/enum";
import { PASSWORD_REGEX } from "@/constants";

const { PASSWORD_GUIDELINES, PASSWORD_MISMATCH, REQUIRED, ACCEPT_TERMS } = ERROR_TYPE;

export const SetPasswordSchema = z
	.object({
		termsAndConditions: z.boolean(),
		password: z
			.string()
			.min(1, { message: REQUIRED })
			.regex(PASSWORD_REGEX, PASSWORD_GUIDELINES)
			.trim(),
		confirmPassword: z.string().min(1, { message: REQUIRED }).trim(),
	})
	.superRefine(({ confirmPassword, password, termsAndConditions }, ctx) => {
		if (confirmPassword !== password) {
			ctx.addIssue({
				code: "custom",
				path: ["confirmPassword"],
				message: PASSWORD_MISMATCH,
			});
		}

		if (!termsAndConditions) {
			ctx.addIssue({
				code: "custom",
				path: ["termsAndConditions"],
				message: ACCEPT_TERMS,
			});
		}
	});

export const SetPasswordRequestSchema = z.object({
	password: z.string().min(8),
	confirmPassword: z.string().min(8),
	token: z.string().min(1, { message: REQUIRED }),
	purpose: z.nativeEnum(TokenPurpose),
});

export type SetPasswordType = z.infer<typeof SetPasswordSchema>;
export type SetPasswordBody = z.infer<typeof SetPasswordRequestSchema>;
