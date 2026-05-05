import { ApiProperty, PartialType } from "@nestjs/swagger";

import { ETokenStatus } from "src/tokens/enums/token-status.enum";

import { AuthResponseDTO } from "../../auth/dto/auth-response.dto";

export class UserAuthResponseDTO extends PartialType(AuthResponseDTO) {
	@ApiProperty()
	status: ETokenStatus;

	@ApiProperty()
	email?: string;
}
