import { Test, TestingModule } from "@nestjs/testing";

import { SequelizeModule } from "@nestjs/sequelize";
import { DatabaseModule } from "src/database/database.module";
import { FeaturesController } from "./features.controller";
import { FeaturesSeeder } from "./features.seeder";
import { FeaturesService } from "./features.service";
import Feature from "./models/feature.model";
import { FeatureRepository } from "./repositories/feature.repo";

describe("FeaturesController", () => {
	let controller: FeaturesController;

	const mockFeaturesService = {};

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			imports: [DatabaseModule, SequelizeModule.forFeature([Feature])],
			controllers: [FeaturesController],
			providers: [FeatureRepository, FeaturesService, FeaturesSeeder],
			exports: [FeatureRepository, FeaturesService, FeaturesSeeder],
		})
			.overrideProvider(FeaturesService)
			.useValue(mockFeaturesService)
			.compile();

		controller = module.get<FeaturesController>(FeaturesController);
	});

	it("should be defined", () => {
		expect(controller).toBeDefined();
	});
});
