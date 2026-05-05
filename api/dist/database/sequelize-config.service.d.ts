import { ConfigType } from "@nestjs/config";
import { SequelizeModuleOptions, SequelizeOptionsFactory } from "@nestjs/sequelize";
import sequelizeConfig from "./config/database.config";
export declare class SequelizeConfigService implements SequelizeOptionsFactory {
    private readonly config;
    constructor(config: ConfigType<typeof sequelizeConfig>);
    createSequelizeOptions(): SequelizeModuleOptions;
}
