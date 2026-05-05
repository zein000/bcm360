import RequestWithUser from "../interfaces/request-with-user.interface";
import { ConfigurationService } from "./configuration.service";
import { AddConfigurationRequestDTO } from "./dtos/add-configuration-request.dto";
import { ConfigurationParamRequestDTO } from "./dtos/configuration-param-request.dto";
import { ConfigurationResponseDTO } from "./dtos/configuration-response.dto";
import { UpdateConfigurationRequestDTO } from "./dtos/update-configuration-request.dto";
export declare class ConfigurationController {
    private readonly configService;
    constructor(configService: ConfigurationService);
    findAll(): Promise<ConfigurationResponseDTO[]>;
    find({ name }: ConfigurationParamRequestDTO, { user }: RequestWithUser): Promise<ConfigurationResponseDTO>;
    createConfig({ user }: RequestWithUser, { name, value }: AddConfigurationRequestDTO): Promise<ConfigurationResponseDTO>;
    upsertConfig({ name }: ConfigurationParamRequestDTO, { user }: RequestWithUser, { value }: UpdateConfigurationRequestDTO): Promise<ConfigurationResponseDTO>;
    updateConfig({ name }: ConfigurationParamRequestDTO, { user }: RequestWithUser, { value }: UpdateConfigurationRequestDTO): Promise<ConfigurationResponseDTO>;
    deleteConfig({ name }: ConfigurationParamRequestDTO, { user }: RequestWithUser): Promise<void>;
}
