import { ApiProperty } from "@nestjs/swagger";

import { BaseAuthResponseDTO } from "src/auth/dto/base-auth-response.dto";

export class TwoFAEnabledDTO extends BaseAuthResponseDTO {
	@ApiProperty({ description: "JTW token for auth with OTP." })
	otpToken: string;

	@ApiProperty({ description: "Need to remember me" })
	isRememberMe: boolean;

	constructor(data: TwoFAEnabledDTO) {
		super();
		Object.assign(this, data);
	}
}
