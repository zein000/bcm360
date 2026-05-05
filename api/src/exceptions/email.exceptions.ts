import { HttpException, HttpStatus } from "@nestjs/common";

export class EmailFailedException extends HttpException {
	constructor(
		message: string | object = "Failed to send email.",
		error = HttpStatus.INTERNAL_SERVER_ERROR
	) {
		super(message, error);
	}
}
