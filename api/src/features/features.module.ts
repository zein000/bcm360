import { Module } from "@nestjs/common";

import { SequelizeModule } from "@nestjs/sequelize";

import { DatabaseModule } from "src/database/database.module";

import { FeaturesController } from "./features.controller";
import { FeaturesSeeder } from "./features.seeder";
import { FeaturesService } from "./features.service";
import Feature from "./models/feature.model";
import { FeatureRepository } from "./repositories/feature.repo";

@Module({
	imports: [DatabaseModule, SequelizeModule.forFeature([Feature])],
	controllers: [FeaturesController],
	providers: [FeatureRepository, FeaturesService, FeaturesSeeder],
	exports: [FeatureRepository, FeaturesService, FeaturesSeeder],
})
export class FeaturesModule {}
