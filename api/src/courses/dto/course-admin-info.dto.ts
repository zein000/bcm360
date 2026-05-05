import { ApiProperty } from "@nestjs/swagger";
import { Exclude, Expose, Type } from "class-transformer";

import { UserInfoDTO } from "src/users/dto/user-info.dto";
import User from "../../users/models/user.model";
import Course from "../models/course.model";
import { CompanyInfoDTO } from "src/company/dto/company-info.dto";
import { CourseFileInfoDTO } from "./course-file-info.dto";
import { CourseProgressInfoDto } from "src/course-progress/dto/cource-progress-info.dto";
import { CourseTagInfoDTO } from "./course-tag-info.dto";

/**
 * Klasse: CourseAdminInfoDTO
 *
 * Diese Data Transfer Object (DTO)-Klasse dient der strukturierten Darstellung von Kursdaten
 * für Administrator*innen im Backend der Anwendung.
 *
 * Sie stellt ein serialisierbares Abbild eines `Course`-Modells dar, das zusätzlich
 * verwandte Informationen wie Firmen-, Datei-, Fortschritts- und Tag-Daten enthält.
 * Bestimmte interne Felder wie `createdAt` und `updatedAt` werden dabei ausgeblendet.
 *
 * Die Klasse verwendet `class-transformer` zur Kontrolle der Serialisierung und
 * `@nestjs/swagger` zur automatischen Dokumentation der API-Spezifikation.
 */
export class CourseAdminInfoDTO implements Partial<Omit<Course, "company" | "courseFiles" | "courseProgresses" | "tag">> {
	/**
	 * Eindeutige ID des Kurses
	 */
	@ApiProperty()
	id: number;

	/**
	 * Name bzw. Titel des Kurses
	 */
	@ApiProperty()
	name?: string;

	/**
	 * Beschreibung des Kurses
	 */
	@ApiProperty()
	description?: string;

	/**
	 * Zielgruppe bzw. "Für wen" ist der Kurs gedacht
	 */
	@ApiProperty()
	forWhom?: string;

	/**
	 * Optionales JSON-Feld für zusätzliche Metadaten oder Kursinhalt
	 */
	@ApiProperty()
	json?: JSON;

	/**
	 * Informationen über das Unternehmen, dem der Kurs zugeordnet ist
	 */
	@ApiProperty({ type: () => CompanyInfoDTO })
	@Expose()
	company?: CompanyInfoDTO;

	/**
	 * Eine Liste von Dateien, die mit dem Kurs verknüpft sind (z. B. PDFs, Videos)
	 */
	@ApiProperty({ type: () => CourseFileInfoDTO })
	@Expose()
	courseFiles?: CourseFileInfoDTO[];

	/**
	 * Der zum Kurs gehörende Tag bzw. die Kategorie
	 */
	@ApiProperty({ type: () => CourseTagInfoDTO })
	@Expose()
	tag?: CourseTagInfoDTO;

	/**
	 * Fortschrittsinformationen zu diesem Kurs für verschiedene Nutzer*innen
	 */
	@ApiProperty({ type: () => CourseProgressInfoDto })
	@Expose()
	courseProgresses?: CourseProgressInfoDto[];

	/**
	 * Zeitstempel, wann der Kurs zuletzt aktualisiert wurde (ausgeblendet aus der Ausgabe)
	 */
	@Exclude()
	@ApiProperty()
	updatedAt?: Date;

	/**
	 * Zeitstempel, wann der Kurs erstellt wurde (ausgeblendet aus der Ausgabe)
	 */
	@Exclude()
	@ApiProperty()
	createdAt?: Date;

	/**
	 * Konstruktor: Erstellt ein neues `CourseAdminInfoDTO`-Objekt
	 *
	 * Diese Funktion übernimmt ein `Course`-Objekt (ORM-Modell) und wandelt es
	 * in eine DTO-Instanz um. Falls `dataValues` vorhanden sind, wird das Objekt serialisiert.
	 *
	 * @param data - Das ursprüngliche `Course`-Modell
	 */
	constructor(data: Course) {
		Object.assign(this, data.dataValues ? data.toJSON() : data);
	}
}
