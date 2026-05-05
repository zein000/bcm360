import { Column, DataType, Model, PrimaryKey, Table } from "sequelize-typescript";

/**
 * Modell: Migration
 *
 * Dieses Modell repräsentiert die `_migrations`-Tabelle in der Datenbank,
 * die zur Verwaltung von Datenbankmigrationen verwendet wird. Jede Migration wird mit einem Namen identifiziert.
 *
 * Felder:
 * - `name`: Der Name der Migration, der in der Tabelle gespeichert wird (z.B. der Name des Migration-Skripts).
 */
@Table({ tableName: "_migrations", timestamps: false })
export default class Migration extends Model {
	/**
	 * Primärschlüssel der Tabelle, der den Namen der Migration repräsentiert.
	 * Dieser Name könnte z.B. der Name des Migration-Skripts sein.
	 */
	@PrimaryKey
	@Column({ type: DataType.STRING(255), allowNull: false })
	name: string;
}
