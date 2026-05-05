import { ApiPropertyOptional } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateIf } from "class-validator";

import { PageOptionsDTO } from "src/common/dto";

import { UserSearchField } from "src/enums/user-search-field.enum";

export class UserSearchParamsDTO extends PageOptionsDTO {
	@ValidateIf((object) => object.value !== undefined)
	@IsOptional()
	@IsEnum(UserSearchField)
	@Transform(({ value }) => value.toLowerCase())
	fieldName?: UserSearchField;

	@ValidateIf((object) => object.fieldName !== undefined)
	@IsString()
	@IsNotEmpty()
	value: string;

	@IsOptional()
	@Transform(({ value }) => +value)
	@IsNumber()
	companyId: number;
}
