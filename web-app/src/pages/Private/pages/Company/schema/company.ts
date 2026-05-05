import { z } from "zod";

export const CompanySchema = z.object({
	id: z.number().gt(0),
	name: z.string(),
});

export const UpdateCompanySchema = z.object({
	name: z.string(),
});

export type CompanyType = z.infer<typeof CompanySchema>;
export type UpdateCompany = z.infer<typeof UpdateCompanySchema>;
