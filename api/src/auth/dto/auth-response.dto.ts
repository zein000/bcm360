import { ApiExtraModels, ApiProperty } from "@nestjs/swagger";

import { UserInfoDTO } from "../../users/dto/user-info.dto";
import { BaseAuthResponseDTO } from "./base-auth-response.dto";

@ApiExtraModels(UserInfoDTO)
export class AuthResponseDTO extends BaseAuthResponseDTO {
	@ApiProperty({
		description: "JWT token generated for the specific user. Used for authorization to the server.",
	})
	accessToken: string;

	@ApiProperty({
		description: "JWT refresh token used for generating new access token.",
	})
	refreshToken: string;

	@ApiProperty({ description: "Need to remember me" })
	isRememberMe: boolean;

	constructor(data: AuthResponseDTO) {
		super();
		Object.assign(this, data);
	}
}
