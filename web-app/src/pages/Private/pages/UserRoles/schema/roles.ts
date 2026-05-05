import { z } from "zod";

import { ERROR_TYPE } from "@/utils";
import { ChipsListItemSchema } from "@/schemas/chips";

import { PermissionSchema } from "../../Users/schema/permissions";

const { REQUIRED } = ERROR_TYPE;

// USER ROLE //
export const UserRoleSchema = z.object({
	id: z.number().gt(0),
	name: z.string().min(1),
	code: z.string(),
	description: z.string().min(1),
	permissions: z.array(PermissionSchema),
});

export type UserRole = z.infer<typeof UserRoleSchema>;
///////////////

// CREATE ROLE //
export const CreateRoleRequestSchema = z.object({
	name: z.string().min(3, { message: REQUIRED }).trim(),
	code: z.string().min(3, { message: REQUIRED }).trim(),
	description: z.string().min(3, { message: REQUIRED }).trim(),
	permissions: z.array(z.string()).min(1, { message: REQUIRED }),
});

export const CreateRoleFormSchema = CreateRoleRequestSchema.omit({ permissions: true }).extend({
	permissions: ChipsListItemSchema.array().min(1, { message: REQUIRED }),
});

export const CreateRoleResponseSchema = CreateRoleRequestSchema.omit({ permissions: true }).extend({
	id: z.number().gt(0),
	permissions: z.array(PermissionSchema),
});

export type CreateRoleForm = z.infer<typeof CreateRoleFormSchema>;
export type CreateRoleRequest = z.infer<typeof CreateRoleRequestSchema>;
///////////////

// UPDATE ROLE //
export const UpdateRoleFormSchema = CreateRoleFormSchema.partial();
export const UpdateRoleSchema = CreateRoleRequestSchema.partial();
export const UserRolePartialFormSchema = CreateRoleRequestSchema.omit({
	permissions: true,
}).partial();
export const UpdateRoleResponseSchema = CreateRoleResponseSchema;

export type UpdateRoleForm = z.infer<typeof UpdateRoleFormSchema>;
export type UpdateRole = z.infer<typeof UpdateRoleSchema>;
export type UserRolePartialForm = z.infer<typeof UserRolePartialFormSchema>;
///////////////

// DELETE ROLE //
export const DeleteRoleRequestSchema = z.number().gt(0);
export const DeleteRoleResponseSchema = CreateRoleResponseSchema;
///////////////

export const GetRolesResponseSchema = z.object({
	data: z.array(UserRoleSchema),
});

export const UpdateRolePermissionResponseSchema = CreateRoleResponseSchema;
