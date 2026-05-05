import { z } from "zod";

import { ERROR_TYPE } from "@/utils";

const { REQUIRED, INVALID_EMAIL } = ERROR_TYPE;

export const ForgotPasswordSchema = z.object({
	email: z.string().min(1, { message: REQUIRED }).email(INVALID_EMAIL),
});

export type ForgotPasswordType = z.infer<typeof ForgotPasswordSchema>;

export const ForgotPasswordRequestSchema = z.object({
	email: z.string().email(INVALID_EMAIL),
});
