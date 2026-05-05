import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";

import { UserInfoDTO } from "../../users/dto/user-info.dto";

export class BaseAuthResponseDTO {
	@ApiProperty({
		description: "Account information for the related user.",
		type: () => UserInfoDTO,
	})
	@Type(() => UserInfoDTO)
	user: UserInfoDTO;
}
