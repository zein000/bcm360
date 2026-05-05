import {
	Model,
	Column,
	Table,
	DataType,
	PrimaryKey,
	BelongsTo,
	ForeignKey,
	UpdatedAt,
	CreatedAt,
	HasOne,
} from "sequelize-typescript";

import ChangeRequest from "./change-request.model";

import User from "../../users/models/user.model";

import { ETokenPurpose } from "../enums/token-purpose.enum";

@Table({ tableName: "token" })
export default class Token extends Model {
	@PrimaryKey
	@Column({ type: DataType.INTEGER, autoIncrement: true })
	id: number;

	@ForeignKey(() => User)
	@Column({ type: DataType.INTEGER, allowNull: true })
	userId?: number;

	@BelongsTo(() => User)
	user?: User;

	@Column({
		type: DataType.ENUM({ values: Object.values(ETokenPurpose) }),
		allowNull: false,
	})
	purpose: ETokenPurpose;

	@Column({ type: DataType.STRING(255), allowNull: false })
	token: string;

	@Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: false })
	isUsed: boolean;

	@UpdatedAt
	updatedAt: Date;

	@CreatedAt
	createdAt: Date;

	@HasOne(() => ChangeRequest, { onDelete: "CASCADE" })
	changeRequest?: ChangeRequest;
}
