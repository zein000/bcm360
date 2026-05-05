import { z } from "zod";

import { ERROR_TYPE } from "@/utils";

const { REQUIRED } = ERROR_TYPE;

export const TwoFactorAuthSchema = z.object({
	code: z.string().min(1, { message: REQUIRED }).trim(),
});

export type TwoFactorAuth = z.infer<typeof TwoFactorAuthSchema>;
