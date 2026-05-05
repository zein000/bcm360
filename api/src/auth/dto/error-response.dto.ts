import { HttpStatus } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";

import { Errors } from "../../enums/errors.enum";

export class ErrorResponseDTO {
	@ApiProperty({ description: "Http error code" })
	error: HttpStatus;

	@ApiProperty({ description: "Error message" })
	message: Errors | string;
}
