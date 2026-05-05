import {
	BelongsTo,
	Column,
	CreatedAt,
	DataType,
	ForeignKey,
	HasMany,
	HasOne,
	Model,
	PrimaryKey,
	Table,
	UpdatedAt
} from "sequelize-typescript";

import { ScenarioMessageTypes } from "../enum/ScenarioMessageTypes.enum";
import CourseProgress from "./course-progress.model";
import ProtocolDecisions from "./protocol-decisions.model";
import ProtocolMessages from "./protocol-messages.model";
import CourseProgressUsers from "./course-progress-users.model";

/**
 * Modell: ProtocolHistories
 *
 * Diese Klasse dokumentiert **Ereignisse, Nachrichten und Entscheidungen**,
 * die während eines Kursverlaufs (`CourseProgress`) stattfinden.
 *
 * Jeder Eintrag in dieser Tabelle stellt **einen Schritt innerhalb eines Szenarios** dar – z. B.:
 * - eine Nachricht an die Teilnehmer,
 * - eine Entscheidung, die getroffen wurde,
 * - eine Aktion eines bestimmten Teilnehmers.
 *
 * Über das Feld `type` (Enum) wird angegeben, um welchen Nachrichtentyp es sich handelt.
 */
@Table({ tableName: "protocol-histories" })
export default class ProtocolHistories extends Model {
	/**
	 * Primärschlüssel – eindeutige ID der Protokollzeile.
	 * Wird automatisch inkrementiert.
	 */
	@PrimaryKey
	@Column({ type: DataType.INTEGER, autoIncrement: true })
	id: string;

	/**
	 * Typ des Protokolleintrags – z. B. Entscheidung, Nachricht, Systemmeldung.
	 * Wird über ein Enum (`ScenarioMessageTypes`) definiert.
	 */
	@Column({
		type: DataType.ENUM(...Object.values(ScenarioMessageTypes)),
		allowNull: false,
	})
	type: ScenarioMessageTypes;

	/**
	 * Fremdschlüssel zur Verknüpfung mit einem bestimmten Kursfortschritt.
	 */
	@ForeignKey(() => CourseProgress)
	@Column({ type: DataType.UUIDV4, allowNull: false })
	courseProgressId: string;

	/**
	 * Beziehung zum Kursfortschritt – stellt den Szenariokontext dieses Eintrags her.
	 */
	@BelongsTo(() => CourseProgress)
	courseProgress: CourseProgress;

	/**
	 * Verknüpfung zu genau **einer Entscheidung**, die an diesem Punkt im Szenario getroffen wurde.
	 */
	@HasOne(() => ProtocolDecisions)
	protocolDecisions: ProtocolDecisions;

	/**
	 * Verknüpfung zu genau **einer Nachricht**, die im Rahmen dieses Protokolleintrags verschickt oder empfangen wurde.
	 */
	@HasOne(() => ProtocolMessages)
	protocolMessages: ProtocolMessages;

	/**
	 * Optional: Benutzer, der diesen Eintrag ausgelöst oder empfangen hat.
	 * z. B. bei individuellen Entscheidungen oder Systemmeldungen.
	 */
	@ForeignKey(() => CourseProgressUsers)
	@Column({ type: DataType.UUIDV4, allowNull: true })
	userId: string;

	/**
	 * Beziehung zum Benutzerobjekt.
	 */
	@BelongsTo(() => CourseProgressUsers)
	user: CourseProgressUsers;

	/**
	 * Zeitstempel, wann dieser Protokolleintrag im Szenario passiert ist (Unix-Zeit in Millisekunden).
	 */
	@Column({ type: DataType.BIGINT })
	timestamp: number;

	/**
	 * Automatischer Zeitstempel: Wann wurde dieser Datenbankeintrag erstellt?
	 */
	@CreatedAt
	@Column({ type: DataType.DATE })
	createdAt: Date;

	/**
	 * Automatischer Zeitstempel: Wann wurde dieser Eintrag zuletzt geändert?
	 */
	@UpdatedAt
	@Column({ type: DataType.DATE })
	updatedAt: Date;
}
