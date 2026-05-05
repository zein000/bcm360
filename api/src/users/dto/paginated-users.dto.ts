import { ApiExtraModels, ApiProperty } from "@nestjs/swagger";
import { IsArray } from "class-validator";

import { PageDTO } from "../../common/dto";
import { UserInfoDTO } from "./user-info.dto";

@ApiExtraModels(PageDTO)
export class PaginatedUsersDTO extends PageDTO<UserInfoDTO> {
	@IsArray()
	@ApiProperty({ isArray: true, type: UserInfoDTO, description: "Array of admins" })
	readonly data: UserInfoDTO[];
}
