import {
	Injectable,
	InternalServerErrorException,
	Logger
} from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";

import ProtocolMessages from "../models/protocol-messages.model";
import { Errors } from "src/enums/errors.enum";

/**
 * Repository: ProtocolMessagesRepository
 *
 * Diese Klasse verwaltet alle Datenbankzugriffe auf `ProtocolMessages` – also Nachrichten,
 * die innerhalb eines Kurs-/Szenarioverlaufs gesendet wurden.
 *
 * Jede Nachricht ist typisiert (z. B. als Instruktion, Systeminfo, Rückmeldung) und einem
 * Protokolleintrag (`ProtocolHistories`) zugeordnet.
 */
@Injectable()
export class ProtocolMessagesRepository {
	/** Logger für Fehlermeldungen & Debugging */
	private readonly logger = new Logger(ProtocolMessagesRepository.name);

	constructor(
		@InjectModel(ProtocolMessages)
		private model: typeof ProtocolMessages
	) {}

	/**
	 * Erstellt eine neue Nachricht im Szenario-Protokoll.
	 *
	 * @param protocolMessage – Die Nachricht, die gespeichert werden soll (Inhalt, Optionen, Referenz zur Historie)
	 * @returns – Die gespeicherte Nachricht als `ProtocolMessages`-Eintrag
	 */
	async create(protocolMessage: any): Promise<ProtocolMessages> {
		try {
			return this.model.create(protocolMessage);
		} catch (error) {
			this.logger.error(error, "Failed to create protocol message");
			throw new InternalServerErrorException(Errors.INTERNAL_ERROR);
		}
	}
}
