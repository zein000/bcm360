import {
	Body,
	Controller,
	HttpCode,
	Post,
	Request,
	Res,
	UseGuards,
	UseInterceptors,
} from "@nestjs/common";
import { Response } from "express";

import { ApiOperation, ApiTags } from "@nestjs/swagger";

import { UseJWTWithApiKeyAuthorization } from "src/common/decorators/jwt-api-decorators.decorator";
import RequestWithUser from "src/interfaces/request-with-user.interface";

import { JwtTwoFactorOtpGuard } from "src/auth/guards/jwt-two-factor-otp.guard";

import { TwoFactorAuthenticationService } from "./2fa.service";

import { PermissionCodes } from "../permissions/enum/codes";

import { ClearUserInfoCacheInterceptor } from "../caching/interceptors/clear-user-info.interceptor";
import { TwoFactorAuthenticationCodeDTO } from "./dto/code.dto";

@ApiTags("2-Factor Authentication")
@Controller("2fa")
export class TwoFactorAuthenticationController {
	constructor(private readonly twoFactorAuthenticationService: TwoFactorAuthenticationService) {}

	@Post("generate")
	@UseJWTWithApiKeyAuthorization({ permissions: [PermissionCodes.GENERATE_2FA] })
	@ApiOperation({
		description: "Generates initial 2FA",
		summary: "Generates 2FA",
	})
	async generate(
		@Res() res: Response,
		@Request()
		{ user }: RequestWithUser
	) {
		return this.twoFactorAuthenticationService.generate2FASecret(user, res);
	}

	@Post("authenticate")
	@UseGuards(JwtTwoFactorOtpGuard)
	@UseInterceptors(ClearUserInfoCacheInterceptor)
	async authenticate(
		@Request()
		{ user }: RequestWithUser,
		@Body() body: TwoFactorAuthenticationCodeDTO
	) {
		return await this.twoFactorAuthenticationService.authenticate2FASecret(user, body);
	}

	@Post("verify")
	@HttpCode(200)
	@UseJWTWithApiKeyAuthorization({ permissions: [PermissionCodes.VERIFY_2FA] })
	@UseInterceptors(ClearUserInfoCacheInterceptor)
	@ApiOperation({
		description: "Verifies the initial enabling of 2FA for the authenticated user.",
		summary: "Verifies 2FA",
	})
	async verify(
		@Body() { code }: TwoFactorAuthenticationCodeDTO,
		@Request()
		{ user }: RequestWithUser
	) {
		return this.twoFactorAuthenticationService.verify2FACode(user, code);
	}

	@Post("disable")
	@HttpCode(200)
	@UseJWTWithApiKeyAuthorization({ permissions: [PermissionCodes.DISABLE_2FA] })
	@UseInterceptors(ClearUserInfoCacheInterceptor)
	@ApiOperation({
		description: "Disables 2FA for the authenticated user",
		summary: "Disables 2FA",
	})
	async disable(
		@Request() { user }: RequestWithUser,
		@Body() body: TwoFactorAuthenticationCodeDTO
	) {
		return await this.twoFactorAuthenticationService.disable2FA(user.id, body.code);
	}
}
