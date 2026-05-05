import { z } from "zod";

const ChipColorSchema = z.union([
	z.literal("primary"),
	z.literal("secondary"),
	z.literal("error"),
	z.literal("info"),
	z.literal("warning"),
	z.literal("success"),
]);

export const ChipsListItemSchema = z.object({
	id: z.string().optional(),
	identifier: z.string(),
	color: ChipColorSchema,
	name: z.string(),
});

export type ChipsListItem = z.infer<typeof ChipsListItemSchema>;
export type ChipColor = z.infer<typeof ChipColorSchema>;
