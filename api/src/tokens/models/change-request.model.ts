import {
	Column,
	Model,
	Table,
	DataType,
	ForeignKey,
	BelongsTo,
	CreatedAt,
	UpdatedAt,
	PrimaryKey,
} from "sequelize-typescript";

import Token from "../../tokens/models/token.model";

@Table({
	tableName: "change_request",
})
export default class ChangeRequest extends Model {
	@PrimaryKey
	@Column({ type: DataType.INTEGER, autoIncrement: true })
	id: number;

	@ForeignKey(() => Token)
	@Column({ type: DataType.INTEGER, allowNull: true })
	tokenId?: number;

	@BelongsTo(() => Token)
	token?: Token;

	@Column({ type: DataType.JSON, allowNull: false })
	changeFrom: Record<string, unknown>;

	@Column({ type: DataType.JSON, allowNull: false })
	changeTo: Record<string, unknown>;

	@Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: false })
	isAccepted?: boolean;

	@UpdatedAt
	updatedAt: Date;

	@CreatedAt
	createdAt: Date;
}
