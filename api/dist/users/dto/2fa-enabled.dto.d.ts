import { BaseAuthResponseDTO } from "src/auth/dto/base-auth-response.dto";
export declare class TwoFAEnabledDTO extends BaseAuthResponseDTO {
    otpToken: string;
    isRememberMe: boolean;
    constructor(data: TwoFAEnabledDTO);
}
