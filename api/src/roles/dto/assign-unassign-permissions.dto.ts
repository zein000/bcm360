import { ApiProperty } from "@nestjs/swagger";
import { ArrayMinSize, IsArray, IsString } from "class-validator";

export class AssignUnassignPermissionsDTO {
	@ApiProperty({
		type: String,
		isArray: true,
		description: "Permissions to assign or unassign(list of codes).",
	})
	@IsArray()
	@ArrayMinSize(1)
	@IsString({ each: true })
	permissions?: string[];
}
