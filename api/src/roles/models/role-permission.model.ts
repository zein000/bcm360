import { Column, Model, Table, ForeignKey, DataType } from "sequelize-typescript";

import Permission from "../../permissions/models/permission.model";

import Role from "../../roles/models/role.model";

@Table({ tableName: "role_permission" })
export default class RolePermission extends Model {
	@ForeignKey(() => Role)
	@Column({ type: DataType.INTEGER })
	roleId: number;

	@ForeignKey(() => Permission)
	@Column({ type: DataType.INTEGER })
	permissionId: number;
}
