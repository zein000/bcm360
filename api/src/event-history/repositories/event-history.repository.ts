import { Injectable, InternalServerErrorException, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";

import { Errors } from "../../enums/errors.enum";
import EventHistory from "../models/event-history.model";

/**
 * Klasse: EventHistoryRepository
 *
 * Dieses Repository verwaltet die Datenbankoperationen für das `EventHistory`-Modell,
 * insbesondere das Erstellen von Ereignisprotokollen.
 *
 * Verwendet:
 * - Sequelize zur Interaktion mit der Datenbank
 */
@Injectable()
export class EventHistoryRepository {
	private readonly logger = new Logger(EventHistoryRepository.name);

	constructor(
		@InjectModel(EventHistory)
		private model: typeof EventHistory
	) {}

	/**
	 * Funktion: create
	 *
	 * Erstellt einen neuen Eintrag in der Ereignis-Historie.
	 *
	 * @param event - Das zu speichernde Ereignis (event name, userId, data)
	 * @returns Das gespeicherte Ereignis
	 */
	async create(event: Partial<EventHistory>): Promise<EventHistory> {
		try {
			return await this.model.create(event);
		} catch (error) {
			this.logger.error(error, "Failed to create event", event.id);
			throw new InternalServerErrorException(Errors.INTERNAL_ERROR);
		}
	}
}
