import {
	BelongsTo,
	BelongsToMany,
	Column,
	DataType,
	ForeignKey,
	HasMany,
	Model,
	PrimaryKey,
	Table
} from "sequelize-typescript";

import ProtocolHistories from "./protocol-histories.model";
import ProtocolDecisionUserModel from "./protocol-decision-user.model";
import CourseProgressUsers from "./course-progress-users.model";

/**
 * Modell: ProtocolDecisions
 *
 * Diese Klasse speichert Entscheidungen, die im Rahmen eines Protokolls getroffen wurden.
 * Eine Entscheidung kann mehrere Vorschläge oder Optionen beinhalten, wobei eine finale Auswahl getroffen wird.
 *
 * Das Modell ist mit dem übergeordneten `ProtocolHistories` verknüpft und stellt
 * eine M:N-Beziehung zu den Benutzern her, die bei der Entscheidung mitgewirkt haben.
 *
 * Die Tabelle `protocol-decisions` speichert keine automatischen Zeitstempel (`timestamps: false`).
 */
@Table({ tableName: "protocol-decisions", timestamps: false })
export default class ProtocolDecisions extends Model {
	/**
	 * Eindeutige ID der Entscheidung.
	 * Wird automatisch inkrementiert (klassischer Primärschlüssel).
	 */
	@PrimaryKey
	@Column({ type: DataType.INTEGER, autoIncrement: true })
	id: number;

	/**
	 * Fremdschlüssel zur zugehörigen Protokoll-Historie.
	 * Verknüpft diese Entscheidung mit einem bestimmten zeitlichen Verlauf oder Szenario.
	 */
	@ForeignKey(() => ProtocolHistories)
	@Column({ type: DataType.UUIDV4, allowNull: false })
	protocolHistoryId: string;

	/**
	 * Beziehung zur übergeordneten Protokollhistorie.
	 */
	@BelongsTo(() => ProtocolHistories)
	protocolHistory: ProtocolHistories;

	/**
	 * Die getroffene Entscheidung bzw. gewählte Option (z. B. "Evakuieren", "Abwarten", "Feuer löschen").
	 */
	@Column({ type: DataType.STRING, allowNull: false })
	decision: string;

	/**
	 * Finale Entscheidung nach Auswertung oder Abstimmung.
	 * Wird gesetzt, wenn eine endgültige Wahl getroffen wurde.
	 */
	@Column({ type: DataType.STRING, allowNull: false })
	finalDecision: string;

	/**
	 * Benutzer, die für diese Entscheidung gestimmt oder sie beeinflusst haben.
	 * M:N Beziehung über `ProtocolDecisionUserModel`.
	 */
	@BelongsToMany(() => CourseProgressUsers, () => ProtocolDecisionUserModel)
	votedBy: CourseProgressUsers[];
}
