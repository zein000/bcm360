import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { ArrayMinSize, IsArray, ValidateNested } from "class-validator";

import { AssignUnassignRolesRecordDTO } from "./assign-unassign-roles-record.dto";

export class AssignUnassignRolesDTO {
	@ApiProperty({
		type: AssignUnassignRolesRecordDTO,
		isArray: true,
		description: "Roles to assign or unassign.",
	})
	@Type(() => AssignUnassignRolesRecordDTO)
	@IsArray()
	@ValidateNested()
	@ArrayMinSize(1)
	roles?: Array<AssignUnassignRolesRecordDTO>;
}
