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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var TranslationRepository_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TranslationRepository = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const sequelize_2 = require("sequelize");
const translation_model_1 = require("../models/translation.model");
let TranslationRepository = TranslationRepository_1 = class TranslationRepository {
    constructor(model) {
        this.model = model;
        this.logger = new common_1.Logger(TranslationRepository_1.name);
    }
    async findByKeyAndLanguages(key, languages) {
        return this.model.findAll({
            where: {
                key,
                language: { [sequelize_2.Op.in]: languages },
            },
        });
    }
    async findByKeysAndLanguages(keys, languages) {
        return this.model.findAll({
            where: {
                key: { [sequelize_2.Op.in]: keys },
                language: { [sequelize_2.Op.in]: languages },
            },
        });
    }
};
exports.TranslationRepository = TranslationRepository;
exports.TranslationRepository = TranslationRepository = TranslationRepository_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(translation_model_1.default)),
    __metadata("design:paramtypes", [Object])
], TranslationRepository);
//# sourceMappingURL=translation.repository.js.map