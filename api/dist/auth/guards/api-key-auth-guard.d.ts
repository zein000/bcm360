import { CanActivate, ExecutionContext } from "@nestjs/common";
export declare class ApiKeyAuthGuard implements CanActivate {
    canActivate(context: ExecutionContext): Promise<boolean>;
}
