import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class UpdateConfigurationRequestDTO {
	@ApiProperty({
		description: "Configuration value.",
	})
	@IsNotEmpty()
	@IsString()
	value: string;
}
