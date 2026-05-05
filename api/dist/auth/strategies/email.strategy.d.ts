import { Strategy } from "passport-local";
import User from "src/users/models/user.model";
import { AuthService } from "../auth.service";
declare const EmailStrategy_base: new (...args: any[]) => Strategy;
export declare class EmailStrategy extends EmailStrategy_base {
    private authService;
    constructor(authService: AuthService);
    validate(email: string, password: string): Promise<User>;
}
export {};
