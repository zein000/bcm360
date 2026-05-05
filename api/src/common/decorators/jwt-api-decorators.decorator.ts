import { applyDecorators, UseGuards } from "@nestjs/common";
import {
	ApiBearerAuth,
	ApiForbiddenResponse,
	ApiNotFoundResponse,
	ApiUnauthorizedResponse,
} from "@nestjs/swagger";

import { PermissionGuard } from "src/common/guards/permission.guard";
import { PermissionCodes } from "src/permissions/enum/codes";

import { FeaturesCodes } from "src/features/enum/codes";

import { FeaturesGuard } from "src/features/guards/features.guard";

import { ErrorResponseDTO } from "../../auth/dto/error-response.dto";
import { ERole } from "../../enums/role.enum";

import { RoleGuard } from "../guards/role.guard";
import { JwtAndApiKeyGuard } from "src/auth/guards/jwt-api-key.guard";

export const UseJWTWithApiKeyAuthorization = ({
	roles,
	permissions,
	description,
	feature,
}: {
	roles?: ERole[];
	permissions?: PermissionCodes[];
	description?: string;
	feature?: FeaturesCodes;
}) => {
	return applyDecorators(
		UseGuards(JwtAndApiKeyGuard),
		UseGuards(
			...[
				roles ? RoleGuard(roles) : null,
				permissions ? PermissionGuard(permissions) : null,
				feature ? FeaturesGuard(feature) : null,
			].filter((record) => record)
		),

		ApiBearerAuth(),
		ApiUnauthorizedResponse({ type: ErrorResponseDTO, description: "Invalid JWT token" }),
		ApiForbiddenResponse({
			type: ErrorResponseDTO,
			description: "Endpoint access forbidden for role.",
		}),
		ApiNotFoundResponse({ type: ErrorResponseDTO, description: description || "User not found." })
	);
};
