import {
	BelongsTo,
	BelongsToMany,
	Column,
	DataType,
	ForeignKey,
	HasMany,
	Model,
	PrimaryKey,
	Table,
} from "sequelize-typescript";

import CourseProgress from "./course-progress.model";
import ProtocolDecisionUserModel from "./protocol-decision-user.model";
import ProtocolDecisions from "./protocol-decisions.model";

/**
 * Modell: CourseProgressUsers
 *
 * Diese Klasse repräsentiert einen Benutzer, der an einem bestimmten `CourseProgress` (Kursfortschritt) teilnimmt.
 *
 * Das Modell ermöglicht:
 * - das Speichern von Teilnehmerdaten (Name, E-Mail, Zeitpunkte),
 * - die Zuweisung zu einem Kursfortschritt,
 * - die Auswertung von Benutzerentscheidungen in Simulationen (via ProtocolDecisions).
 *
 * Die Tabelle `course-progress-users` enthält keine Zeitstempel für Erstellung oder Änderung (`timestamps: false`).
 */
@Table({ tableName: "course-progress-users", timestamps: false })
export default class CourseProgressUsers extends Model {
	/**
	 * Eindeutige ID des Kursbenutzers (wird als UUID generiert).
	 */
	@PrimaryKey
	@Column({ type: DataType.UUIDV4 })
	id: string;

	/**
	 * Fremdschlüssel zur Verknüpfung mit einem bestimmten Kursfortschritt.
	 */
	@ForeignKey(() => CourseProgress)
	@Column({ type: DataType.UUIDV4, allowNull: false })
	courseProgressId: string;

	/**
	 * Beziehung zum übergeordneten Kursfortschritt.
	 */
	@BelongsTo(() => CourseProgress)
	courseProgress: CourseProgress;

	/**
	 * Vorname des Teilnehmers.
	 */
	@Column({ type: DataType.STRING, allowNull: false })
	firstName: string;

	/**
	 * Nachname des Teilnehmers.
	 */
	@Column({ type: DataType.STRING, allowNull: false })
	lastName: string;

	/**
	 * E-Mail-Adresse des Teilnehmers – dient meist der Identifikation oder Einladung.
	 */
	@Column({ type: DataType.STRING, allowNull: false })
	email: string;

	/**
	 * Zeitpunkt (Unix-Timestamp in ms), wann der Benutzer dem Szenario erstmals beigetreten ist.
	 */
	@Column({ type: DataType.BIGINT, allowNull: false })
	firstJoinTimeStamp?: number;

	/**
	 * Zeitpunkt, wann der Benutzer das Szenario verlassen hat.
	 */
	@Column({ type: DataType.BIGINT, allowNull: false })
	exitTimeStamp?: number;

	/**
	 * Zeitpunkt, wann der Benutzer eingeladen wurde.
	 */
	@Column({ type: DataType.BIGINT, allowNull: false })
	invitedTimeStamp?: number;

	/**
	 * Gibt an, ob der Benutzer die Einladung zum Szenario akzeptiert hat.
	 */
	@Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: false })
	isAccepted: boolean;

	/**
	 * Gibt an, ob der Benutzer eine Rolle als „Einsatzleiter“ oder eine Sonderrolle innehat (ERR = Einsatz-Rollen-Rechte?).
	 */
	@Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: false })
	isERR: boolean;

	/**
	 * Verknüpfung zu den Entscheidungen (z. B. Abstimmungen), für die dieser Benutzer gestimmt hat.
	 *
	 * M:N Beziehung über eine Zwischentabelle (`ProtocolDecisionUserModel`).
	 */
	@BelongsToMany(() => ProtocolDecisions, () => ProtocolDecisionUserModel)
	votedFor: ProtocolDecisions[];
}
