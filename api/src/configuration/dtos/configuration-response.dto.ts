import { ApiProperty } from "@nestjs/swagger";

export class ConfigurationResponseDTO {
	@ApiProperty({ description: "Configuration name" })
	name: string;

	@ApiProperty({ description: "Configuration value" })
	value: string;

	@ApiProperty({ description: "Configuration companyId" })
	companyId: number;
}
