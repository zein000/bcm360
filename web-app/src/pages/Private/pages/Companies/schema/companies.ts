import { z } from "zod";

import { MetaDataSchema } from "@/schemas/meta-data";

import { UserSchema } from "../../Users/schema/invite-user";

export const CompaniesSchema = z.object({
	id: z.number(),
	name: z.string(),
	admins: z.array(UserSchema),
	users: z.array(UserSchema),
});

export const CreateCompaniesSchema = z.object({
	name: z.string(),
});

export const UpdateCompaniesSchema = z.object({
	id: z.number().optional(),
	name: z.string(),
});

export const CompaniesResponseSchema = z.object({
	data: z.array(CompaniesSchema),
	meta: MetaDataSchema,
});

export type Companies = z.infer<typeof CompaniesSchema>;

export type CreateCompanies = z.infer<typeof CreateCompaniesSchema>;

export type UpdateCompanies = z.infer<typeof UpdateCompaniesSchema>;

export type CompaniesResponse = z.infer<typeof CompaniesResponseSchema>;
