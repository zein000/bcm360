import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class ValidateTokenRequestDTO {
	@ApiProperty({ description: "Invitation token used to authorize the user on registration." })
	@IsNotEmpty()
	@IsString()
	token: string;
}
