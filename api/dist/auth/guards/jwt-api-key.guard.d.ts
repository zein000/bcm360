import { CanActivate, ExecutionContext } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UserInfoCachingService } from "src/caching/services/user-info-caching.service";
import { ScenarioProgressCachingService } from "src/caching/services/scenario-progress-caching.service";
export declare class JwtAndApiKeyGuard implements CanActivate {
    private readonly userInfoCachingService;
    private readonly scenarioProgressCachingService;
    private readonly jwtService;
    constructor(userInfoCachingService: UserInfoCachingService, scenarioProgressCachingService: ScenarioProgressCachingService, jwtService: JwtService);
    canActivate(context: ExecutionContext): Promise<boolean>;
    checkIfParticipant(authHeader: string, request: any): Promise<boolean>;
}
