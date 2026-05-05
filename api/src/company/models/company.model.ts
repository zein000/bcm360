import {
	BelongsTo,
	Column,
	CreatedAt,
	DataType,
	ForeignKey,
	HasMany,
	Model,
	PrimaryKey,
	Table,
	UpdatedAt,
} from "sequelize-typescript";

import User from "../../users/models/user.model";
import CourseTag from "src/courses/models/course-tag.model";

@Table({ tableName: "company", paranoid: true })
export default class Company extends Model {
	@PrimaryKey
	@Column({ type: DataType.INTEGER, autoIncrement: true })
	id: number;

	@Column({ type: DataType.STRING(255), allowNull: true })
	name?: string;

	@Column({ type: DataType.INTEGER, allowNull: true })
	startDay?: number;

	@HasMany(() => User, { as: "admins", onDelete: "CASCADE" })
	admins?: User[];

	@HasMany(() => User, { as: "users", onDelete: "CASCADE" })
	users?: User[];

	@HasMany(() => CourseTag, { as: "tags", onDelete: "CASCADE" })
	tags?: CourseTag[];

	@ForeignKey(() => User)
	@Column({ type: DataType.INTEGER, allowNull: true })
	deletedById?: number;

	@BelongsTo(() => User)
	deletedBy?: User;

	@UpdatedAt
	updatedAt: Date;

	@CreatedAt
	createdAt: Date;
}
