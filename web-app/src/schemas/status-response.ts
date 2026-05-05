import { z } from "zod";

export const StatusResponseSchema = z.object({
	status: z.string(),
});

export type StatusResponse = z.infer<typeof StatusResponseSchema>;
