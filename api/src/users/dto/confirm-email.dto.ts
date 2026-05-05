import { ApiProperty } from "@nestjs/swagger";

import { IsNotEmpty, IsString, IsEnum } from "class-validator";

import { ETokenPurpose } from "src/tokens/enums/token-purpose.enum";

export class ConfirmEmailDTO {
	@ApiProperty({
		description: "The token generated that authenticates the user to set his password.",
	})
	@IsNotEmpty()
	@IsString()
	token: string;

	@ApiProperty({
		description: "The purpose for using set password functionality(Token purpose).",
	})
	@IsNotEmpty()
	@IsEnum(ETokenPurpose)
	purpose: ETokenPurpose;
}
