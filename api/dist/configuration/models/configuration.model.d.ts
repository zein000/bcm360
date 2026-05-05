import { Model } from "sequelize-typescript";
import Company from "src/company/models/company.model";
import { ConfigurationName } from "src/enums/configuration.enum";
export default class Configuration extends Model {
    id: number;
    name: ConfigurationName;
    value: string;
    companyId?: number;
    company?: Company;
    updatedBy: number;
    updatedAt: Date;
    createdAt: Date;
    deletedAt: Date;
    static addHistory(instance: Configuration): Promise<void>;
    static deleteHistory(instance: Configuration): Promise<void>;
    static upsertHistory(res: [data: Configuration, isUpdated: boolean]): Promise<void>;
}
