import { z } from "zod";

export const MetaDataSchema = z.object({
	page: z.number(),
	limit: z.number(),
	itemCount: z.number(),
	pageCount: z.number(),
	hasPreviousPage: z.boolean(),
	hasNextPage: z.boolean(),
});

export const ApolloMetaDataSchema = z.object({
	page: z.number(),
	per_page: z.number(),
	total_entries: z.number(),
	total_pages: z.number(),
});

export type MetaData = z.infer<typeof MetaDataSchema>;
