import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, Matches, MinLength } from "class-validator";

import { Match } from "../../common/decorators/match.decorator";
import { passwordLength, passwordRegExp } from "../../common/user.util";
import { Errors } from "../../enums/errors.enum";

export class ChangePasswordDTO {
	@ApiProperty({ description: "User's old password" })
	@IsNotEmpty()
	@IsString()
	@MinLength(passwordLength, { message: Errors.INVALID_PASSWORD })
	oldPassword: string;

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
