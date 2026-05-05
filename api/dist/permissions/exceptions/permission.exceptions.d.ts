import { HttpException, HttpStatus } from "@nestjs/common";
export declare class PermissionNotFoundException extends HttpException {
    constructor(message?: string | object, error?: HttpStatus);
}
