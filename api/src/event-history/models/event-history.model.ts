import {
	Column,
	Model,
	Table,
	DataType,
	CreatedAt,
	UpdatedAt,
	PrimaryKey,
} from "sequelize-typescript";

import { EventName } from "../../enums/event-name.enum";

@Table({ tableName: "event_history" })
export default class EventHistory extends Model {
	@PrimaryKey
	@Column({ type: DataType.INTEGER, autoIncrement: true })
	id: number;

	@Column({ type: DataType.ENUM({ values: Object.values(EventName) }), allowNull: false })
	name: EventName;

	@Column({ type: DataType.INTEGER, allowNull: true })
	userId?: number;

	@Column({ type: DataType.JSON, allowNull: true })
	data?: Record<string, unknown>;

	@UpdatedAt
	updatedAt: Date;

	@CreatedAt
	createdAt: Date;
}
