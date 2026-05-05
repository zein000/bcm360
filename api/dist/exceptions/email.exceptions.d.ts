import { HttpException, HttpStatus } from "@nestjs/common";
export declare class EmailFailedException extends HttpException {
    constructor(message?: string | object, error?: HttpStatus);
}
