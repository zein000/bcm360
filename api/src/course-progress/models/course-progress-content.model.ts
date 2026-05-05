import {
    BelongsTo,
    Column,
    DataType,
    ForeignKey,
    Model,
    PrimaryKey,
    Table
} from "sequelize-typescript";

import { FileTypes } from "src/file/enum/FileTypes.enum";
import CourseProgress from "./course-progress.model";

/**
 * Modell: CourseProgressContent
 *
 * Diese Klasse beschreibt einen einzelnen Inhaltseintrag (Content) innerhalb eines Kursfortschritts.
 * Dabei kann es sich um eine Eingabe, Auswahl, Antwort oder ein anderes Dateiformat handeln,
 * das von einem Benutzer während des Kurses erstellt oder angesehen wurde.
 *
 * Es besteht eine direkte Beziehung zum übergeordneten `CourseProgress`.
 *
 * `timestamps: false` bedeutet, dass kein automatisches `createdAt` oder `updatedAt` gespeichert wird.
 */
@Table({ tableName: "course-progress-content", timestamps: false })
export default class CourseProgressContent extends Model {
    /**
     * Eindeutige ID dieses Inhalteintrags (vermutlich UUID).
     */
    @PrimaryKey
    @Column({ type: DataType.UUID, allowNull: false })
    id: string;

    /**
     * Fremdschlüssel zum zugehörigen Kursfortschritt.
     * Verknüpft diesen Inhaltseintrag mit einem bestimmten `CourseProgress`.
     */
    @ForeignKey(() => CourseProgress)
    @Column({ type: DataType.UUID, allowNull: false })
    courseProgressId: string;

    /**
     * Zugehöriger Kursfortschritt – ermöglicht Zugriff auf Metadaten des Fortschritts.
     */
    @BelongsTo(() => CourseProgress)
    courseProgress: CourseProgress;

    /**
     * Inhalt selbst – kann z. B. ein Freitext, Antwort, JSON oder andere Daten sein.
     */
    @Column({ type: DataType.TEXT, allowNull: false })
    content: string;

    /**
     * Typ des Inhalts – definiert über ein Enum `FileTypes` (z. B. Text, Bild, Video).
     * Standard ist `Unknown`, wenn keine Zuordnung möglich ist.
     */
    @Column({
        type: DataType.ENUM(...Object.values(FileTypes)),
        allowNull: false,
        defaultValue: FileTypes.Unknown,
    })
    contentType: FileTypes;

    /**
     * Zeitstempel (in Millisekunden seit Unix-Zeit) – gibt an, wann der Inhalt erzeugt oder gespeichert wurde.
     */
    @Column({ type: DataType.BIGINT, allowNull: false })
    timeStamp: number;

    /**
     * Titel oder kurze Beschreibung des Inhalts – dient oft zur Anzeige in der UI.
     */
    @Column({ type: DataType.STRING, allowNull: false })
    title: string;

    /**
     * Gibt an, zu welcher Phase oder welchem Abschnitt (Stage) im Kurs dieser Inhalt gehört.
     * Wird als einfache Nummer gespeichert (z. B. 1 = Einstieg, 2 = Simulation, 3 = Auswertung).
     */
    @Column({ type: DataType.INTEGER, allowNull: false })
    stageNumber: number;
}
