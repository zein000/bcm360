import { Language } from "../enums/language.enum";
import Translation from "../models/translation.model";
export declare class TranslationRepository {
    private model;
    private readonly logger;
    constructor(model: typeof Translation);
    findByKeyAndLanguages(key: string, languages: Language[]): Promise<Translation[]>;
    findByKeysAndLanguages(keys: string[], languages: Language[]): Promise<Translation[]>;
}
