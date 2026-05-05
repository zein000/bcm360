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

// Import verwandter Modelle
import Course from "src/courses/models/course.model";
import User from "src/users/models/user.model";
import { CourseProgressEnum } from "../enum/Status";
import ProtocolHistories from "./protocol-histories.model";
import CourseProgressUsers from "./course-progress-users.model";
import CourseProgressContent from "./course-progress-content.model";

/**
 * Modell für den Kursfortschritt eines Benutzers.
 *
 * Diese Tabelle speichert alle Informationen über den Verlauf eines Benutzers in einem bestimmten Kurs.
 * Es verknüpft Kurse, Benutzer, Fortschrittsinhalte und Protokolleinträge miteinander.
 *
 * `paranoid: true` sorgt dafür, dass Löschungen nur als „soft delete“ erfolgen (es bleibt ein Zeitstempel erhalten).
 */
@Table({ tableName: "course-progress", paranoid: true })
export default class CourseProgress extends Model {
	/** Eindeutige ID für diesen Kursfortschrittseintrag (UUID) */
	@PrimaryKey
	@Column({ type: DataType.UUIDV4, defaultValue: DataType.UUIDV4 })
	id: string;

	/** Status des Fortschritts (z. B. NotStarted, InProgress, Finished) */
	@Column({
		type: DataType.ENUM(...Object.values(CourseProgressEnum)),
		allowNull: false,
		defaultValue: CourseProgressEnum.NotStarted,
	})
	status: CourseProgressEnum;

	/** Optional: ID der letzten Phase des Szenarios, wenn vorhanden */
	@Column({ type: DataType.INTEGER, allowNull: true })
	finalPhaseId?: number;

	/** Optional: Abschließende Nachricht nach Beendigung des Szenarios */
	@Column({ type: DataType.STRING, allowNull: true })
	scenarioEndMessage?: string;

	/** Optional: Zeitpunkt, an dem das Szenario als abgeschlossen gilt */
	@Column({ type: DataType.DATE, allowNull: true })
	finishDate?: Date;

	/** Fremdschlüssel zur zugehörigen Kurs-ID */
	@ForeignKey(() => Course)
	@Column({ type: DataType.INTEGER, allowNull: false })
	courseId: number;

	/** Zugehöriger Kurs */
	@BelongsTo(() => Course)
	course: Course;

	/** Historie der Protokolleinträge während des Fortschritts */
	@HasMany(() => ProtocolHistories)
	protocolHistories: ProtocolHistories;

	/** Liste aller Benutzer, die an diesem Kursfortschritt beteiligt sind */
	@HasMany(() => CourseProgressUsers)
	users: CourseProgressUsers;

	/** Inhaltlicher Fortschritt (z. B. bearbeitete Lektionen) */
	@HasMany(() => CourseProgressContent)
	content: CourseProgressContent;

	/** Fremdschlüssel: Benutzer, dem dieser Fortschritt gehört */
	@ForeignKey(() => User)
	@Column({ type: DataType.INTEGER, allowNull: false })
	userId: number;

	/** Referenz auf den zugehörigen Benutzer */
	@BelongsTo(() => User, { as: "user" })
	user: User;

	/** Optional: ID des Benutzers, der diesen Fortschritt gelöscht hat (Soft Delete) */
	@ForeignKey(() => User)
	@Column({ type: DataType.INTEGER, allowNull: true })
	deletedById?: number;

	/** Benutzerobjekt desjenigen, der gelöscht hat (für Nachvollziehbarkeit) */
	@BelongsTo(() => User, { as: "deletedBy" })
	deletedBy?: User;

	/** Zeitstempel der letzten Aktualisierung */
	@UpdatedAt
	updatedAt: Date;

	/** Zeitstempel der Erstellung */
	@CreatedAt
	createdAt: Date;
}
