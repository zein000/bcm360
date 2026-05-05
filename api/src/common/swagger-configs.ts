import { ApiResponseOptions } from "@nestjs/swagger";
import { ErrorResponseDTO } from "../auth/dto/error-response.dto";

/**
 * Konstante: internalServerErrorConfig
 *
 * Diese Konstante definiert eine Swagger-Dokumentationskonfiguration für
 * den HTTP-Statuscode `500 – Internal Server Error`.
 *
 * Verwendung:
 * - Kann mit `@ApiInternalServerErrorResponse(internalServerErrorConfig)` verwendet werden
 * - Stellt sicher, dass der Rückgabetyp bei Fehlern einheitlich dokumentiert ist
 */
export const internalServerErrorConfig: ApiResponseOptions = {
	type: ErrorResponseDTO,
	description: "Internal server error.",
};
