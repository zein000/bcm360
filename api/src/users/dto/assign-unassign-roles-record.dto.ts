import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber } from "class-validator";

export class AssignUnassignRolesRecordDTO {
	@ApiProperty({
		description: "Role ID.",
	})
	@IsNotEmpty()
	@IsNumber()
	id: number;
}
