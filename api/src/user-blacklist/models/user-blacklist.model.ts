import {
	BelongsTo,
	Column,
	CreatedAt,
	DataType,
	ForeignKey,
	Model,
	PrimaryKey,
	Table,
	UpdatedAt,
} from "sequelize-typescript";

import User from "../../users/models/user.model";

@Table({ tableName: "user_blacklist" })
export default class UserBlacklist extends Model {
	@PrimaryKey
	@Column({ type: DataType.INTEGER, autoIncrement: true })
	id: number;

	@Column({ type: DataType.STRING(255), unique: "column", allowNull: false })
	value: string;

	@Column({ type: DataType.DATE })
	expiresAt: Date;

	@Column({ type: DataType.DATE })
	issuedAt: Date;

	@ForeignKey(() => User)
	@Column({ type: DataType.INTEGER, allowNull: true })
	userId?: number;

	@BelongsTo(() => User)
	user?: User;

	@UpdatedAt
	updatedAt: Date;

	@CreatedAt
	createdAt: Date;
}
