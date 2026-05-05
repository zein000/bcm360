import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsEnum } from "class-validator";

import { ConfigurationName } from "src/enums/configuration.enum";

export class ConfigurationParamRequestDTO {
	@ApiProperty({ description: "Configuration name" })
	@IsEnum(ConfigurationName)
	@Transform((param) => (param.value as string).toUpperCase())
	name: ConfigurationName;
}
