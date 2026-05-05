import { HttpStatus } from "@nestjs/common";
import { Errors } from "../../enums/errors.enum";
export declare class ErrorResponseDTO {
    error: HttpStatus;
    message: Errors | string;
}
