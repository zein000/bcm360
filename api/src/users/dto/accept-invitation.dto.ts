import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty, IsString, Matches, MinLength } from "class-validator";

import { Match } from "../../common/decorators/match.decorator";
import { passwordLength, passwordRegExp } from "../../common/user.util";
import { Errors } from "../../enums/errors.enum";
import { ETokenPurpose } from "src/tokens/enums/token-purpose.enum";

export class AcceptInvitationDto {
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
    
	@ApiProperty({ description: "User's first name" })
	@IsNotEmpty()
	@IsString()
	firstName: string;

	@ApiProperty({ description: "User's last name" })
	@IsNotEmpty()
	@IsString()
	lastName: string;

	@ApiProperty({ description: "User's new password." })
	@IsNotEmpty()
	@IsString()
	@Matches(passwordRegExp, { message: Errors.WEAK_PASSWORD })
	@MinLength(passwordLength, { message: Errors.INVALID_PASSWORD })
	password: string;

	@ApiProperty({ description: "The field is checked against the password in the same request." })
	@IsNotEmpty()
	@IsString()
	@Matches(passwordRegExp, { message: Errors.WEAK_PASSWORD })
	@Match("password", { message: Errors.PASSWORD_MISMATCH })
	@MinLength(passwordLength, { message: Errors.INVALID_PASSWORD })
	confirmPassword: string;
}
