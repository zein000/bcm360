import { CanActivate, ExecutionContext } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { ScenarioProgressCachingService } from "src/caching/services/scenario-progress-caching.service";
import { UserInfoCachingService } from "src/caching/services/user-info-caching.service";
export declare class WebSocketGuard implements CanActivate {
    private readonly jwtService;
    private readonly userInfoCachingService;
    private readonly scenarioProgressCachingService;
    constructor(jwtService: JwtService, userInfoCachingService: UserInfoCachingService, scenarioProgressCachingService: ScenarioProgressCachingService);
    canActivate(context: ExecutionContext): Promise<boolean>;
    checkIfParticipant(token: string, request: any): Promise<boolean>;
}
