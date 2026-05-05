import {
	CanActivate,
	ExecutionContext,
	Inject,
	Injectable,
	UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

import { UserInfoCachingService } from "src/caching/services/user-info-caching.service";
import { ScenarioProgressCachingService } from "src/caching/services/scenario-progress-caching.service";

import { JwtTwoFactorGuard } from "./jwt-two-factor.guard";

import { participantPermissionCodes } from "src/roles/constants/base-roles";
import { IScenarioUser } from "src/course-progress/interfaces/ScenarioUser.interface";
import { ERole } from "src/enums/role.enum";
import { getUnique } from "src/course-progress/utils/getUnique";

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Klasse: JwtAndApiKeyGuard
 *
 * Dieser Guard vereint die Authentifizierung via:
 * 1. JWT (inkl. 2FA und Szenario-Teilnehmer)
 * 2. API-Key
 *
 * Verwendung:
 * - Standard-Guard für HTTP-Routen, die sowohl interne als auch externe Zugriffe zulassen
 * - Erkennt JWT im `Authorization` Header oder API-Key im `api-key` Header
 *
 * Zusatzlogik:
 * - Teilnehmer werden separat aus dem ScenarioCache verifiziert
 * - JWT wird ggf. zusätzlich über `JwtTwoFactorGuard` geprüft
 */
@Injectable()
export class JwtAndApiKeyGuard implements CanActivate {
	constructor(
		@Inject(UserInfoCachingService) private readonly userInfoCachingService: UserInfoCachingService,
		@Inject(ScenarioProgressCachingService)
		private readonly scenarioProgressCachingService: ScenarioProgressCachingService,
		@Inject(JwtService) private readonly jwtService: JwtService
	) {}

	/**
	 * Hauptmethode zur Prüfung der Authentifizierung.
	 * Erkennt sowohl Bearer-JWTs als auch API-Keys.
	 */
	async canActivate(context: ExecutionContext): Promise<boolean> {
		const request = context.switchToHttp().getRequest();
		const authHeader = request.headers["authorization"];

		// JWT-Prüfung
		if (authHeader && authHeader.startsWith("Bearer ")) {
			const jwtGuard = new JwtTwoFactorGuard();
			const isAllowed = await this.checkIfParticipant(authHeader, request);

			if (isAllowed) return true;

			const jwtCanActivate = await jwtGuard.canActivate(context);
			if (jwtCanActivate) return true;

			throw new UnauthorizedException("Invalid or expired JWT.");
		}

		// API-Key-Prüfung
		const apiKey = request.headers["api-key"];
		if (!apiKey || !UUID_REGEX.test(apiKey)) {
			throw new UnauthorizedException("API key is missing or invalid.");
		}

		const user = await this.userInfoCachingService.getUserByApiKey(apiKey);
		if (!user?.dataValues && !user?.id) {
			throw new UnauthorizedException("Invalid API key.");
		}

		request.user = user?.dataValues ? user.dataValues : user;
		return true;
	}

	/**
	 * Prüft, ob es sich beim JWT um ein gültiges Teilnehmer-Token eines Kurses handelt.
	 * Falls ja, wird das Benutzerobjekt an `request.user` gebunden.
	 */
	async checkIfParticipant(authHeader: string, request: any): Promise<boolean> {
		const token = authHeader?.split(" ")[1];
		if (!token) return false;

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
				request.user = {
					id: payload.id,
					firstName: participant.firstName ?? "",
					lastName: participant.lastName ?? "",
					email: participant.email ?? "",
					role: {
						code: ERole.PARTICIPANT,
						permissions: getUnique(
							participantPermissionCodes,
							participant?.permissions ?? []
						).map((code) => ({ code })),
					},
					isAccepted: !!participant.isAccepted,
					isActive: !!participant.isActive,
					courseProgressId: payload.courseProgressId,
					isRemoved: !!participant.isRemoved,
					token,
				} as IScenarioUser;
				return true;
			}
		}

		return false;
	}
}
