import {
	Injectable,
	InternalServerErrorException,
	Logger
} from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";

import CourseProgressUsers from "../models/course-progress-users.model";
import { Errors } from "src/enums/errors.enum";

/**
 * Repository: CourseProgressUsersRepository
 *
 * Diese Klasse kapselt alle Datenbankoperationen im Zusammenhang mit dem `CourseProgressUsers`-Modell.
 * Sie wird verwendet, um z. B. mehrere Teilnehmer eines Kursverlaufs gleichzeitig anzulegen.
 *
 * Vorteil: Trennung von Datenzugriff und Businesslogik, zentrales Fehler- und Log-Handling.
 */
@Injectable()
export class CourseProgressUsersRepository {
	/** Logger für systematische Fehlerprotokollierung */
	private readonly logger = new Logger(CourseProgressUsersRepository.name);

	constructor(
		@InjectModel(CourseProgressUsers)
		private model: typeof CourseProgressUsers
	) {}

	/**
	 * Legt mehrere Teilnehmer eines Szenarios/Kurses gleichzeitig an.
	 *
	 * @param preparedUsers – Liste vorbereiteter Benutzerdaten (z. B. aus JSON oder DTO)
	 * @returns – Die angelegten `CourseProgressUsers`-Einträge
	 */
	async bulkCreate(preparedUsers: any[]): Promise<CourseProgressUsers[]> {
		try {
			return this.model.bulkCreate(preparedUsers);
		} catch (error) {
			this.logger.error(error, "Failed to bulk create scenario progress users");
			throw new InternalServerErrorException(Errors.INTERNAL_ERROR);
		}
	}
}
