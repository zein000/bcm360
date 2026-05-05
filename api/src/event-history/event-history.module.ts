import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";

import { EventHistoryService } from "./event-history.service";
import EventHistory from "./models/event-history.model";
import { EventHistoryRepository } from "./repositories/event-history.repository";

/**
 * Modul: EventHistoryModule
 *
 * Dieses Modul verwaltet das Speichern und Abrufen von Ereignisprotokollen (Event History).
 * Es ermöglicht das Nachverfolgen von Systemereignissen und Benutzeraktionen.
 *
 * Komponenten:
 * - `EventHistoryService`: Geschäftslogik zur Speicherung von Ereignissen
 * - `EventHistoryRepository`: Zugriffsschicht auf die Ereignis-Historie in der Datenbank
 *
 * Exporte:
 * - `EventHistoryService`: Wird für die Interaktion mit den Ereignisprotokollen in anderen Modulen exportiert
 */
@Module({
	imports: [SequelizeModule.forFeature([EventHistory])],
	providers: [EventHistoryService, EventHistoryRepository],
	exports: [EventHistoryService],
})
export class EventHistoryModule {}
