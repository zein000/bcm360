import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";

import Translation from "./models/translation.model";

import { TranslationRepository } from "./repositories/translation.repository";
import { TranslationsService } from "./translations.service";

@Module({
	imports: [SequelizeModule.forFeature([Translation])],
	providers: [TranslationsService, TranslationRepository],
	exports: [TranslationsService, TranslationRepository],
})
export class TranslationsModule {}
