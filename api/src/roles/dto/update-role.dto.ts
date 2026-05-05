import { ApiPropertyOptional } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";

import { CreateRoleDTO } from "./create-role.dto";

export class UpdateRoleDTO extends CreateRoleDTO {
	@ApiPropertyOptional({ description: "Role's name." })
	@IsString()
	@IsOptional()
	@IsNotEmpty()
	name: string;

	@ApiPropertyOptional({ description: "Role's code - the unique identifier." })
	@IsString()
	@IsOptional()
	@IsNotEmpty()
	@Transform((data) => data.value.toUpperCase())
	code: string;

	@ApiPropertyOptional({ description: "Role's description." })
	@IsString()
	@IsOptional()
	description?: string;
}
