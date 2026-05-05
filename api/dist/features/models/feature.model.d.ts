import { Model } from "sequelize-typescript";
import Company from "../../company/models/company.model";
export default class Feature extends Model {
    id: number;
    feature: string;
    active: boolean;
    companyId: number;
    company: Company;
    updatedAt?: Date;
    createdAt?: Date;
}
