import { z } from "zod";

import { ERROR_TYPE } from "@/utils";

const { REQUIRED } = ERROR_TYPE;

export const FirstLoginSchema = z.object({
	firstName: z.string().min(1, { message: REQUIRED }).trim(),
	lastName: z.string().min(1, { message: REQUIRED }).trim(),
});

export type FirstLoginType = z.infer<typeof FirstLoginSchema>;
