import {
	Injectable,
	InternalServerErrorException,
	Logger
} from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";

import ProtocolHistories from "../models/protocol-histories.model";
import { Errors } from "src/enums/errors.enum";

/**
 * Repository: ProtocolHistoryRepository
 *
 * Diese Klasse kapselt die Datenbankzugriffe auf das Modell `ProtocolHistories`,
 * das einzelne Einträge im Szenarioprotokoll beschreibt (z. B. Entscheidungen, Nachrichten, Zeitereignisse).
 *
 * Jeder Eintrag repräsentiert ein Ereignis in einem interaktiven Szenario, das später analysiert,
 * ausgewertet oder wiedergegeben werden kann.
 */
@Injectable()
export class ProtocolHistoryRepository {
	/** Logger zur Fehlerprotokollierung */
	private readonly logger = new Logger(ProtocolHistoryRepository.name);

	constructor(
		@InjectModel(ProtocolHistories)
		private model: typeof ProtocolHistories
	) {}

	/**
	 * Erstellt einen neuen Protokolleintrag (z. B. Nachricht, Entscheidung) in der Datenbank.
	 *
	 * @param protocolHistory – Das Ereignisobjekt, das gespeichert werden soll
	 * @returns – Der gespeicherte `ProtocolHistories`-Eintrag
	 */
	async create(protocolHistory: any): Promise<ProtocolHistories> {
		try {
			return this.model.create(protocolHistory);
		} catch (error) {
			this.logger.error(error, "Failed to create protocol history");
			throw new InternalServerErrorException(Errors.INTERNAL_ERROR);
		}
	}
}
