import { ApiProperty } from "@nestjs/swagger"; // Für Swagger-Dokumentation
import { Exclude, Expose } from "class-transformer"; // Für gezielte Serialisierung

import { CourseInfoDTO } from "src/courses/dto/course-info.dto";
import { CourseProgressEnum } from "../enum/Status";
import CourseProgress from "../models/course-progress.model";
import { CompanyInfoDTO } from "src/company/dto/company-info.dto";
import { UserInfoDTO } from "src/users/dto/user-info.dto";
import { CourseProgressUserInfoDto } from "./course-progress-user-info.dto";
import { ProtocolHistoryInfoDto } from "./protocol-history-info.dto";
import { CourseProgressContentInfoDto } from "./course-progress-content.dto";

/**
 * DTO: CourseProgressInfoDto
 *
 * Diese Klasse stellt eine strukturierte Repräsentation des Kursfortschritts dar,
 * wie sie z. B. in einer REST-API ausgegeben wird.
 *
 * Sie basiert auf dem `CourseProgress`-Model, blendet aber technische Details und Relationen gezielt aus oder um.
 */
export class CourseProgressInfoDto
	// Enthält nur bestimmte Eigenschaften des Originalmodells (ausschließlich der Beziehungen)
	implements Partial<Omit<CourseProgress, "course" | "user" | "protocolHistories" | "users" | "content">>
{
	/** Eindeutige ID des Kursfortschritts */
	@ApiProperty()
	id: string;

	/** Aktueller Status (z. B. NotStarted, InProgress, Finished) */
	@ApiProperty()
	status?: CourseProgressEnum;

	/** ID der letzten Phase des Szenarios */
	@ApiProperty()
	finalPhaseId?: number;

	/** Abschließende Nachricht, wenn das Szenario beendet wurde */
	@ApiProperty()
	scenarioEndMessage?: string;

	/** Informationen zum zugehörigen Kurs */
	@ApiProperty({ type: () => CourseInfoDTO })
	@Expose()
	course?: CourseInfoDTO;

	/** Informationen zum Hauptbenutzer, dem dieser Fortschritt gehört */
	@ApiProperty({ type: () => UserInfoDTO })
	@Expose()
	user?: UserInfoDTO;

	/** Informationen zu allen Teilnehmern (z. B. bei Gruppenarbeiten) */
	@ApiProperty({ type: () => CourseProgressUserInfoDto, isArray: true })
	@Expose()
	users?: CourseProgressUserInfoDto[];

	/** Historie aller Nachrichten & Entscheidungen während des Szenarios */
	@ApiProperty({ type: () => ProtocolHistoryInfoDto, isArray: true })
	@Expose()
	protocolHistories?: ProtocolHistoryInfoDto[];

	/** Inhaltliche Daten (z. B. bearbeitete Texte, Antworten) im Verlauf des Kurses */
	@ApiProperty({ type: () => CourseProgressContentInfoDto, isArray: true })
	@Expose()
	content?: CourseProgressContentInfoDto[];

	/** Technisches Feld – wird bei Serialisierung ausgeschlossen */
	@Exclude()
	@ApiProperty()
	updatedAt?: Date;

	/** Zeitstempel, wann dieser Fortschritt erstellt wurde */
	@ApiProperty()
	createdAt?: Date;

	/** Zeitpunkt, wann der Kurs abgeschlossen wurde */
	@ApiProperty()
	finishDate?: Date;

	/**
	 * Konstruktor übernimmt alle Daten aus dem Model (mit `toJSON`, falls Sequelize-Modell übergeben wird).
	 */
	constructor(data: CourseProgress) {
		Object.assign(this, data.dataValues ? data.toJSON() : data);
	}
}
