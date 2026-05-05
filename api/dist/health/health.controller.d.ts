import { HealthCheckService, SequelizeHealthIndicator } from "@nestjs/terminus";
export declare class HealthController {
    private health;
    private db;
    constructor(health: HealthCheckService, db: SequelizeHealthIndicator);
    check(): Promise<import("@nestjs/terminus").HealthCheckResult>;
}
