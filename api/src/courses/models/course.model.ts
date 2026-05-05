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

import User from "../../users/models/user.model";
import Company from "src/company/models/company.model";
import CourseProgress from "src/course-progress/models/course-progress.model";
import CourseFile from "./course-file.model";
import CourseTag from "./course-tag.model";

/**
 * Klasse: Course
 *
 * Diese Klasse repräsentiert das Kursmodell innerhalb der Datenbank.
 * Sie wird von Sequelize verwendet, um die Struktur und Beziehungen der
 * "course"-Tabelle abzubilden.
 *
 * Jeder Kurs kann zu einer Firma gehören, Dateien beinhalten, einem Tag zugeordnet sein
 * und mehrere Fortschritte von Benutzer*innen enthalten. Es wird auch ein weiches Löschen
 * unterstützt durch die Option `paranoid: true`.
 */
@Table({ tableName: "course", paranoid: true })
export default class Course extends Model {
	/**
	 * Eindeutige ID des Kurses (Primärschlüssel, automatisch hochzählend)
	 */
	@PrimaryKey
	@Column({ type: DataType.INTEGER, autoIncrement: true })
	id: number;

	/**
	 * Der Name oder Titel des Kurses (optional)
	 */
	@Column({ type: DataType.STRING(255), allowNull: true })
	name?: string;

	/**
	 * Beschreibung des Kursinhalts (optional, als längerer Text)
	 */
	@Column({ type: DataType.TEXT, allowNull: true })
	description?: string;

	/**
	 * Für wen ist der Kurs gedacht? (optional, z. B. Zielgruppe)
	 */
	@Column({ type: DataType.TEXT, allowNull: true })
	forWhom?: string;

	/**
	 * JSON-Daten für zusätzliche Informationen oder Konfiguration (optional)
	 */
	@Column({ type: DataType.JSON, allowNull: true })
	json?: JSON;

	/**
	 * Fremdschlüssel zur zugehörigen Firma (optional)
	 */
	@ForeignKey(() => Company)
	@Column({ type: DataType.INTEGER, allowNull: true })
	companyId?: number;

	/**
	 * Beziehung zur Firma (1 Kurs gehört zu 1 Firma)
	 */
	@BelongsTo(() => Company)
	company?: Company;

	/**
	 * Fremdschlüssel zum zugehörigen Tag/Kategorie (optional)
	 */
	@ForeignKey(() => CourseTag)
	@Column({ type: DataType.INTEGER, allowNull: true })
	tagId?: number;

	/**
	 * Beziehung zum Kurs-Tag (1 Kurs hat 1 Tag)
	 */
	@BelongsTo(() => CourseTag)
	tag?: CourseTag;

	/**
	 * Fremdschlüssel auf den Nutzer, der den Kurs gelöscht hat (soft-delete)
	 */
	@ForeignKey(() => User)
	@Column({ type: DataType.INTEGER, allowNull: true })
	deletedById?: number;

	/**
	 * Beziehung zum User, der den Kurs gelöscht hat
	 */
	@BelongsTo(() => User)
	deletedBy?: User;

	/**
	 * Beziehung zu allen Dateien, die mit dem Kurs verbunden sind
	 * (1 Kurs kann viele Dateien haben)
	 */
	@HasMany(() => CourseFile)
	courseFiles: CourseFile[];

	/**
	 * Beziehung zu allen Fortschritten, die mit dem Kurs verknüpft sind
	 * (1 Kurs kann viele Fortschrittsdatensätze haben)
	 */
	@HasMany(() => CourseProgress)
	courseProgresses: CourseProgress[];

	/**
	 * Zeitstempel, wann der Kurs zuletzt aktualisiert wurde
	 */
	@UpdatedAt
	updatedAt: Date;

	/**
	 * Zeitstempel, wann der Kurs erstellt wurde
	 */
	@CreatedAt
	createdAt: Date;
}
