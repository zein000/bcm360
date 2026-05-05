import { Language } from "./enums/language.enum";
import Translation from "./models/translation.model";
import { TranslationRepository } from "./repositories/translation.repository";
export declare class TranslationsService {
    private translationRepo;
    constructor(translationRepo: TranslationRepository);
    getByKey(key: string, lang?: Language): Promise<Translation>;
    getByKeys(keys: string[], lang?: Language): Promise<Record<string, Translation>>;
}
