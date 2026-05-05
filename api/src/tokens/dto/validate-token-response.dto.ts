import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

import { ETokenStatus } from "../enums/token-status.enum";

export class ValidateTokenResponseDTO {
	@ApiProperty({ description: "Invitation status.", enum: ETokenStatus })
	status: ETokenStatus;

	@ApiPropertyOptional({ description: "User's email for resending invitation when expired." })
	email?: string;
}
