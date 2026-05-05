import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class ResetPasswordDTO {
	@ApiProperty({ description: "User email." })
	@IsNotEmpty()
	@IsString()
	@IsEmail()
	@Transform((param) => param.value.toLowerCase())
	email: string;
}
