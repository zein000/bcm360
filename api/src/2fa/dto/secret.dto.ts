import { IsNotEmpty, IsString } from "class-validator";

export class TwoFactorAuthSecretDTO {
	@IsNotEmpty()
	@IsString()
	secret: string;

	@IsNotEmpty()
	@IsString()
	otpAuthUrl: string;
}
