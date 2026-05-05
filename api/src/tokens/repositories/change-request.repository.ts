import { Injectable, InternalServerErrorException, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";

import { Errors } from "../../enums/errors.enum";
import ChangeRequest from "../models/change-request.model";

/**
 * Klasse: ChangeRequestRepository
 *
 * Dieses Repository kapselt alle Datenbankoperationen für das Modell `ChangeRequest`.
 * ChangeRequests werden verwendet, um Änderungswünsche zu Benutzerattributen wie z. B. E-Mail zu speichern.
 *
 * Verwendungszweck:
 * - Wird vom `TokensService` genutzt, um ChangeRequests im Zusammenhang mit Tokens zu erstellen oder zu aktualisieren
 * - Fehler werden sauber geloggt und geworfen
 */
@Injectable()
export class ChangeRequestRepository {
	private readonly logger = new Logger(ChangeRequestRepository.name);

	constructor(
		@InjectModel(ChangeRequest)
		private model: typeof ChangeRequest
	) {}

	/**
	 * Erstellt einen neuen ChangeRequest-Eintrag in der Datenbank.
	 *
	 * @param data - Teilobjekt eines ChangeRequests
	 * @returns Der erstellte ChangeRequest
	 */
	async createChangeRequest(data: Partial<ChangeRequest>): Promise<ChangeRequest> {
		try {
			return await this.model.create(data);
		} catch (error) {
			this.logger.error(error, "Failed to create change request");
			throw new InternalServerErrorException(Errors.INTERNAL_ERROR);
		}
	}

	/**
	 * Markiert eine Änderungsanfrage als akzeptiert.
	 *
	 * @param id - ID der Änderungsanfrage
	 * @returns Anzahl der betroffenen Datensätze
	 */
	async markAsAccepted(id: number): Promise<[affectedCount: number]> {
		try {
			return await this.model.update({ isAccepted: true }, { where: { id } });
		} catch (error) {
			this.logger.error(error, "Failed to mark change request as accepted");
			throw new InternalServerErrorException(Errors.INTERNAL_ERROR);
		}
	}
}
