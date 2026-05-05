import { HttpException, HttpStatus } from "@nestjs/common";
export declare class JwtAlreadyBlacklisted extends HttpException {
    constructor(message?: string | object, error?: HttpStatus);
}
