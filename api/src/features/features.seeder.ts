import { Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";

import Feature from "./models/feature.model";

@Injectable()
export class FeaturesSeeder {
	private logger = new Logger(FeaturesSeeder.name);

	constructor(
		@InjectModel(Feature)
		private model: typeof Feature
	) {}

	async seed() {
		const permissions = [];

		try {
			this.logger.debug("saving features");
			for (const permission of permissions) {
				const feature = await this.model.findOne({
					where: {
						feature: permission.feature,
					},
				});

				if (!feature) {
					await this.model.create(permission);
				}
			}

			this.logger.debug("Finished saving features");
		} catch (error) {
			this.logger.error("Failed upserting features: ", error);
		}
	}
}
