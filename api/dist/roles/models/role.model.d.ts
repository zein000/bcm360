import { Model } from "sequelize-typescript";
import Permission from "src/permissions/models/permission.model";
export declare class Role extends Model {
    id: number;
    name: string;
    code: string;
    description: string;
    permissions?: Permission[];
    updatedAt: Date;
    createdAt: Date;
}
export default Role;
