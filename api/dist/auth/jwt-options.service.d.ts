import { ConfigType } from "@nestjs/config";
import { JwtModuleOptions, JwtOptionsFactory } from "@nestjs/jwt";
import jwtConfig from "./config/jwt.config";
export declare class JWTOptionsService implements JwtOptionsFactory {
    private readonly config;
    constructor(config: ConfigType<typeof jwtConfig>);
    createJwtOptions(): JwtModuleOptions;
}
