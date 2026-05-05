import { Body, Controller, Post } from "@nestjs/common";

import { ApiBadRequestResponse, ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";

import { UserBlacklistJwtRequestDto } from "src/user-blacklist/dto/user-blacklist-jtw-request.dto";

import { ErrorResponseDTO } from "src/auth/dto/error-response.dto";
import { UseJWTWithApiKeyAuthorization } from "src/common/decorators/jwt-api-decorators.decorator";
import { BaseResponseDTO } from "src/common/dto/base-response.dto";
import { PermissionCodes } from "src/permissions/enum/codes";

import { UserBlacklistService } from "./user-blacklist.service";

@ApiTags("UserBlacklist")
@Controller("user_blacklist")
export class UserBlacklistController {
	constructor(private readonly jwtService: UserBlacklistService) {}

	@Post()
	@ApiOperation({
		description: `Endpoint to blacklist jwt token.**PERMISSIONS: ${PermissionCodes.BLACKLIST_JWT}**`,
		summary: "Invalidate blacklist jwt token",
	})
	@UseJWTWithApiKeyAuthorization({ permissions: [PermissionCodes.BLACKLIST_JWT] })
	@ApiOkResponse({ type: BaseResponseDTO<null> })
	@ApiBadRequestResponse({ type: ErrorResponseDTO, description: "Invalid request data." })
	async blacklistJwt(@Body() data: UserBlacklistJwtRequestDto): Promise<BaseResponseDTO<null>> {
		return this.jwtService.blacklistJwt(data.jwt);
	}
}
