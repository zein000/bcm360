import { HttpException, HttpStatus } from "@nestjs/common";
export declare class PitchdeckNotFoundException extends HttpException {
    constructor(message?: string | object, error?: HttpStatus);
}
