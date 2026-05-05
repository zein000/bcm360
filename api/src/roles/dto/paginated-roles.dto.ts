import { ApiExtraModels, ApiProperty } from "@nestjs/swagger";
import { IsArray } from "class-validator";

import { PageDTO } from "../../common/dto";

import { RoleInfoDTO } from "./role-info.dto";

@ApiExtraModels(PageDTO)
export class PaginatedRolesDTO extends PageDTO<RoleInfoDTO> {
	@IsArray()
	@ApiProperty({ isArray: true, type: RoleInfoDTO, description: "Array of roles" })
	readonly data: RoleInfoDTO[];
}
