import { Injectable } from "@nestjs/common";

import User from "src/users/models/user.model";

import { FeatureInfo } from "./dtos/feature-info";
import { FeatureRepository } from "./repositories/feature.repo";

@Injectable()
export class FeaturesService {
	constructor(private readonly featureRepo: FeatureRepository) {}

	async getFeatures(user?: User) {
		const features = await this.featureRepo.getAll(user);

		return features.map((feature) => new FeatureInfo(feature));
	}
}
