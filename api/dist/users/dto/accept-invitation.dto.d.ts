import { ETokenPurpose } from "src/tokens/enums/token-purpose.enum";
export declare class AcceptInvitationDto {
    token: string;
    purpose: ETokenPurpose;
    firstName: string;
    lastName: string;
    password: string;
    confirmPassword: string;
}
