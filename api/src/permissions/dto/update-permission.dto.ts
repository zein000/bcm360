import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class UpdatePermissionDTO {
	@ApiPropertyOptional({ description: "Permission's name." })
	@IsString()
	@IsNotEmpty()
	@IsOptional()
	name: string;

	@ApiPropertyOptional({ description: "Permission's description." })
	@IsString()
	@IsOptional()
	description?: string;
}
