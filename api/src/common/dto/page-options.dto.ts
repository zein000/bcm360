import { ApiPropertyOptional } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";
import { IsBoolean, IsEnum, IsInt, IsOptional, IsString, Max, Min } from "class-validator";

import { RequestsFilterType } from "src/enums/requests.enum";

export class PageOptionsDTO {
	@ApiPropertyOptional({
		minimum: 1,
		default: 1,
	})
	@Type(() => Number)
	@IsInt()
	@Min(1)
	@IsOptional()
	readonly page?: number = 1;

	@ApiPropertyOptional({
		minimum: 1,
		maximum: 100,
		default: 10,
	})
	@Type(() => Number)
	@IsInt()
	@Min(1)
	@Max(100)
	@IsOptional()
	readonly limit?: number = 10;

	@ApiPropertyOptional({ description: "Text search for event" })
	@IsString()
	@IsOptional()
	readonly searchValue?: string;

	get skip(): number {
		return (this.page - 1) * this.limit;
	}

	@ApiPropertyOptional({ description: "sortBy" })
	@IsString()
	@IsOptional()
	readonly sortBy?: string;

	@ApiPropertyOptional({ description: "sortBy" })
	@IsString()
	@IsOptional()
	readonly sortOrder?: "ASC" | "DESC";

	@ApiPropertyOptional({ description: "active" })
	@Transform(({ value }) => {
		return value === "true" ? true : value === "false" ? false : value;
	})
	@IsBoolean()
	@IsOptional()
	readonly active?: boolean;

	@ApiPropertyOptional({ description: "Filters as an array of key-value pairs" })
	@IsOptional()
	filters?: Record<string, string | string[]>;
}

export class RequestsPageOptionsDTO extends PageOptionsDTO {
	@ApiPropertyOptional({ description: "List additional source" })
	@IsEnum(RequestsFilterType)
	@IsOptional()
	readonly filterType?: RequestsFilterType;
}

export class BlacklistPageOptionsDTO extends PageOptionsDTO {
	@ApiPropertyOptional({ description: "isGlobal" })
	@Transform(({ value }) => value === "true")
	@IsBoolean()
	@IsOptional()
	readonly isGlobal?: boolean;
}
