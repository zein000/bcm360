import { HttpException, HttpStatus } from "@nestjs/common";

export class WorkflowNotFoundException extends HttpException {
	constructor(message: string | object = "PERMISSION_NOT_FOUND", error = HttpStatus.NOT_FOUND) {
		super(message, error);
	}
}
