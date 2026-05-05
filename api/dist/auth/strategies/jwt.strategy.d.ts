import { ConfigType } from "@nestjs/config";
import { Strategy } from "passport-jwt";
import { JWTPayload } from "src/interfaces/jwt-payload.interface";
import jwtConfig from "../config/jwt.config";
declare const JwtStrategy_base: new (...args: any[]) => Strategy;
export declare class JwtStrategy extends JwtStrategy_base {
    private readonly config;
    constructor(config: ConfigType<typeof jwtConfig>);
    validate(payload: JWTPayload): Promise<JWTPayload>;
}
export {};
