import { BaseAuthResponseDTO } from "./base-auth-response.dto";
export declare class AuthResponseDTO extends BaseAuthResponseDTO {
    accessToken: string;
    refreshToken: string;
    isRememberMe: boolean;
    constructor(data: AuthResponseDTO);
}
