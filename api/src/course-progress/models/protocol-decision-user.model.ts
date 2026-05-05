import { BelongsTo, Model, Column, DataType, ForeignKey, Table } from "sequelize-typescript";
import ProtocolDecisions from "./protocol-decisions.model";
import CourseProgressUsers from "./course-progress-users.model";

/**
 * Modell: ProtocolDecisionUserModel
 *
 * Diese Klasse bildet eine Zwischentabelle, die die Beziehung zwischen
 * Benutzern (`CourseProgressUsers`) und getroffenen Entscheidungen (`ProtocolDecisions`) abbildet.
 *
 * Ein Benutzer kann für mehrere Entscheidungen stimmen,
 * und jede Entscheidung kann von mehreren Benutzern getroffen oder unterstützt werden.
 *
 * Die Tabelle heißt `protocol-decision-user` und verwendet keine automatischen Zeitstempel.
 */
@Table({ tableName: "protocol-decision-user", timestamps: false })
export default class ProtocolDecisionUserModel extends Model {
	/**
	 * Fremdschlüssel zur Entscheidung, für die der Benutzer gestimmt hat.
	 */
	@ForeignKey(() => ProtocolDecisions)
	@Column({ type: DataType.INTEGER, allowNull: false })
	protocolDecisionId: number;

	/**
	 * Zugehörige Entscheidung – stellt die Verbindung zur Entscheidungstabelle her.
	 */
	@BelongsTo(() => ProtocolDecisions)
	protocolDecision: ProtocolDecisions;

    /**
     * Fremdschlüssel zum Benutzer, der an der Entscheidung beteiligt war.
     */
    @ForeignKey(() => CourseProgressUsers)
	@Column({ type: DataType.UUIDV4, allowNull: false })
	userId: string;

	/**
	 * Zugehöriger Benutzer – stellt die Verbindung zur Zwischennutzertabelle her.
	 */
	@BelongsTo(() => CourseProgressUsers)
	user: CourseProgressUsers;
}
