import { HttpException, HttpStatus } from "@nestjs/common";

import { Errors } from "../enums/errors.enum";

export class JwtAlreadyBlacklisted extends HttpException {
	constructor(
		message: string | object = Errors.JWT_ALREADY_BLACKLISTED,
		error = HttpStatus.BAD_REQUEST
	) {
		super(message, error);
	}
}
