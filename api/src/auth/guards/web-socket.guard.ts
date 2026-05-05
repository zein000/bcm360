import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

import { ScenarioProgressCachingService } from "src/caching/services/scenario-progress-caching.service";
import { UserInfoCachingService } from "src/caching/services/user-info-caching.service";
import { IScenarioUser } from "src/course-progress/interfaces/ScenarioUser.interface";
import { getUnique } from "src/course-progress/utils/getUnique";
import { participantPermissionCodes } from "src/roles/constants/base-roles";

/**
 * Klasse: WebSocketGuard
 *
 * Dieser Guard schützt WebSocket-Verbindungen, indem er das mitgesendete JWT validiert.
 * Er unterstützt zwei Anwendungsfälle:
 * 1. Authentifizierung von normalen Benutzern über das JWT (Access Token)
 * 2. Spezielle Authentifizierung für Szenario-Teilnehmende anhand eines Tokens mit `courseProgressId`
 *
 * Funktion:
 * - Token wird aus `client.handshake.query.token` gelesen
 * - Falls `courseProgressId` und `id` enthalten sind, wird Teilnehmerrolle geprüft
 * - Andernfalls erfolgt Validierung über User-Service
 */
@Injectable()
export class WebSocketGuard implements CanActivate {
	constructor(
		private readonly jwtService: JwtService,
		private readonly userInfoCachingService: UserInfoCachingService,
		private readonly scenarioProgressCachingService: ScenarioProgressCachingService
	) {}

	/**
	 * Hauptmethode zur Prüfung, ob ein WS-Client authentifiziert ist.
	 */
	async canActivate(context: ExecutionContext): Promise<boolean> {
		const client = context.switchToWs().getClient();
		const token = client.handshake.query.token;

		if (!token) {
			return false;
		}

		try {
			const isAllowed = await this.checkIfParticipant(token, client);
			if (isAllowed) return true;

			const decoded = this.jwtService.verify(token);
			const user = await this.userInfoCachingService.getUser(decoded?.id);
			if (!user?.dataValues && !user?.id) return false;

			// Setzt Benutzerobjekt am Client
			client["user"] = user?.dataValues ? user.dataValues : user;
			return true;
		} catch (error) {
			return false;
		}
	}

	/**
	 * Prüft, ob es sich um ein gültiges Szenario-Teilnehmer-Token handelt
	 * (inkl. Teilnahmeberechtigung und aktiver Status).
	 *
	 * @param token - JWT aus WS-Anfrage
	 * @param request - WebSocket-Client
	 * @returns true, wenn gültiger Teilnehmer erkannt wird
	 */
	async checkIfParticipant(token: string, request: any): Promise<boolean> {
		const payload = await this.jwtService.verifyAsync(token);
		if (payload?.courseProgressId && payload?.id) {
			const scenarioProgress = await this.scenarioProgressCachingService.getScenarioProgress(
				payload.courseProgressId,
				true
			);

			const participant = scenarioProgress.users.find(
				(user) => user.id === payload.id && !user.isRemoved
			);

			if (participant) {
				request["user"] = {
					id: payload.id,
					firstName: participant.firstName ?? "",
					lastName: participant.lastName ?? "",
					email: participant.email ?? "",
					role: {
						permissions: getUnique(
							participantPermissionCodes,
							participant?.permissions ?? []
						).map((code) => ({ code })),
					},
					isAccepted: participant.isAccepted,
					isActive: participant.isActive,
					isRemoved: participant.isRemoved,
				} as IScenarioUser;

				return true;
			}
		}
		return false;
	}
}
