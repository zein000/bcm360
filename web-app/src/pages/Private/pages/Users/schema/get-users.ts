import { z } from "zod";

import { FetchMeResponseSchema } from "@/pages/Public/pages/Login/schema/login";
import { MetaDataSchema } from "@/schemas/meta-data";

export const GetAllUsersResponseSchema = z.object({
	data: z.array(FetchMeResponseSchema),
	meta: MetaDataSchema,
});
