import { Model } from "sequelize-typescript";
export default class RolePermission extends Model {
    roleId: number;
    permissionId: number;
}
