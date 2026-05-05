import { HttpException, HttpStatus } from "@nestjs/common";
export declare class UserNotFoundException extends HttpException {
    constructor(message?: string | object, error?: HttpStatus);
}
export declare class DuplicateServiceUserException extends HttpException {
    constructor(message?: string | object, error?: HttpStatus);
}
export declare class DuplicateUserException extends HttpException {
    constructor(message?: string | object, error?: HttpStatus);
}
export declare class IncorrectInputDataException extends HttpException {
    constructor(message?: string | object, error?: HttpStatus);
}
export declare class IncorrectCredentialsException extends HttpException {
    constructor(message?: string | object, error?: HttpStatus);
}
export declare class InvalidTokenException extends HttpException {
    constructor(message?: string | object, error?: HttpStatus);
}
