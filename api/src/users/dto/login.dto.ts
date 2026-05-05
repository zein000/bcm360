import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsEmail, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class LoginDTO {
	@ApiProperty({ description: "User's email" })
	@IsNotEmpty()
	@IsString()
	@IsEmail()
	email: string;

	@ApiProperty({ description: "User's password" })
	@IsNotEmpty()
	@IsString()
	password: string;

	@ApiProperty({ description: "Need to remember user" })
	@IsOptional()
	@IsBoolean()
	isRememberMe: boolean;
}
