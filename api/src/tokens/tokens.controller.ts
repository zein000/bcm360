import { Body, Controller, Get, Post, Query } from "@nestjs/common";
import {
	ApiBadRequestResponse,
	ApiInternalServerErrorResponse,
	ApiOkResponse,
	ApiOperation,
	ApiTags,
} from "@nestjs/swagger";

import { ErrorResponseDTO } from "../auth/dto/error-response.dto";
import { BaseResponseDTO } from "../common/dto/base-response.dto";
import { internalServerErrorConfig } from "../common/swagger-configs";

import { ValidateTokenRequestDTO } from "./dto/validate-token-request.dto";
import { ValidateTokenResponseDTO } from "./dto/validate-token-response.dto";
import { TokensService } from "./tokens.service";

/**
 * Klasse: TokensController
 *
 * Dieser Controller bietet Endpunkte zur Validierung und zum erneuten Versand von Einladungs-Tokens.
 * Tokens werden verwendet, um z. B. neue Benutzer zur Plattform einzuladen.
 *
 * Endpunkte:
 * - GET `/token/validate`: Prüft die Gültigkeit eines Tokens (z. B. Einladung abgelaufen?)
 * - POST `/token/resend`: Versendet eine neue Einladung basierend auf einem Token
 *
 * Verwendet:
 * - `TokensService` für die Logik zur Validierung und zum Versand
 */
@ApiTags("Token")
@ApiInternalServerErrorResponse(internalServerErrorConfig)
@Controller("token")
export class TokensController {
	constructor(private readonly tokensService: TokensService) {}

	/**
	 * GET /token/validate
	 *
	 * Prüft, ob ein Einladungs-Token gültig oder abgelaufen ist.
	 *
	 * @param data - Enthält das Token als Query-Parameter
	 * @returns Tokenstatus mit ggf. zugehöriger E-Mail
	 */
	@Get("validate")
	@ApiOperation({
		summary: "Validate invitation token",
		description: "Endpoint to validate invitation token status.",
	})
	@ApiOkResponse({
		type: ValidateTokenResponseDTO,
		description: "Returns token status. If token is expired returns email too.",
	})
	@ApiBadRequestResponse({ type: ErrorResponseDTO, description: "Invalid request data." })
	async validate(@Query() data: ValidateTokenRequestDTO): Promise<ValidateTokenResponseDTO> {
		return this.tokensService.validateToken(data.token);
	}

	/**
	 * POST /token/resend
	 *
	 * Sendet eine neue Einladung auf Basis eines gültigen oder abgelaufenen Tokens.
	 *
	 * @param data - Enthält das Token im Body
	 * @returns Erfolgsstatus (null-Payload)
	 */
	@Post("resend")
	@ApiOperation({
		summary: "Resend invitation",
		description: "Endpoint to resend invitation by token.",
	})
	@ApiOkResponse({ type: BaseResponseDTO<null> })
	@ApiBadRequestResponse({ type: ErrorResponseDTO, description: "Invalid request data." })
	async resend(@Body() data: ValidateTokenRequestDTO): Promise<BaseResponseDTO<null>> {
		return this.tokensService.resend(data.token);
	}
}
