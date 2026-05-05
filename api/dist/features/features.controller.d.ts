import RequestWithUser from "../interfaces/request-with-user.interface";
import { FeaturesResponseDto } from "./dtos/features-response.dto";
import { FeaturesService } from "./features.service";
export declare class FeaturesController {
    private readonly featuresService;
    constructor(featuresService: FeaturesService);
    getFeatures({ user }: RequestWithUser): Promise<FeaturesResponseDto[]>;
    getFeaturesWithoutPermission(): Promise<FeaturesResponseDto[]>;
}
