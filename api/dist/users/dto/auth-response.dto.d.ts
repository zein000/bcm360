import { ETokenStatus } from "src/tokens/enums/token-status.enum";
import { AuthResponseDTO } from "../../auth/dto/auth-response.dto";
declare const UserAuthResponseDTO_base: import("@nestjs/common").Type<Partial<AuthResponseDTO>>;
export declare class UserAuthResponseDTO extends UserAuthResponseDTO_base {
    status: ETokenStatus;
    email?: string;
}
export {};
