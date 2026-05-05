import { Column, Model, Table, DataType, CreatedAt, PrimaryKey } from "sequelize-typescript";

@Table({ tableName: "configuration_history" })
export default class ConfigurationHistory extends Model {
	@PrimaryKey
	@Column({ type: DataType.INTEGER, autoIncrement: true })
	id: number;

	@Column({ type: DataType.INTEGER, allowNull: false })
	userId: number;

	@Column({ type: DataType.STRING, allowNull: false })
	name: string;

	@Column({ type: DataType.STRING, allowNull: true })
	valueBefore?: string;

	@Column({ type: DataType.STRING, allowNull: true })
	valueAfter?: string;

	@Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: false })
	isDeleted: boolean;

	@CreatedAt
	createdAt: Date;
}
