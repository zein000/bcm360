import { NestMiddleware } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";
export declare class RequestIdMiddleware implements NestMiddleware {
    use(request: Request, response: Response, next: NextFunction): void;
}
