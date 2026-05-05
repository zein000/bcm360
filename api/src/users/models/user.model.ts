/**
 * Modell: User
 *
 * Repräsentiert einen Benutzer im System.
 * Enthält persönliche Daten, Sicherheitsinformationen, Relationen zu Firma, Rollen, Tokens, Kursfortschritten.
 * Unterstützt Passwort-Hashing sowie Statusermittlung anhand vorhandener Daten.
 */

import { Logger } from "@nestjs/common";
import {
	BelongsTo,
	Column,
	CreatedAt,
	DataType,
	DeletedAt,
	ForeignKey,
	HasMany,
	Model,
	PrimaryKey,
	Table,
	UpdatedAt,
} from "sequelize-typescript";
import { Exclude } from "class-transformer";
import { BCRYPT_HASH_SALT_ROUNDS } from "src/constants";
import Role from "src/roles/models/role.model";
import Company from "src/company/models/company.model";
import { IncorrectInputDataException } from "src/exceptions/user.exceptions";
import { UserLanguage } from "src/enums/user.enum";
import { UserStatus } from "src/enums/user-status.enum";
import tokenConfig from "src/tokens/config/token.config";
import Token from "src/tokens/models/token.model";
import CourseProgress from "src/course-progress/models/course-progress.model";

const bcrypt = require("bcryptjs");

@Table({
	tableName: "user",
	paranoid: true, // Soft-Delete via deletedAt
	indexes: [
		{
			type: "FULLTEXT",
			fields: ["firstName", "lastName"], // für Volltextsuche
			unique: false,
			where: { deletedAt: null },
		},
		{
			fields: ["email", "deletedAt"],
			unique: true, // E-Mail muss eindeutig sein
			where: { deletedAt: null },
		},
	],
})
export default class User extends Model {
	private readonly logger = new Logger(User.name);

	/** Primärschlüssel: automatisch inkrementierende ID */
	@PrimaryKey
	@Column({ type: DataType.INTEGER, autoIncrement: true })
	id: number;

	/** Benutzer-E-Mail-Adresse (eindeutig, Pflichtfeld) */
	@Column({ type: DataType.STRING(255), unique: "column", allowNull: false })
	email: string;

	/**
	 * Gehashter Passwort-Hash.
	 * Wird bei Setzen automatisch gehasht via bcrypt.
	 * Wird aus Rückgaben ausgeschlossen via `Exclude()`.
	 */
	@Exclude()
	@Column({
		type: DataType.STRING(255),
		allowNull: true,
		set(val: string) {
			this.setDataValue("password", bcrypt.hashSync(val, BCRYPT_HASH_SALT_ROUNDS));
		},
	})
	password: string;

	/** Referenz zur Rolle */
	@ForeignKey(() => Role)
	@Column({ type: DataType.INTEGER, allowNull: true })
	roleId?: number;

	@BelongsTo(() => Role)
	role?: Role;

	@Column({ type: DataType.STRING(255), allowNull: true, defaultValue: null })
	firstName: string;

	@Column({ type: DataType.STRING(255), allowNull: true, defaultValue: null })
	lastName: string;

	/** Benutzerinterface-Sprache */
	@Column({
		type: DataType.ENUM({ values: Object.values(UserLanguage) }),
		allowNull: false,
		defaultValue: UserLanguage.EN,
	})
	userLanguage: UserLanguage;

	/** Secret für Zwei-Faktor-Authentifizierung */
	@Column({ type: DataType.STRING(255), allowNull: true })
	twoFactorAuthSecret: string;

	/** LinkedIn-Profil */
	@Column({ type: DataType.STRING(255), allowNull: true })
	linkedinUrl: string;

	@Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: false })
	is2FAEnabled: boolean;

	/** Gibt an, ob der Benutzer blockiert ist */
	@Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: false })
	isBlocked: boolean;

	/** Wird verwendet um z. B. Einladung automatisch zu akzeptieren */
	@Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: false })
	autoAccept: boolean;

	/** Firmenzugehörigkeit */
	@ForeignKey(() => Company)
	@Column({ type: DataType.INTEGER, allowNull: true })
	companyId?: number;

	@BelongsTo(() => Company)
	company?: Company;

	/** Referenz zu zugehörigen Tokens (z. B. Einladungen, Reset) */
	@HasMany(() => Token, { onDelete: "CASCADE" })
	tokens?: Token[];

	/** Referenz zu Kursfortschritten */
	@HasMany(() => CourseProgress)
	courseProgresses?: CourseProgress[];

	/** API-Key für Authentifizierung über API-Zugänge */
	@Column({ type: DataType.UUIDV4, allowNull: true, defaultValue: DataType.UUIDV4 })
	apiKey: string;

	/**
	 * Berechneter Status des Benutzers (nicht in DB gespeichert)
	 *
	 * - BLOCKED, wenn isBlocked = true
	 * - ACTIVE, wenn Passwort vorhanden
	 * - EXPIRED, wenn Token abgelaufen ist
	 * - INVITED, falls nur eingeladen
	 */
	@Column({
		type: DataType.VIRTUAL,
		get: function (this: User) {
			if (this.isBlocked) {
				return UserStatus.BLOCKED;
			} else if (this.password) {
				return UserStatus.ACTIVE;
			} else if (this.tokens?.length === 1 && this.isExpired(this.tokens[0].createdAt)) {
				return UserStatus.EXPIRED;
			}
			return UserStatus.INVITED;
		},
	})
	status: UserStatus;

	/** Wer hat diesen Benutzer gelöscht */
	@ForeignKey(() => User)
	@Column({ type: DataType.INTEGER, allowNull: true })
	deletedById?: number;

	@BelongsTo(() => User)
	deletedBy?: User;

	/** Zeitstempel */
	@UpdatedAt
	updatedAt: Date;

	@CreatedAt
	createdAt: Date;

	@DeletedAt
	deletedAt: Date;

	/**
	 * Funktion: checkPassword
	 *
	 * Vergleicht ein eingegebenes Passwort mit dem gespeicherten Hash.
	 *
	 * @param passwordToCheck - Das unverschlüsselte Passwort
	 * @returns boolean - true wenn korrekt
	 */
	async checkPassword(passwordToCheck: string): Promise<boolean> {
		if (!this.password) {
			throw new IncorrectInputDataException();
		}
		return await bcrypt.compare(passwordToCheck, this.password);
	}

	/**
	 * Funktion: isExpired
	 *
	 * Prüft, ob ein Invitation-Token abgelaufen ist
	 */
	private isExpired(createdAt: Date): boolean {
		return createdAt.getTime() <= this.getTokenCompareDate().getTime();
	}

	/** Berechnet das Ablaufdatum anhand der Konfiguration */
	private getTokenCompareDate = (): Date => {
		const compareDate: Date = new Date();
		return new Date(compareDate.getTime() - Number(tokenConfig().invitationTokenExpiration));
	};
}
