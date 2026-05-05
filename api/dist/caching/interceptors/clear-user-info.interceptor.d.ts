import { NestInterceptor, ExecutionContext, CallHandler } from "@nestjs/common";
import { Observable } from "rxjs";
import { UserInfoCachingService } from "../services/user-info-caching.service";
export declare class ClearUserInfoCacheInterceptor implements NestInterceptor {
    private readonly userInfoCaching;
    constructor(userInfoCaching: UserInfoCachingService);
    intercept(context: ExecutionContext, next: CallHandler): Observable<unknown>;
}
