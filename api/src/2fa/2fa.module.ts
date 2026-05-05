import { forwardRef, Module } from "@nestjs/common";

import { UsersModule } from "src/users/users.module";
import { AuthModule } from "src/auth/auth.module";

import { TwoFactorAuthenticationService } from "./2fa.service";
import { TwoFactorAuthenticationController } from "./2fa.controller";
import { CachingModule } from "../caching/caching.module";

@Module({
	imports: [
		forwardRef(() => UsersModule),
		forwardRef(() => AuthModule),
		forwardRef(() => CachingModule),
	],
	controllers: [TwoFactorAuthenticationController],
	providers: [TwoFactorAuthenticationService],
	exports: [TwoFactorAuthenticationService],
})
export class TwoFactorAuthenticationModule {}
