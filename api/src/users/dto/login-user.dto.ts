import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class LoginUserDTO {
	@IsNotEmpty()
	@IsString()
	@IsEmail()
	email: string;

	@IsNotEmpty()
	@IsString()
	password: string;
}
