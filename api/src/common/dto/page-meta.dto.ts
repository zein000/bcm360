import { ApiProperty } from "@nestjs/swagger";

import { PageMetaParametersDTO } from "../interfaces";

export class PageMetaDTO {
	@ApiProperty()
	readonly page: number;

	@ApiProperty()
	readonly limit: number;

	@ApiProperty()
	readonly itemCount: number;

	@ApiProperty()
	readonly pageCount: number;

	@ApiProperty()
	readonly hasPreviousPage: boolean;

	@ApiProperty()
	readonly hasNextPage: boolean;

	constructor({ pageOptions, itemCount }: PageMetaParametersDTO) {
		this.page = pageOptions.page;
		this.limit = pageOptions.limit;
		this.itemCount = itemCount;
		this.pageCount = Math.ceil(this.itemCount / this.limit);
		this.hasPreviousPage = this.page > 1;
		this.hasNextPage = this.page < this.pageCount;
	}
}
