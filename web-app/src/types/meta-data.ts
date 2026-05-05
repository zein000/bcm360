import { z } from "zod";

export interface MetaData {
	page: number;
	limit: number;
	itemCount: number;
	pageCount: number;
	hasPreviousPage: boolean;
	hasNextPage: boolean;
}

export const MetaDataSchema = z.object({
	page: z.number().gt(0),
	limit: z.number(),
	itemCount: z.number(),
	pageCount: z.number(),
	hasPreviousPage: z.boolean(),
	hasNextPage: z.boolean(),
});
