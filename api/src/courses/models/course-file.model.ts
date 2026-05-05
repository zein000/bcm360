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
import Course from "./course.model";
import { FileTypes } from "../../file/enum/FileTypes.enum";
import { FileAssignment } from "../enums/FileAssignment.enum";

@Table({ tableName: "course-file" })
export default class CourseFile extends Model {
	@PrimaryKey
	@Column({ type: DataType.INTEGER, autoIncrement: true })
	id: number;

	@Column({ type: DataType.STRING(255), allowNull: false })
	fullFilePath: string;

	@Column({ type: DataType.STRING(255), allowNull: false })
	fileName: string;

	@Column({ type: DataType.INTEGER, allowNull: false })
	fileLength: number;

	@Column({
		type: DataType.ENUM(...Object.values(FileTypes)),
		allowNull: false,
		defaultValue: FileTypes.Unknown,
	})
	fileType: FileTypes;

	@Column({
		type: DataType.ENUM(...Object.values(FileAssignment)),
		allowNull: false,
		defaultValue: FileAssignment.Content,
	})
	fileAssignment: FileAssignment;

	@ForeignKey(() => Course)
	@Column({ type: DataType.INTEGER, allowNull: true })
	courseId?: number;

	@BelongsTo(() => Course)
	course?: Course;

	@UpdatedAt
	updatedAt: Date;

	@CreatedAt
	createdAt: Date;
}
