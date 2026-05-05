import { HttpException, HttpStatus } from "@nestjs/common";

export class RoleNotFoundException extends HttpException {
	constructor(message: string | object = "ROLE_NOT_FOUND", error = HttpStatus.NOT_FOUND) {
		super(message, error);
	}
}
