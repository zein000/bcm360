import { ConfigurationName } from "src/enums/configuration.enum";
import Configuration from "../models/configuration.model";
export declare class ConfigurationRepository {
    private model;
    private readonly logger;
    constructor(model: typeof Configuration);
    findAll(): Promise<Configuration[]>;
    findAllByName(name: ConfigurationName): Promise<Configuration[]>;
    findByName(name: string, companyId?: number): Promise<Configuration>;
    save(config: Configuration): Promise<Configuration>;
    updateByName(name: string, data: Partial<Configuration>): Promise<[affectedCount: number]>;
    update(config: Configuration, data: Partial<Configuration>): Promise<Configuration>;
    upsert(data: Partial<Configuration>): Promise<[Configuration, boolean]>;
    deleteByName(updatedBy: number, name: string): Promise<void>;
    create(config: Partial<Configuration>): Configuration;
}
