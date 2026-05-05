import {
	Column,
	Model,
	Table,
	DataType,
	BelongsToMany,
	CreatedAt,
	UpdatedAt,
	PrimaryKey,
} from "sequelize-typescript";

import Role from "src/roles/models/role.model";
import RolePermission from "../../roles/models/role-permission.model";

/**
 * Klasse: Permission (Sequelize Model)
 *
 * Dieses Modell repräsentiert eine Berechtigung (Permission) in der Datenbank.
 * Berechtigungen steuern den Zugriff auf bestimmte Funktionen innerhalb der Anwendung.
 *
 * Verwendungszweck:
 * - Teil des rollenbasierten Berechtigungssystems (RBAC)
 * - Kann vielen Rollen zugeordnet sein (n:m Beziehung über RolePermission)
 *
 * Spalten:
 * - id: Eindeutige Identifikationsnummer der Berechtigung (Primary Key, Auto-Inkrement)
 * - name: Klartextname der Berechtigung (z. B. "Update role")
 * - code: Eindeutiger technischer Code der Berechtigung (z. B. "UPDATE_ROLE")
 * - description: Optionaler Beschreibungstext zur Berechtigung
 * - roles: Zugehörige Rollen (n:m über `RolePermission`)
 * - createdAt / updatedAt: Automatisch verwaltete Timestamps
 */
@Table({ tableName: "permission" })
export default class Permission extends Model {
	@PrimaryKey
	@Column({ type: DataType.INTEGER, autoIncrement: true })
	id: number;

	@Column({ type: DataType.STRING(255), allowNull: false })
	name: string;

	@Column({ type: DataType.STRING(255), unique: "column", allowNull: false })
	code: string;

	@Column({ type: DataType.STRING, allowNull: true })
	description: string;

	@BelongsToMany(() => Role, () => RolePermission)
	roles?: Role[];

	@UpdatedAt
	updatedAt: Date;

	@CreatedAt
	createdAt: Date;
}
