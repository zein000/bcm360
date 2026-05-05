import User from "src/users/models/user.model";
import { ConfigurationName } from "src/enums/configuration.enum";
import { ConfigurationResponseDTO } from "./dtos/configuration-response.dto";
import Configuration from "./models/configuration.model";
import { ConfigurationRepository } from "./repositories/configuration.repository";
export declare class ConfigurationService {
    private readonly configRepo;
    constructor(configRepo: ConfigurationRepository);
    findAll(): Promise<ConfigurationResponseDTO[]>;
    findAllByNameInteranal(name: ConfigurationName): Promise<Configuration[]>;
    findAllByName(name: ConfigurationName): Promise<ConfigurationResponseDTO[]>;
    findOneByName(name: ConfigurationName): Promise<Configuration>;
    find(name: string, companyId?: number): Promise<ConfigurationResponseDTO>;
    create(user: User, name: ConfigurationName, value: string): Promise<ConfigurationResponseDTO>;
    update(user: User, name: ConfigurationName, value: string): Promise<ConfigurationResponseDTO>;
    upsert(user: User, name: ConfigurationName, value: string): Promise<ConfigurationResponseDTO>;
    delete(user: User, name: ConfigurationName): Promise<void>;
    private toResponse;
}
