import { Injectable, InternalServerErrorException, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";

import User from "src/users/models/user.model";

import { FeaturesCodes } from "../enum/codes";
import Feature from "../models/feature.model";

@Injectable()
export class FeatureRepository {
	private readonly logger = new Logger(FeatureRepository.name);
	constructor(
		@InjectModel(Feature)
		private model: typeof Feature
	) {}

	async getOneByFeature(feature: FeaturesCodes, companyId?: number): Promise<Feature> {
		try {
			const companyPermission = companyId
				? await this.model.findOne({
						where: {
							companyId: companyId,
							feature,
						},
					})
				: null;
			const generalPermission = await this.model.findOne({
				where: {
					companyId: null,
					feature,
				},
			});

			const featurePermission = companyPermission || generalPermission;

			if (!featurePermission) {
				throw new InternalServerErrorException();
			}

			return featurePermission;
		} catch (error) {
			this.logger.error(error, "Failed to get featurePermission for company %s", companyId);
			throw new InternalServerErrorException();
		}
	}

	async getAll(user?: User): Promise<Feature[]> {
		try {
			const allCompanyPermissions = user
				? await this.model.findAll({
						where: {
							companyId: user.company.id,
						},
					})
				: [];
			const allGeneralPermissions = await this.model.findAll({
				where: {
					companyId: null,
				},
			});

			return [
				...allCompanyPermissions,
				...allGeneralPermissions.filter((feature) => {
					return !allCompanyPermissions.some((companyFeature) => {
						return companyFeature.feature === feature.feature;
					});
				}),
			];
		} catch (error) {
			this.logger.error(error, "Failed to get featurePermission for company %s", user.company.id);
			throw new InternalServerErrorException();
		}
	}
}
