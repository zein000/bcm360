import { ConfigType } from "@nestjs/config";
import { Strategy } from "passport-jwt";
import { JWT2FAPayload } from "src/interfaces/jwt-2fa-payload.interface";
import { BlacklistJwtCachingService } from "src/caching/services/blacklist-caching.service";
import { UserInfoCachingService } from "../../caching/services/user-info-caching.service";
import User from "../../users/models/user.model";
import jwtConfig from "../config/jwt.config";
declare const JwtTwoFactorStrategy_base: new (...args: any[]) => Strategy;
export declare class JwtTwoFactorStrategy extends JwtTwoFactorStrategy_base {
    private readonly userInfoCachingService;
    private readonly jwtCachingService;
    constructor(config: ConfigType<typeof jwtConfig>, userInfoCachingService: UserInfoCachingService, jwtCachingService: BlacklistJwtCachingService);
    validate(req: any, payload: JWT2FAPayload): Promise<User | void>;
}
export {};
