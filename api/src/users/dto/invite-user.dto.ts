import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import {
	IsArray,
	IsEmail,
	IsNotEmpty,
	IsNumber,
	IsOptional,
	IsString,
	MinLength,
} from "class-validator";

export class InviteUserDTO {
	@ApiProperty({ description: "User's email" })
	@IsNotEmpty()
	@IsString()
	@IsEmail()
	@Transform((param) => param.value.toLowerCase())
	email: string;

	@ApiProperty({ description: "User's first name" })
	@IsNotEmpty()
	@IsString()
	@MinLength(2)
	@IsOptional()
	firstName: string;

	@ApiProperty({ description: "User's last name" })
	@IsNotEmpty()
	@IsString()
	@MinLength(2)
	@IsOptional()
	lastName: string;

	@ApiPropertyOptional({ description: "User's role" })
	@IsOptional()
	@IsString()
	role: string;

	@ApiProperty({ description: "User's roleId" })
	@IsOptional()
	@Transform(({ value }) => +value)
	@IsNumber()
	roleId: number;

	@ApiProperty({ description: "User's company if created by global admin" })
	@IsOptional()
	@Transform(({ value }) => +value)
	@IsNumber()
	companyId: number;
}
