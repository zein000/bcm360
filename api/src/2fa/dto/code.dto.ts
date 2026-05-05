import { IsNotEmpty, IsString } from "class-validator";
//test comment123
export class TwoFactorAuthenticationCodeDTO {
	@IsNotEmpty()
	@IsString()
	code: string;
}
