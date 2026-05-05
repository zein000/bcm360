import { ETokenPurpose } from "src/tokens/enums/token-purpose.enum";
export declare class SetPasswordDTO {
    token: string;
    purpose: ETokenPurpose;
    password: string;
    confirmPassword: string;
}
