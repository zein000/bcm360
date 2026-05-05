import { z } from "zod";

import { ERROR_TYPE } from "@/utils";
import { MetaDataSchema } from "@/schemas/meta-data";

const { REQUIRED } = ERROR_TYPE;

export const PermissionSchema = z.object({
	id: z.number().gt(0),
	name: z.string().min(1),
	code: z.string().min(1),
	description: z.string().min(1),
});

export type Permission = z.infer<typeof PermissionSchema>;

export const UpdateRolePermissionsRequestSchema = z.object({
	permissions: z.array(z.string()).min(1, { message: REQUIRED }),
});

export type UpdateRolePermissions = z.infer<typeof UpdateRolePermissionsRequestSchema>;

export const GetPermissionsResponseSchema = z.object({
	data: z.array(PermissionSchema),
	meta: MetaDataSchema,
});

export const ParticipantPermissionsResponseSchema = z.object({
	data: z.array(PermissionSchema),
});

export type ParticipantPermissionsResponse = z.infer<typeof ParticipantPermissionsResponseSchema>;
