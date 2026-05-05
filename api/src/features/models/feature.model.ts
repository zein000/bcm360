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

import Company from "../../company/models/company.model";

@Table({ tableName: "feature" })
export default class Feature extends Model {
	@PrimaryKey
	@Column({ type: DataType.INTEGER, autoIncrement: true })
	id: number;

	@Column({ type: DataType.STRING(255), allowNull: false })
	feature: string;

	@Column({ type: DataType.BOOLEAN, allowNull: false })
	active: boolean;

	@ForeignKey(() => Company)
	@Column({ type: DataType.INTEGER, allowNull: true })
	companyId: number;

	@BelongsTo(() => Company)
	company: Company;

	@UpdatedAt
	updatedAt?: Date;

	@CreatedAt
	createdAt?: Date;
}
