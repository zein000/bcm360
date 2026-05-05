import { Model } from "sequelize-typescript";
import Role from "src/roles/models/role.model";
export default class Permission extends Model {
    id: number;
    name: string;
    code: string;
    description: string;
    roles?: Role[];
    updatedAt: Date;
    createdAt: Date;
}
