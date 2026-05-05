import { Response } from "express";
import { AuthService } from "src/auth/auth.service";
import { AuthResponseDTO } from "src/auth/dto/auth-response.dto";
import { UsersService } from "src/users/users.service";
import User from "src/users/models/user.model";
import { UserInfoDTO } from "src/users/dto/user-info.dto";
import { TwoFactorAuthenticationCodeDTO } from "./dto/code.dto";
export declare class TwoFactorAuthenticationService {
    private readonly usersService;
    private readonly authService;
    constructor(usersService: UsersService, authService: AuthService);
    generate2FASecret(user: Partial<User>, res: Response): Promise<void>;
    pipeQrCodeStream(stream: Response, otpAuthUrl: string): Promise<void>;
    is2FACodeValid(code: string, userId: number): Promise<boolean>;
    disable2FA(userId: number, code: string): Promise<UserInfoDTO>;
    verify2FACode(user: User, code: string): Promise<UserInfoDTO>;
    authenticate2FASecret(user: User, body: TwoFactorAuthenticationCodeDTO): Promise<AuthResponseDTO>;
}
