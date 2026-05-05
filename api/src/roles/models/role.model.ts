import {
	Column,
	Model,
	Table,
	DataType,
	BelongsToMany,
	CreatedAt,
	UpdatedAt,
	PrimaryKey,
} from "sequelize-typescript";

import Permission from "src/permissions/models/permission.model";
import User from "src/users/models/user.model";

import RolePermission from "./role-permission.model";

@Table({ tableName: "role" })
export class Role extends Model {
	@PrimaryKey
	@Column({ type: DataType.INTEGER, autoIncrement: true })
	id: number;

	@Column({ type: DataType.STRING(255), allowNull: true })
	name: string;

	@Column({ type: DataType.STRING(255), unique: "column", allowNull: false })
	code: string;

	@Column({ type: DataType.STRING, allowNull: true })
	description: string;

	@BelongsToMany(() => Permission, () => RolePermission)
	permissions?: Permission[];

	@UpdatedAt
	updatedAt: Date;

	@CreatedAt
	createdAt: Date;
}

export default Role;
