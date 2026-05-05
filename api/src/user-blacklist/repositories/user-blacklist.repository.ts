import { Injectable, InternalServerErrorException, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";

import { Op } from "sequelize";

import { Errors } from "../../enums/errors.enum";
import User from "../../users/models/user.model";
import UserBlacklist from "../models/user-blacklist.model";

@Injectable()
export class UserBlacklistRepo {
	private readonly logger = new Logger(UserBlacklistRepo.name);

	constructor(
		@InjectModel(UserBlacklist)
		private model: typeof UserBlacklist
	) {}

	async create(blacklist: Partial<UserBlacklist>): Promise<UserBlacklist> {
		try {
			return this.model.build(blacklist);
		} catch (error) {
			this.logger.error(error, "Failed to create blacklist entity");

			throw new InternalServerErrorException(Errors.INTERNAL_ERROR);
		}
	}

	async save(blacklist: UserBlacklist): Promise<UserBlacklist> {
		try {
			return await blacklist.save();
		} catch (error) {
			this.logger.error(error, "Failed to save blacklist entity", blacklist.id);
			throw new InternalServerErrorException(Errors.INTERNAL_ERROR);
		}
	}

	async findOneByValue(value: string): Promise<UserBlacklist> {
		try {
			return this.model.findOne({ where: { value }, include: User });
		} catch (error) {
			this.logger.error(error, "Failed to find blacklist list");
			throw new InternalServerErrorException(Errors.INTERNAL_ERROR);
		}
	}

	async findAll(): Promise<UserBlacklist[]> {
		try {
			return this.model.findAll({ include: User });
		} catch (error) {
			this.logger.error(error, "Failed to find blacklist list");
			throw new InternalServerErrorException(Errors.INTERNAL_ERROR);
		}
	}

	async deleteExpired(): Promise<UserBlacklist[]> {
		try {
			const toBeDeleted = await this.model.findAll({
				where: { expiresAt: { [Op.lte]: new Date() } },
			});

			await this.model.destroy({
				where: { expiresAt: { [Op.lte]: new Date() } },
			});

			return toBeDeleted;
		} catch (error) {
			this.logger.error(error, "Failed to delete expired blacklists");
			throw new InternalServerErrorException(Errors.INTERNAL_ERROR);
		}
	}
}
