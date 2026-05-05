import { HttpException, HttpStatus } from "@nestjs/common";
export declare class RoleNotFoundException extends HttpException {
    constructor(message?: string | object, error?: HttpStatus);
}
