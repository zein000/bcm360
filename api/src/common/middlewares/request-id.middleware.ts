import { Injectable, NestMiddleware } from "@nestjs/common";
import { v4 } from "uuid";

import { Request, Response, NextFunction } from "express";

import { REQUEST_ID_HEADER } from "../../constants";

@Injectable()
export class RequestIdMiddleware implements NestMiddleware {
	use(request: Request, response: Response, next: NextFunction) {
		request.headers[REQUEST_ID_HEADER] = v4();

		next();
	}
}
