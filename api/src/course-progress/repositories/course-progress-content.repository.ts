import {
	Injectable,
	InternalServerErrorException,
	Logger
} from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";

import CourseProgressContent from "../models/course-progress-content.model";
import { Errors } from "src/enums/errors.enum";

/**
 * Repository: CourseProgressContentRepository
 *
 * Dieses Repository kapselt alle Datenbankzugriffe auf das Modell `CourseProgressContent`.
 * Es wird verwendet, um z. B. mehrere Inhalte gleichzeitig (per `bulkCreate`) in die Datenbank einzufügen.
 *
 * Vorteil: Fehlerbehandlung, Logging und Datenzugriffe sind an einem zentralen Ort gebündelt.
 */
@Injectable()
export class CourseProgressContentRepository {
	/** Logger für Fehlermeldungen und Systemdiagnosen */
	private readonly logger = new Logger(CourseProgressContentRepository.name);

	constructor(
		@InjectModel(CourseProgressContent)
		private model: typeof CourseProgressContent
	) {}

	/**
	 * Speichert mehrere `CourseProgressContent`-Einträge auf einmal.
	 *
	 * @param preparedContent – Liste von vorbereiteten Inhaltseinträgen (JSON-Objekte)
	 * @returns – Die erstellten Einträge als `CourseProgressContent[]`
	 */
	async bulkCreate(preparedContent: any[]): Promise<CourseProgressContent[]> {
		try {
			return this.model.bulkCreate(preparedContent);
		} catch (error) {
			this.logger.error(error, "Failed to bulk create scenario progress content");
			throw new InternalServerErrorException(Errors.INTERNAL_ERROR);
		}
	}
}
