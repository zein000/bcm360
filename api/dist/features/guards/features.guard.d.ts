import { CanActivate, Type } from "@nestjs/common";
import { FeaturesCodes } from "../enum/codes";
export declare const FeaturesGuard: (feature: FeaturesCodes) => Type<CanActivate>;
