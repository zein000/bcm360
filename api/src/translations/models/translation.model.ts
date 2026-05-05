import { Model, Column, Table, DataType, PrimaryKey } from "sequelize-typescript";

import { Language } from "../enums/language.enum";

@Table({
	indexes: [{ fields: ["key", "language"], unique: true }],
	tableName: "translation",
})
export default class Translation extends Model {
	@PrimaryKey
	@Column({ type: DataType.INTEGER, autoIncrement: true })
	id: number;

	@Column({ type: DataType.STRING(255) })
	key: string;

	@Column({
		type: DataType.ENUM({ values: Object.values(Language) }),
		allowNull: false,
		defaultValue: Language.DE,
	})
	language: Language;

	@Column({ type: DataType.STRING(255) })
	text: string;
}
