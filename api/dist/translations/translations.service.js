"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TranslationsService = void 0;
const common_1 = require("@nestjs/common");
const language_enum_1 = require("./enums/language.enum");
const translation_repository_1 = require("./repositories/translation.repository");
let TranslationsService = class TranslationsService {
    constructor(translationRepo) {
        this.translationRepo = translationRepo;
    }
    async getByKey(key, lang = language_enum_1.Language.DE) {
        const translations = await this.translationRepo.findByKeyAndLanguages(key, [language_enum_1.Language.DE, lang]);
        return (translations.find((t) => t.language === lang) ||
            translations.find((t) => t.language === language_enum_1.Language.DE));
    }
    async getByKeys(keys, lang = language_enum_1.Language.DE) {
        const translations = await this.translationRepo.findByKeysAndLanguages(keys, [
            language_enum_1.Language.DE,
            lang,
        ]);
        const keysMap = translations.reduce((acc, curr) => {
            if (curr.language === lang) {
                acc[curr.key] = curr;
            }
            return acc;
        }, {});
        if (lang !== language_enum_1.Language.DE) {
            translations.reduce((acc, curr) => {
                if (!acc[curr.key] && curr.language === language_enum_1.Language.DE) {
                    acc[curr.key] = curr;
                }
                return acc;
            }, keysMap);
        }
        return keysMap;
    }
};
exports.TranslationsService = TranslationsService;
exports.TranslationsService = TranslationsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [translation_repository_1.TranslationRepository])
], TranslationsService);
//# sourceMappingURL=translations.service.js.map