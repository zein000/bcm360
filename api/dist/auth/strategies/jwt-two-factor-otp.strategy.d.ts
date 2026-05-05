import { Strategy } from "passport-jwt";
import { ConfigType } from "@nestjs/config";
import { UsersService } from "src/users/users.service";
import { JWT2FAOTPPayload } from "src/interfaces/jwt-2fa-otp-payload.interface";
import User from "../../users/models/user.model";
import jwtConfig from "../config/jwt.config";
declare const JwtTwoFactorOtpStrategy_base: new (...args: any[]) => Strategy;
export declare class JwtTwoFactorOtpStrategy extends JwtTwoFactorOtpStrategy_base {
    private readonly userService;
    constructor(config: ConfigType<typeof jwtConfig>, userService: UsersService);
    validate(req: any, payload: JWT2FAOTPPayload): Promise<User | void>;
}
export {};
