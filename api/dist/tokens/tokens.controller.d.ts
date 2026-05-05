import { BaseResponseDTO } from "../common/dto/base-response.dto";
import { ValidateTokenRequestDTO } from "./dto/validate-token-request.dto";
import { ValidateTokenResponseDTO } from "./dto/validate-token-response.dto";
import { TokensService } from "./tokens.service";
export declare class TokensController {
    private readonly tokensService;
    constructor(tokensService: TokensService);
    validate(data: ValidateTokenRequestDTO): Promise<ValidateTokenResponseDTO>;
    resend(data: ValidateTokenRequestDTO): Promise<BaseResponseDTO<null>>;
}
