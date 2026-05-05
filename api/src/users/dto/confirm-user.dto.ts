import { IsNotEmpty, IsString, MinLength } from "class-validator";

import { Errors } from "src/enums/errors.enum";

export class ConfirmUserDTO {
	@IsNotEmpty()
	@IsString()
	token: string;

	@IsNotEmpty()
	@IsString()
	@MinLength(6, { message: Errors.INVALID_PASSWORD })
	password: string;

	@IsNotEmpty()
	@IsString()
	@MinLength(6, { message: Errors.INVALID_PASSWORD })
	confirmPassword: string;
}
