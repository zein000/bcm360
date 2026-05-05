import { ApiExtraModels, ApiProperty } from "@nestjs/swagger";
import { IsArray } from "class-validator";

import { PageMetaDTO } from "./page-meta.dto";

@ApiExtraModels(PageMetaDTO)
export class PageDTO<T> {
	@IsArray()
	@ApiProperty({ isArray: true, description: "Array of data" })
	readonly data: T[];

	@ApiProperty({ type: () => PageMetaDTO, description: "Pagination info" })
	readonly meta: PageMetaDTO;

	constructor(data: T[], meta: PageMetaDTO) {
		this.data = data;
		this.meta = meta;
	}
}
