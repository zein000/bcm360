import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { Response } from "express";
import { authenticator } from "otplib";
import { toFileStream } from "qrcode";

import { AuthService } from "src/auth/auth.service";
import { AuthResponseDTO } from "src/auth/dto/auth-response.dto";

import { IncorrectInputDataException, InvalidTokenException } from "src/exceptions/user.exceptions";
import { UsersService } from "src/users/users.service";
import User from "src/users/models/user.model";
import { Errors } from "src/enums/errors.enum";
import { UserInfoDTO } from "src/users/dto/user-info.dto";

import { TwoFactorAuthenticationCodeDTO } from "./dto/code.dto";

@Injectable()
export class TwoFactorAuthenticationService {
	constructor(
		@Inject(forwardRef(() => UsersService))
		private readonly usersService: UsersService,
		@Inject(forwardRef(() => AuthService))
		private readonly authService: AuthService
	) {}

	async generate2FASecret(user: Partial<User>, res: Response) {
		const secret: string = authenticator.generateSecret();

		const otpAuthUrl: string = authenticator.keyuri(
			user.email,
			process.env.TWO_FACTOR_AUTHENTICATION_APP_NAME,
			secret
		);

		await this.usersService.set2FASecret(user.id, secret);

		return this.pipeQrCodeStream(res, otpAuthUrl);
	}

	pipeQrCodeStream(stream: Response, otpAuthUrl: string) {
		return toFileStream(stream, otpAuthUrl);
	}

	async is2FACodeValid(code: string, userId: number): Promise<boolean> {
		const user = await this.usersService.findOneById(userId);

		if (!user.twoFactorAuthSecret) {
			throw new IncorrectInputDataException("Invalid two factor authentication secret");
		}

		return authenticator.verify({ token: code, secret: user.twoFactorAuthSecret });
	}

	async disable2FA(userId: number, code: string): Promise<UserInfoDTO> {
		const isCodeValid: boolean = await this.is2FACodeValid(code, userId);

		if (!isCodeValid) {
			throw new InvalidTokenException(Errors.INVALID_OTP_AUTH_CODE);
		}

		return this.usersService.disable2FA(userId);
	}

	async verify2FACode(user: User, code: string): Promise<UserInfoDTO> {
		const isCodeValid: boolean = await this.is2FACodeValid(code, user.id);

		if (!isCodeValid) {
			throw new InvalidTokenException(Errors.INVALID_OTP_AUTH_CODE);
		}

		return this.usersService.enable2FA(user.id);
	}

	async authenticate2FASecret(
		user: User,
		body: TwoFactorAuthenticationCodeDTO
	): Promise<AuthResponseDTO> {
		const { code } = body;
		const isCodeValid: boolean = await this.is2FACodeValid(code, user.id);

		if (!isCodeValid) {
			throw new InvalidTokenException(Errors.INVALID_OTP_AUTH_CODE);
		}

		return this.authService.login(user);
	}
}
