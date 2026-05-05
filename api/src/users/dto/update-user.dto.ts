import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import {
	IsArray,
	IsBoolean,
	IsEmail,
	IsEnum,
	IsNumber,
	IsOptional,
	IsString,
	MinLength,
} from "class-validator";

import { normalizeLinkedinUrl } from "src/common/normaliseLinkedinUrl";
import { UserLanguage } from "src/enums/user.enum";

export class UpdateUserDTO {
	@ApiProperty()
	@IsOptional()
	@IsString()
	@IsEmail()
	email?: string;

	@ApiPropertyOptional()
	@IsOptional()
	@IsString()
	@MinLength(4)
	firstName?: string;

	@ApiPropertyOptional()
	@IsOptional()
	@IsString()
	@MinLength(4)
	lastName?: string;

	@ApiPropertyOptional()
	@Transform(({ value }) => normalizeLinkedinUrl(value.trim()))
	@IsOptional()
	@IsString()
	@MinLength(4)
	linkedinUrl?: string;

	@ApiPropertyOptional()
	@IsOptional()
	@IsEnum(UserLanguage)
	userLanguage?: UserLanguage;

	@ApiPropertyOptional()
	@IsOptional()
	@IsBoolean()
	is2FAEnabled?: boolean;

	@ApiPropertyOptional()
	@IsOptional()
	@IsBoolean()
	autoAccept?: boolean;


	@ApiPropertyOptional()
	@IsOptional()
	@IsArray()
	linkedinCookie?: JSON;

	@ApiPropertyOptional()
	@IsOptional()
	@IsString()
	customUa?: string;

	@ApiProperty({ description: "User's roleId" })
	@IsOptional()
	@Transform(({ value }) => +value)
	@IsNumber()
	roleId: number;
}
