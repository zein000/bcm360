import { HttpException, HttpStatus } from "@nestjs/common";

export class PermissionNotFoundException extends HttpException {
	constructor(message: string | object = "PERMISSION_NOT_FOUND", error = HttpStatus.NOT_FOUND) {
		super(message, error);
	}
}
