import {
	Table,
	PrimaryKey,
	Column,
	DataType,
	ForeignKey,
	BelongsTo,
	Model
} from "sequelize-typescript";

import ProtocolHistories from "./protocol-histories.model";

/**
 * Modell: ProtocolMessages
 *
 * Diese Klasse speichert Nachrichten, die im Rahmen eines Szenarios an Teilnehmer gesendet werden.
 * Sie ist mit einem Eintrag in `ProtocolHistories` verknüpft und kann optional Auswahlmöglichkeiten (z. B. in Form eines Multiple-Choice-Menüs) enthalten.
 *
 * Die Tabelle `protocol-messages` enthält keine automatischen Zeitstempel (`timestamps: false`).
 */
@Table({ tableName: "protocol-messages", timestamps: false })
export default class ProtocolMessages extends Model {
	/**
	 * Eindeutige ID der Nachricht (klassischer auto-increment Key).
	 */
	@PrimaryKey
	@Column({ type: DataType.INTEGER, autoIncrement: true })
	id: string;

	/**
	 * Fremdschlüssel zur zugehörigen Protokoll-Historie.
	 * Verknüpft diese Nachricht mit einem bestimmten Szenario-Ereignis.
	 */
	@ForeignKey(() => ProtocolHistories)
	@Column({ type: DataType.INTEGER, allowNull: false })
	protocolHistoryId: string;

	/**
	 * Beziehung zur Protokoll-Historie, aus der diese Nachricht stammt.
	 */
	@BelongsTo(() => ProtocolHistories)
	protocolHistory: ProtocolHistories;

	/**
	 * Der eigentliche Nachrichtentext – kann z. B. Anweisungen, Infos oder Rückmeldungen enthalten.
	 */
	@Column({ type: DataType.STRING, allowNull: false })
	message: string;

	/**
	 * Optional: Liste von auswählbaren Optionen, z. B. für eine Entscheidung oder Umfrage.
	 * Wird als Text gespeichert – kann z. B. JSON-kodierte Liste sein.
	 */
	@Column({ type: DataType.TEXT, allowNull: true })
	options: string;
}
