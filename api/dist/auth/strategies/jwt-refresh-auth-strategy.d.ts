import { Strategy } from "passport-jwt";
import { ConfigType } from "@nestjs/config";
import { JWT2FAPayload } from "src/interfaces/jwt-2fa-payload.interface";
import User from "src/users/models/user.model";
import { UserInfoCachingService } from "../../caching/services/user-info-caching.service";
import jwtConfig from "../config/jwt.config";
declare const JwtRefreshAuthStrategy_base: new (...args: any[]) => Strategy;
export declare class JwtRefreshAuthStrategy extends JwtRefreshAuthStrategy_base {
    private readonly userInfoCachingService;
    constructor(config: ConfigType<typeof jwtConfig>, userInfoCachingService: UserInfoCachingService);
    validate(payload: JWT2FAPayload): Promise<User | void>;
}
export {};
