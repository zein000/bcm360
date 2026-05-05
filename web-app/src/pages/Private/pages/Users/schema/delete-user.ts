import { z } from "zod";

export const DeleteUserSchema = z.object({
	userId: z.number().gt(0),
});

export type DeletedUser = z.infer<typeof DeleteUserSchema>;
