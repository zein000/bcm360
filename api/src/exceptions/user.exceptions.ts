import { HttpException, HttpStatus } from "@nestjs/common";

import { Errors } from "../enums/errors.enum";

export class UserNotFoundException extends HttpException {
	constructor(message: string | object = Errors.USER_NOT_FOUND, error = HttpStatus.NOT_FOUND) {
		super(message, error);
	}
}
export class DuplicateServiceUserException extends HttpException {
	constructor(
		message: string | object = Errors.USER_ALREADY_EXISTS,
		error = HttpStatus.BAD_REQUEST
	) {
		super(message, error);
	}
}

export class DuplicateUserException extends HttpException {
	constructor(
		message: string | object = Errors.EMAIL_ALREADY_TAKEN,
		error = HttpStatus.BAD_REQUEST
	) {
		super(message, error);
	}
}

export class IncorrectInputDataException extends HttpException {
	constructor(
		message: string | object = Errors.INVALID_REQUEST_DATA,
		error = HttpStatus.BAD_REQUEST
	) {
		super(message, error);
	}
}

export class IncorrectCredentialsException extends HttpException {
	constructor(
		message: string | object = Errors.INVALID_CREDENTIALS,
		error = HttpStatus.UNAUTHORIZED
	) {
		super(message, error);
	}
}

export class InvalidTokenException extends HttpException {
	constructor(message: string | object = Errors.INVALID_TOKEN, error = HttpStatus.UNAUTHORIZED) {
		super(message, error);
	}
}
