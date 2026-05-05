import { Controller, Get, Request } from "@nestjs/common";
import { ApiNotFoundResponse, ApiOkResponse, ApiOperation } from "@nestjs/swagger";

import { ErrorResponseDTO } from "src/auth/dto/error-response.dto";

import RequestWithUser from "../interfaces/request-with-user.interface";

import { UseJWTWithApiKeyAuthorization } from "../common/decorators/jwt-api-decorators.decorator";

import { FeaturesResponseDto } from "./dtos/features-response.dto";
import { FeaturesService } from "./features.service";

@Controller("features")
export class FeaturesController {
	constructor(private readonly featuresService: FeaturesService) {}

	@Get()
	@UseJWTWithApiKeyAuthorization({})
	@ApiOperation({
		summary: "Get Features",
	})
	@ApiOkResponse({ type: FeaturesResponseDto, description: "KPI data" })
	@ApiNotFoundResponse({ type: ErrorResponseDTO, description: "Data not found" })
	getFeatures(@Request() { user }: RequestWithUser): Promise<FeaturesResponseDto[]> {
		return this.featuresService.getFeatures(user);
	}

	@Get("UNAUTHENTICATED")
	@ApiOperation({
		summary: "Get Features",
	})
	@ApiOkResponse({ type: FeaturesResponseDto, description: "KPI data" })
	@ApiNotFoundResponse({ type: ErrorResponseDTO, description: "Data not found" })
	getFeaturesWithoutPermission(): Promise<FeaturesResponseDto[]> {
		return this.featuresService.getFeatures();
	}
}
