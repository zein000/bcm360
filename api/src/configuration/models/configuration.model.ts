import {
	AfterCreate,
	AfterDestroy,
	AfterUpdate,
	AfterUpsert,
	BelongsTo,
	Column,
	CreatedAt,
	DataType,
	DeletedAt,
	ForeignKey,
	Model,
	PrimaryKey,
	Table,
	UpdatedAt,
} from "sequelize-typescript";

import Company from "src/company/models/company.model";

import { ConfigurationName } from "src/enums/configuration.enum";

import ConfigurationHistory from "./configuration-history.model";

@Table({
	tableName: "configuration",
	paranoid: true,
	indexes: [
		{
			fields: ["name", "companyId", "deletedAt"],
			unique: true,
			where: {
				deletedAt: null,
			},
		},
	],
})
export default class Configuration extends Model {
	@PrimaryKey
	@Column({ type: DataType.INTEGER, autoIncrement: true })
	id: number;

	@Column({
		type: DataType.ENUM({ values: Object.values(ConfigurationName) }),
		allowNull: false,
	})
	name: ConfigurationName;

	@Column({ type: DataType.STRING, allowNull: false })
	value: string;

	@ForeignKey(() => Company)
	@Column({ type: DataType.INTEGER, allowNull: true })
	companyId?: number;

	@BelongsTo(() => Company)
	company?: Company;

	@Column({ type: DataType.VIRTUAL })
	updatedBy: number;

	@UpdatedAt
	updatedAt: Date;

	@CreatedAt
	createdAt: Date;

	@DeletedAt
	deletedAt: Date;

	@AfterCreate
	@AfterUpdate
	static async addHistory(instance: Configuration) {
		await ConfigurationHistory.build({
			name: instance.dataValues.name,
			valueBefore: instance.previous("value"),
			valueAfter: instance.dataValues.value,
			userId: instance.dataValues.updatedBy,
			createdAt: new Date(),
		}).save();
	}

	@AfterDestroy
	static async deleteHistory(instance: Configuration) {
		await ConfigurationHistory.build({
			name: instance.dataValues.name,
			valueBefore: instance.previous("value"),
			valueAfter: instance.dataValues.value,
			userId: instance.dataValues.updatedBy,
			isDeleted: true,
			createdAt: new Date(),
		}).save();
	}

	@AfterUpsert
	static async upsertHistory(res: [data: Configuration, isUpdated: boolean]) {
		const instance = res[0];

		await ConfigurationHistory.build({
			name: instance.dataValues.name,
			valueBefore: instance.previous("value"),
			valueAfter: instance.dataValues.value,
			userId: instance.dataValues.updatedBy,
			createdAt: new Date(),
		}).save();
	}
}
