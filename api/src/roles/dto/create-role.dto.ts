import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsArray, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateRoleDTO {
	@ApiProperty({ description: "Role's name." })
	@IsString()
	@IsNotEmpty()
	name: string;

	@ApiProperty({ description: "Role's code - the unique identifier." })
	@IsString()
	@IsNotEmpty()
	@Transform((data) => data.value.toUpperCase())
	code: string;

	@ApiProperty({ description: "Role's description." })
	@IsString()
	@IsOptional()
	description?: string;

	@ApiPropertyOptional({
		type: () => String,
		isArray: true,
		description: "Role's permissions to attach(list of codes).",
	})
	@IsArray()
	@IsOptional()
	@IsString({ each: true })
	permissions?: string[];
}
