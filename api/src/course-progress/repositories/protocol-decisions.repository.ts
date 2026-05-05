import {
	Injectable,
	InternalServerErrorException,
	Logger
} from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";

import ProtocolDecisions from "../models/protocol-decisions.model";
import { Errors } from "src/enums/errors.enum";

/**
 * Repository: ProtocolDecisionRepository
 *
 * Diese Klasse stellt Methoden zur Verfügung, um Entscheidungen (`ProtocolDecisions`)
 * in der Datenbank zu speichern. Sie unterstützt das Erstellen von Entscheidungen
 * inklusive der Zuweisung der abstimmenden Benutzer (`votedBy`).
 *
 * Ziel ist es, zentrale Datenbankzugriffe zu kapseln und Fehler zentral zu behandeln.
 */
@Injectable()
export class ProtocolDecisionRepository {
	/** Logger-Instanz für Fehlerprotokolle */
	private readonly logger = new Logger(ProtocolDecisionRepository.name);

	constructor(
		@InjectModel(ProtocolDecisions)
		private model: typeof ProtocolDecisions
	) {}

	/**
	 * Erstellt eine neue Entscheidungsinstanz in der Datenbank.
	 *
	 * @param protocolDecision – Das Hauptobjekt mit Entscheidungstext und Metadaten
	 * @param votedBy – Liste von Benutzer-IDs (UUIDs), die an der Entscheidung beteiligt waren
	 * @returns – Die erstellte `ProtocolDecisions`-Instanz mit gesetzter Beziehung zu `votedBy`
	 */
	async create(protocolDecision: any, votedBy: string[]): Promise<ProtocolDecisions> {
		try {
			// Schritt 1: Entscheidung erstellen
			const model = await this.model.create(protocolDecision);

			// Schritt 2: Verknüpfung der abstimmenden Nutzer (M:N-Beziehung)
			await model.$set("votedBy", votedBy);

			return model;
		} catch (error) {
			this.logger.error(error, "Failed to create protocol decision");
			throw new InternalServerErrorException(Errors.INTERNAL_ERROR);
		}
	}
}
