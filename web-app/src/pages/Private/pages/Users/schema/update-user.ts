import { z } from "zod";

import { InviteFormSchema } from "./invite-user";

export const UpdateUserFormSchema = InviteFormSchema.partial();
export const UpdateUserSchema = UpdateUserFormSchema.omit({ companyId: true, role: true });

export type UpdateUserForm = z.infer<typeof UpdateUserFormSchema>;
export type UpdateUser = z.infer<typeof UpdateUserSchema>;

export const UpdateUserRolesSchema = z.object({
	roleId: z.number().gt(0),
});

export type UpdateUserRoles = z.infer<typeof UpdateUserRolesSchema>;
