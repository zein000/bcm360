import { Module, forwardRef } from "@nestjs/common";

import { SequelizeModule } from "@nestjs/sequelize";

import { UsersModule } from "src/users/users.module";

import { CachingModule } from "src/caching/caching.module";

import UserBlacklist from "./models/user-blacklist.model";
import { UserBlacklistRepo } from "./repositories/user-blacklist.repository";
import { UserBlacklistController } from "./user-blacklist.controller";
import { UserBlacklistService } from "./user-blacklist.service";

@Module({
	imports: [
		SequelizeModule.forFeature([UserBlacklist]),
		forwardRef(() => UsersModule),
		forwardRef(() => CachingModule),
	],
	controllers: [UserBlacklistController],
	providers: [UserBlacklistService, UserBlacklistRepo],
	exports: [UserBlacklistService],
})
export class UserBlacklistModule {}
