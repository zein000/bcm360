import { Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Op } from "sequelize";

import { Language } from "../enums/language.enum";

import Translation from "../models/translation.model";

@Injectable()
export class TranslationRepository {
	private readonly logger = new Logger(TranslationRepository.name);
	constructor(
		@InjectModel(Translation)
		private model: typeof Translation
	) {}

	async findByKeyAndLanguages(key: string, languages: Language[]): Promise<Translation[]> {
		return this.model.findAll({
			where: {
				key,
				language: { [Op.in]: languages },
			},
		});
	}

	async findByKeysAndLanguages(keys: string[], languages: Language[]): Promise<Translation[]> {
		return this.model.findAll({
			where: {
				key: { [Op.in]: keys },
				language: { [Op.in]: languages },
			},
		});
	}
}
