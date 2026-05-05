import { Column, DataType, Model, PrimaryKey, Table } from "sequelize-typescript";

/**
 * Modell: Seed
 *
 * Dieses Modell repräsentiert die `_seeders`-Tabelle in der Datenbank,
 * die zur Verwaltung von Seed-Daten (z.B. Migrationen oder initiale Daten) verwendet wird.
 *
 * Felder:
 * - `name`: Der Name des Seeds, der in der Tabelle gespeichert wird (z.B. der Name des Seed-Skripts).
 */
@Table({ tableName: "_seeders", timestamps: false })
export default class Seed extends Model {
	/**
	 * Primärschlüssel der Tabelle, der den Seed-Namen repräsentiert.
	 * Dieser Name könnte z.B. die ID des Seed-Skripts oder den Dateinamen des Seeds enthalten.
	 */
	@PrimaryKey
	@Column({ type: DataType.STRING(255), allowNull: false })
	name: string;
}
