import { Injectable } from "@nestjs/common";

import { Language } from "./enums/language.enum";

import Translation from "./models/translation.model";
import { TranslationRepository } from "./repositories/translation.repository";

@Injectable()
export class TranslationsService {
	constructor(private translationRepo: TranslationRepository) {}

	async getByKey(key: string, lang: Language = Language.DE) {
		const translations = await this.translationRepo.findByKeyAndLanguages(key, [Language.DE, lang]);

		return (
			translations.find((t) => t.language === lang) ||
			translations.find((t) => t.language === Language.DE)
		);
	}

	async getByKeys(
		keys: string[],
		lang: Language = Language.DE
	): Promise<Record<string, Translation>> {
		const translations = await this.translationRepo.findByKeysAndLanguages(keys, [
			Language.DE,
			lang,
		]);

		const keysMap = translations.reduce((acc: Record<string, Translation>, curr: Translation) => {
			if (curr.language === lang) {
				acc[curr.key] = curr;
			}

			return acc;
		}, {});

		if (lang !== Language.DE) {
			translations.reduce((acc: Record<string, Translation>, curr: Translation) => {
				if (!acc[curr.key] && curr.language === Language.DE) {
					acc[curr.key] = curr;
				}

				return acc;
			}, keysMap);
		}

		return keysMap;
	}
}
