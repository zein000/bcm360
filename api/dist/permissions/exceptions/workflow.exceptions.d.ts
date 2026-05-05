import { HttpException, HttpStatus } from "@nestjs/common";
export declare class WorkflowNotFoundException extends HttpException {
    constructor(message?: string | object, error?: HttpStatus);
}
