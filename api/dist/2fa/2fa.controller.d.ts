import { Response } from "express";
import RequestWithUser from "src/interfaces/request-with-user.interface";
import { TwoFactorAuthenticationService } from "./2fa.service";
import { TwoFactorAuthenticationCodeDTO } from "./dto/code.dto";
export declare class TwoFactorAuthenticationController {
    private readonly twoFactorAuthenticationService;
    constructor(twoFactorAuthenticationService: TwoFactorAuthenticationService);
    generate(res: Response, { user }: RequestWithUser): Promise<void>;
    authenticate({ user }: RequestWithUser, body: TwoFactorAuthenticationCodeDTO): Promise<import("../auth/dto/auth-response.dto").AuthResponseDTO>;
    verify({ code }: TwoFactorAuthenticationCodeDTO, { user }: RequestWithUser): Promise<import("../users/dto/user-info.dto").UserInfoDTO>;
    disable({ user }: RequestWithUser, body: TwoFactorAuthenticationCodeDTO): Promise<import("../users/dto/user-info.dto").UserInfoDTO>;
}
