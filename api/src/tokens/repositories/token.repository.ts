import { Injectable, InternalServerErrorException, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Op } from "sequelize";

import { Errors } from "../../enums/errors.enum";
import User from "../../users/models/user.model";
import { ETokenPurpose } from "../enums/token-purpose.enum";
import ChangeRequest from "../models/change-request.model";
import Token from "../models/token.model";

/**
 * Klasse: TokenRepository
 *
 * Dieses Repository stellt alle Datenbankoperationen rund um das `Token`-Modell bereit.
 * Es wird genutzt für Einladungen, Passwort-Zurücksetzen oder E-Mail-Änderungen.
 *
 * Unterstützte Features:
 * - Token-Erstellung, Suche (mit oder ohne Zweck), Aktualisierung
 * - Abfrage von neueren Tokens eines Benutzers
 * - Laden verknüpfter Entitäten wie `User` und `ChangeRequest`
 */
@Injectable()
export class TokenRepository {
	private readonly logger = new Logger(TokenRepository.name);

	constructor(
		@InjectModel(Token)
		private model: typeof Token
	) {}

	/**
	 * Findet ein Token anhand der ID.
	 */
	async findById(id: number): Promise<Token> {
		return this.model.findOne({
			where: { id },
		});
	}

	/**
	 * Speichert ein neues Token-Objekt in der Datenbank.
	 */
	async createToken(token: Token): Promise<Token> {
		try {
			return await token.save();
		} catch (error) {
			this.logger.error(error, "Failed to create token");
			throw new InternalServerErrorException(Errors.INTERNAL_ERROR);
		}
	}

	/**
	 * Findet ein Token anhand des Token-Wertes (inkl. zugehörigem Benutzer).
	 */
	async findToken(token: string): Promise<Token> {
		try {
			return await this.model.findOne({ where: { token }, include: User });
		} catch (error) {
			this.logger.error(error, "Failed to find token %s", token);
			throw new InternalServerErrorException(Errors.INTERNAL_ERROR);
		}
	}

	/**
	 * Findet ein Token mit passendem Zweck (z. B. Einladung, Passwort zurücksetzen).
	 */
	async findTokenWithPurpose(token: string, purpose: ETokenPurpose): Promise<Token> {
		try {
			return await this.model.findOne({ where: { token, purpose }, include: User });
		} catch (error) {
			this.logger.error(error, "Failed to find token %s", token);
			throw new InternalServerErrorException(Errors.INTERNAL_ERROR);
		}
	}

	/**
	 * Findet ein Token inkl. verknüpfter ChangeRequest.
	 */
	async findTokenWithChangeRequest(token: string, purpose: ETokenPurpose): Promise<Token> {
		try {
			return await this.model.findOne({
				where: { token, purpose },
				include: [User, ChangeRequest],
			});
		} catch (error) {
			this.logger.error(error, "Failed to find token %s with change request", token);
			throw new InternalServerErrorException(Errors.INTERNAL_ERROR);
		}
	}

	/**
	 * Findet alle Tokens eines Benutzers mit gleichem Zweck, die später erstellt wurden.
	 */
	async findNewerTokens({ token, user, createdAt, purpose }: Token): Promise<Token[]> {
		try {
			return await this.model.findAll({
				where: {
					purpose,
					token: { [Op.not]: token },
					createdAt: { [Op.gt]: createdAt },
				},
				include: {
					model: User,
					required: true,
					where: { id: user.id },
				},
			});
		} catch (error) {
			this.logger.error(error, "DB Error: Failed to find token %s", token);
			throw new InternalServerErrorException(Errors.INTERNAL_ERROR);
		}
	}

	/**
	 * Aktualisiert ein Token anhand seiner ID.
	 *
	 * @param id - Token-ID
	 * @param data - Felder, die aktualisiert werden sollen
	 * @returns Anzahl der betroffenen Datensätze
	 */
	async updateById(id: number, data: Partial<Token>): Promise<[affectedCount: number]> {
		try {
			return await this.model.update(data, { where: { id } });
		} catch (error) {
			this.logger.error(error, "DB Error: Failed to update by id %s", id);
			throw new InternalServerErrorException(Errors.INTERNAL_ERROR);
		}
	}
}
