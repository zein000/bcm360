import { ConfigType } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { TwoFAEnabledDTO } from "src/users/dto/2fa-enabled.dto";
import User from "src/users/models/user.model";
import { UsersService } from "../users/users.service";
import jwtConfig from "./config/jwt.config";
import { AuthResponseDTO } from "./dto/auth-response.dto";
export declare class AuthService {
    private readonly usersService;
    private readonly jwtService;
    private config;
    constructor(usersService: UsersService, jwtService: JwtService, config: ConfigType<typeof jwtConfig>);
    validateUser(email: string, password: string): Promise<User | null>;
    loginWith2fa(user: User, isRememberMe: boolean): TwoFAEnabledDTO;
    login(user: User, isRememberMe?: boolean): AuthResponseDTO;
}
