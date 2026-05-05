import { Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class JwtTwoFactorOtpGuard extends AuthGuard("jwt-two-factor-otp") {}
