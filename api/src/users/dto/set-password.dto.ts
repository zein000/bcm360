import { ApiProperty } from "@nestjs/swagger";

import { IsNotEmpty, IsString, MinLength, Matches, IsEnum } from "class-validator";

import { passwordLength, passwordRegExp } from "src/common/user.util";
import { ETokenPurpose } from "src/tokens/enums/token-purpose.enum";

import { Errors } from "../../enums/errors.enum";
import { Match } from "../../common/decorators/match.decorator";

export class SetPasswordDTO {
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

	@ApiProperty({ description: "User password." })
	@IsNotEmpty()
	@IsString()
	@Matches(passwordRegExp, { message: Errors.WEAK_PASSWORD })
	@MinLength(passwordLength, { message: Errors.INVALID_PASSWORD })
	password: string;

	@ApiProperty({ description: "The field is checked against the password in the same request." })
	@IsNotEmpty()
	@IsString()
	@Matches(passwordRegExp, { message: Errors.WEAK_PASSWORD })
	@MinLength(passwordLength, { message: Errors.INVALID_PASSWORD })
	@Match("password", { message: Errors.PASSWORD_MISMATCH })
	confirmPassword: string;
}
