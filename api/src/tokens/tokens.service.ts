import { forwardRef, Inject, Injectable, Logger } from "@nestjs/common";
import { ConfigType } from "@nestjs/config";

import { BaseResponseDTO } from "../common/dto/base-response.dto";
import { getUserToken } from "../common/user.util";

import invitationConfig from "./config/token.config";

import User from "../users/models/user.model";
import { UsersService } from "../users/users.service";

import { ValidateTokenResponseDTO } from "./dto/validate-token-response.dto";
import { ETokenPurpose } from "./enums/token-purpose.enum";
import { ETokenStatus } from "./enums/token-status.enum";
import ChangeRequest from "./models/change-request.model";
import Token from "./models/token.model";
import { ChangeRequestRepository } from "./repositories/change-request.repository";
import { TokenRepository } from "./repositories/token.repository";

/**
 * Klasse: TokensService
 *
 * Dieser Service verwaltet die komplette Logik rund um Tokens, die für:
 * - Einladungen,
 * - Passwort-Reset,
 * - E-Mail-Änderungen
 * verwendet werden.
 *
 * Funktionen:
 * - Erzeugung und Speicherung von Tokens (ggf. mit Änderungsanfragen)
 * - Validierung und Statusprüfung
 * - Erneutes Versenden von Einladungen
 * - Markierung als benutzt
 * - Konfigurierbare Ablaufzeiten für unterschiedliche Token-Zwecke
 */
@Injectable()
export class TokensService {
	private readonly logger = new Logger(TokensService.name);

	constructor(
		private readonly tokenRepository: TokenRepository,
		private readonly changeRequestRepo: ChangeRequestRepository,
		@Inject(forwardRef(() => UsersService))
		private readonly usersService: UsersService,
		@Inject(invitationConfig.KEY)
		private config: ConfigType<typeof invitationConfig>
	) {}

	/**
	 * Validiert den Zustand eines Tokens und gibt ggf. die zugehörige E-Mail zurück.
	 */
	async validateToken(token: string): Promise<ValidateTokenResponseDTO> {
		const tokenRecord = await this.findToken(token);
		const status = await this.getTokenStatus(tokenRecord);

		let email: string | undefined;
		if (status === ETokenStatus.EXPIRED) {
			const user = await this.usersService.findOneById(tokenRecord.user.id);
			email = user.email;
		}

		return { status, email };
	}

	/**
	 * Sendet ein Einladungstoken erneut, wenn es abgelaufen ist.
	 */
	async resend(token: string): Promise<BaseResponseDTO<null>> {
		const tokenRecord = await this.findToken(token);
		const status = await this.getTokenStatus(tokenRecord);

		if (status !== ETokenStatus.EXPIRED) {
			this.logger.warn({ token, status }, "Token not expired to resend invitation");
			return { status: "ok" };
		}

		try {
			await this.usersService.sendEmailWithToken(tokenRecord.user, tokenRecord.purpose);
		} catch (error) {
			this.logger.error(
				error,
				"Failed to resend invitation token for %s to user %s",
				tokenRecord.purpose,
				tokenRecord.user.id
			);
		}

		return { status: "ok" };
	}

	/**
	 * Erstellt ein Token für einen Benutzer mit dem angegebenen Zweck.
	 */
	async createToken(userRecord: User, purpose: ETokenPurpose, token?: string): Promise<Token> {
		const tokenRecord = new Token({
			userId: userRecord.id,
			token: token || getUserToken(),
			purpose,
		});
		return this.tokenRepository.createToken(tokenRecord);
	}

	/**
	 * Erstellt ein Token und dazugehörige Änderungsanfrage (z. B. neue E-Mail).
	 */
	async createTokenWithChangeRequest(
		userRecord: User,
		purpose: ETokenPurpose,
		token: string,
		newEmail: string
	): Promise<Token> {
		const tokenRecord = new Token({
			userId: userRecord.id,
			token,
			purpose,
		});

		const tokenRes = await this.tokenRepository.createToken(tokenRecord);

		await this.changeRequestRepo.createChangeRequest({
			tokenId: tokenRes.id,
			changeFrom: { email: userRecord.email },
			changeTo: { email: newEmail },
		});

		return tokenRes;
	}

	// Token-Find-Wrapper

	findToken(token: string): Promise<Token> {
		return this.tokenRepository.findToken(token);
	}

	findTokenWithPurpose(token: string, purpose: ETokenPurpose): Promise<Token> {
		return this.tokenRepository.findTokenWithPurpose(token, purpose);
	}

	findTokenWithChangeRequest(token: string, purpose: ETokenPurpose): Promise<Token> {
		return this.tokenRepository.findTokenWithChangeRequest(token, purpose);
	}

	/**
	 * Ermittelt den aktuellen Status eines Tokens.
	 */
	async getTokenStatus(token: Token): Promise<ETokenStatus> {
		if (!token) return ETokenStatus.INVALID;
		if (this.isUsed(token)) return ETokenStatus.USED;
		if (this.isExpired(token)) return ETokenStatus.EXPIRED;
		if (await this.isOlderToken(token)) return ETokenStatus.INVALID;
		return ETokenStatus.OPEN;
	}

	/**
	 * Markiert ein Token als verwendet.
	 */
	async markAsUsed(token: Token) {
		return this.tokenRepository.updateById(token.id, { isUsed: true });
	}

	/**
	 * Markiert eine Änderungsanfrage als akzeptiert.
	 */
	async markChangeRequestAsAccepted(changeRequest: ChangeRequest) {
		return this.changeRequestRepo.markAsAccepted(changeRequest.id);
	}

	// Hilfsmethoden zur Statusprüfung

	private async isOlderToken(token: Token) {
		const newerTokens = await this.tokenRepository.findNewerTokens(token);
		return newerTokens.some((record) => this.isUsed(record) || !this.isExpired(record));
	}

	private isUsed(token: Token): boolean {
		return token.isUsed;
	}

	private isExpired(token: Token): boolean {
		return token.createdAt.getTime() <= this.getTokenCompareDate(token.purpose).getTime();
	}

	private getTokenCompareDate(purpose: ETokenPurpose): Date {
		const compareDate: Date = new Date();
		const expiration = this.getExpiration(purpose);
		return new Date(compareDate.getTime() - expiration);
	}

	private getExpiration(purpose: ETokenPurpose): number {
		switch (purpose) {
			case ETokenPurpose.INVITATION:
				return this.config.invitationTokenExpiration;
			case ETokenPurpose.FORGOTTEN_PASSWORD:
				return this.config.forgottenPasswordTokenExpiration;
			case ETokenPurpose.CHANGE_EMAIL:
				return this.config.changeEmailTokenExpiration;
		}
	}
}
