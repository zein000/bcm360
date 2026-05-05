import { CanActivate, ExecutionContext, Inject, Logger, mixin, Type } from "@nestjs/common";

import RequestWithUser from "src/interfaces/request-with-user.interface";

import { FeaturesCodes } from "../enum/codes";
import { FeatureRepository } from "../repositories/feature.repo";

export const FeaturesGuard = (feature: FeaturesCodes): Type<CanActivate> => {
	class FeaturesGuardMixin implements CanActivate {
		private logger = new Logger();

		constructor(
			@Inject(FeatureRepository)
			private readonly featureRepo: FeatureRepository
		) {}

		async canActivate(context: ExecutionContext) {
			const request: RequestWithUser = context.switchToHttp().getRequest<RequestWithUser>();
			const { user } = request;

			if (!user) {
				const hasFeature = await this.featureRepo.getOneByFeature(feature);

				return hasFeature.active;
			}

			const hasFeature = await this.featureRepo.getOneByFeature(feature, user.companyId);

			return hasFeature.active;
		}
	}

	return mixin(FeaturesGuardMixin);
};
