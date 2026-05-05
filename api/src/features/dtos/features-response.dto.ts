import { ApiProperty } from "@nestjs/swagger";

export class FeaturesResponseDto implements Object {
	@ApiProperty({ description: "Feature name" })
	feature: string;

	@ApiProperty({ description: "Active" })
	active: boolean;
}
