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
import Course from "./course.model";
import Company from "src/company/models/company.model";

@Table({ tableName: "course-tag" })
export default class CourseTag extends Model {
	@PrimaryKey
	@Column({ type: DataType.INTEGER, autoIncrement: true })
	id: number;

	@Column({ type: DataType.STRING(255), allowNull: false })
	name: string;

	@HasMany(() => Course)
	courses: Course[];

	@ForeignKey(() => Company)
	@Column({ type: DataType.INTEGER, allowNull: true })
	companyId?: number;

	@BelongsTo(() => Company)
	company?: Company;

	@UpdatedAt
	updatedAt: Date;

	@CreatedAt
	createdAt: Date;
}
