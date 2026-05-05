import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";

import { Errors } from "src/enums/errors.enum";

export class CreateUserDTO {
	@IsNotEmpty()
	@IsString()
	@IsEmail()
	email: string;

	@IsNotEmpty()
	@IsString()
	@MinLength(6, { message: Errors.INVALID_PASSWORD })
	password: string;
}
