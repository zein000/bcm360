import { Model } from "sequelize-typescript";
export default class ConfigurationHistory extends Model {
    id: number;
    userId: number;
    name: string;
    valueBefore?: string;
    valueAfter?: string;
    isDeleted: boolean;
    createdAt: Date;
}
