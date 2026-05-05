import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsBoolean, IsOptional } from "class-validator";

import { UpdateUserDTO } from "./update-user.dto";

export class AdminUpdateUserDTO extends UpdateUserDTO {
	@ApiPropertyOptional()
	@IsOptional()
	@IsBoolean()
	isBlocked?: boolean;

	@ApiPropertyOptional()
	firstName?: string;

	@ApiPropertyOptional()
	lastName?: string;

	@ApiPropertyOptional()
	is2FAEnabled?: boolean;
}
