import { ApiExtraModels, ApiProperty } from "@nestjs/swagger";
import { IsArray } from "class-validator";

import { PageDTO } from "../../common/dto";
import { PermissionInfoDTO } from "./permission-info.dto";

@ApiExtraModels(PageDTO)
export class PaginatedPermissionsDTO extends PageDTO<PermissionInfoDTO> {
	@IsArray()
	@ApiProperty({ isArray: true, type: PermissionInfoDTO, description: "Array of permissions" })
	readonly data: PermissionInfoDTO[];
}
