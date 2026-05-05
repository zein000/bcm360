import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class UserBlacklistJwtRequestDto {
	@ApiProperty({ description: "Blacklist a jwt token." })
	@IsNotEmpty()
	@IsString()
	jwt: string;
}
