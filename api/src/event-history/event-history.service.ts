import { Injectable, Logger } from "@nestjs/common";

import { EventName } from "../enums/event-name.enum";
import { EventHistoryRepository } from "./repositories/event-history.repository";

/**
 * Klasse: EventHistoryService
 *
 * Dieser Service verwaltet das Speichern von Ereignisprotokollen in der Datenbank.
 * Ereignisse können z. B. Benutzeraktionen, Systemereignisse oder spezifische Geschäftsprozesse sein.
 *
 * Funktionen:
 * - Speichern von Ereignissen in der Datenbank
 * - Unterstützung für optionale Benutzer-IDs und zusätzliche Metadaten (Daten)
 */
@Injectable()
export class EventHistoryService {
	private readonly logger = new Logger(EventHistoryService.name);

	constructor(private readonly eventHistoryRepo: EventHistoryRepository) {}

	/**
	 * Funktion: saveHistory
	 *
	 * Speichert ein neues Ereignis in der Ereignis-Historie.
	 *
	 * @param name - Name des Ereignisses (z.B. EventName.USER_LOGIN)
	 * @param userId - ID des Benutzers, der das Ereignis ausgelöst hat (optional)
	 * @param data - Zusätzliche Daten, die mit dem Ereignis gespeichert werden sollen (optional)
	 */
	async saveHistory(name: EventName, userId?: number, data?: Record<string, unknown>) {
		try {
			await this.eventHistoryRepo.create({
				name,
				userId,
				data,
			});
		} catch (error) {
			this.logger.error(error, "Failed to save event history with name %s", name);
		}
	}
}
