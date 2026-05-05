import { Inject, Injectable, forwardRef } from "@nestjs/common";

import { extractJwtPayload } from "src/common/jwt.util";
import { UsersService } from "src/users/users.service";

import { BaseResponseDTO } from "src/common/dto/base-response.dto";

import { BlacklistJwtCachingService } from "src/caching/services/blacklist-caching.service";

import { JwtAlreadyBlacklisted } from "src/exceptions/jwt.exceptions";

import UserBlacklist from "./models/user-blacklist.model";
import { UserBlacklistRepo } from "./repositories/user-blacklist.repository";

@Injectable()
export class UserBlacklistService {
	constructor(
		private readonly blacklistRepository: UserBlacklistRepo,
		@Inject(forwardRef(() => UsersService))
		private readonly userService: UsersService,
		@Inject(forwardRef(() => BlacklistJwtCachingService))
		private readonly blacklistJwtCachingService: BlacklistJwtCachingService
	) {}

	async blacklistJwt(jwt: string) {
		const existingUserBlacklist = await this.blacklistRepository.findOneByValue(jwt);

		if (existingUserBlacklist) {
			throw new JwtAlreadyBlacklisted();
		}

		const jwtPayload = extractJwtPayload(jwt);

		const user = await this.userService.findOneById(jwtPayload.id);

		const newUserBlacklist: UserBlacklist = await this.blacklistRepository.create({
			userId: user.id,
			value: jwt,
			expiresAt: new Date(jwtPayload.exp * 1000),
			issuedAt: new Date(jwtPayload.iat * 1000),
		});

		await this.blacklistJwtCachingService.setBlacklistedJwt(newUserBlacklist);

		await this.blacklistRepository.save(newUserBlacklist);

		return {
			status: "ok",
		} as BaseResponseDTO<null>;
	}

	async findOneByValue(value: string) {
		return this.blacklistRepository.findOneByValue(value);
	}

	async deleteExpiredJwts() {
		const deletedUserBlacklists = await this.blacklistRepository.deleteExpired();

		for await (const blacklist of deletedUserBlacklists) {
			await this.blacklistJwtCachingService.deleteBlacklistedJwt(blacklist.value);
		}
	}
}
