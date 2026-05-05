import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsEnum, IsNotEmpty } from "class-validator";

import { ConfigurationName } from "src/enums/configuration.enum";

import { UpdateConfigurationRequestDTO } from "./update-configuration-request.dto";

export class AddConfigurationRequestDTO extends UpdateConfigurationRequestDTO {
	@ApiProperty({
		description: "Configuration name.",
	})
	@IsNotEmpty()
	@IsEnum(ConfigurationName)
	@Transform((param) => (param.value as string).toUpperCase())
	name: ConfigurationName;
}
