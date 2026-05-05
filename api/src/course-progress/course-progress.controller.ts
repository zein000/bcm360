import {
	Body,
	Controller,
	Delete,
	Get,
	Logger,
	Param,
	Post,
	Query,
	Request,
	Res,
} from "@nestjs/common";
import {
	ApiBadRequestResponse,
	ApiOkResponse,
	ApiOperation,
	ApiTags
} from "@nestjs/swagger";
import { Response } from "express";

import { ErrorResponseDTO } from "src/auth/dto/error-response.dto";
import { UseJWTWithApiKeyAuthorization } from "src/common/decorators/jwt-api-decorators.decorator";
import { PageDTO, PageOptionsDTO } from "src/common/dto";
import RequestWithUser from "src/interfaces/request-with-user.interface";
import { PermissionCodes } from "src/permissions/enum/codes";
import { UserInfoDTO } from "src/users/dto/user-info.dto";

import { CourseProgressService } from "./course-progress.service";
import { CourseProgressInfoDto } from "./dto/cource-progress-info.dto";
import { CreateCourseProgressDTO } from "./dto/create-course-progress.dto";
import { ExportScenarioReportDto } from "./dto/export-report.dto";
import { InviteUserOnScenarioDTO } from "./dto/invite-user-on-scenario.dto";
import { IScenarioUser } from "./interfaces/ScenarioUser.interface";

/**
 * Controller: CourseProgressController
 *
 * Dieser Controller verwaltet den gesamten HTTP-Zugriff auf Szenario-Fortschritte (CourseProgress).
 * Er deckt Anwendungsfälle wie Start, Einladung, Teilnahme, Löschung und Reporting ab.
 */
@ApiTags("Scenario Progress")
@Controller("course-progress")
export class CourseProgressController {
	private readonly logger = new Logger(CourseProgressController.name);

	constructor(private readonly courseProgressService: CourseProgressService) {}

	/**
	 * Startet ein neues Szenario (z. B. Training oder Übung).
	 */
	@Post("/start")
	@UseJWTWithApiKeyAuthorization({ permissions: [PermissionCodes.COURSES] })
	@ApiOperation({ summary: "Starts the scenario", description: "Starts the scenario" })
	initializeScenario(@Body() data: CreateCourseProgressDTO, @Request() { user }: RequestWithUser) {
		return this.courseProgressService.initializeTrainingCourse(data, user);
	}

	/**
	 * Prüft, ob derzeit ein Szenario für den Nutzer läuft.
	 */
	@Get("check-scenario-in-progress")
	@UseJWTWithApiKeyAuthorization({ permissions: [PermissionCodes.USER] })
	@ApiOperation({ summary: "Check if any scenario is in progress", description: `**PERMISSIONS: ${PermissionCodes.PARTICIPANT}**` })
	@ApiOkResponse({ type: CourseProgressInfoDto })
	@ApiBadRequestResponse({ type: ErrorResponseDTO })
	async checkScenariosInProgress(@Request() { user }: RequestWithUser): Promise<CourseProgressInfoDto | null> {
		return this.courseProgressService.checkIfAnyScenariosInProgress(user);
	}

	/**
	 * Holt einen spezifischen Szenario-Fortschritt anhand seiner ID.
	 */
	@Get(":id")
	@UseJWTWithApiKeyAuthorization({ permissions: [PermissionCodes.PARTICIPANT] })
	@ApiOperation({ summary: "Get courses", description: `**PERMISSIONS: ${PermissionCodes.PARTICIPANT}**` })
	@ApiOkResponse({ type: CourseProgressInfoDto })
	@ApiBadRequestResponse({ type: ErrorResponseDTO })
	async findOne(@Param("id") id: string): Promise<CourseProgressInfoDto> {
		return this.courseProgressService.findOne(id);
	}

	/**
	 * Gibt eine paginierte Liste aller Kursfortschritte eines Nutzers zurück.
	 */
	@Get()
	@UseJWTWithApiKeyAuthorization({ permissions: [PermissionCodes.COURSES] })
	@ApiOperation({ summary: "Get courses progress", description: `Get all courses progress` })
	@ApiOkResponse({ type: CourseProgressInfoDto })
	@ApiBadRequestResponse({ type: ErrorResponseDTO })
	async getall(
		@Query() pageOptions: PageOptionsDTO,
		@Request() { user }: RequestWithUser
	): Promise<PageDTO<CourseProgressInfoDto>> {
		return this.courseProgressService.findAll(pageOptions, user);
	}

	/**
	 * Prüft, ob ein eingeladener Nutzer seine Einladung bereits angenommen hat.
	 */
	@Post("check-invitation")
	@UseJWTWithApiKeyAuthorization({ permissions: [PermissionCodes.PARTICIPANT] })
	@ApiOperation({ summary: "Check if already accepted invitation" })
	@ApiOkResponse({ description: "Invitation has already been accepted" })
	@ApiBadRequestResponse({ type: ErrorResponseDTO })
	async checkIfAlreadyAccept(@Request() { user }: { user: IScenarioUser }) {
		if (user && user?.token && user.isAccepted) {
			return { user, accessToken: user?.token, courseProgressId: user?.courseProgressId };
		}
		return {};
	}

	/**
	 * Lädt weitere Nutzer zur Teilnahme am Szenario ein (durch ERR oder Koordinator).
	 */
	@Post("invite")
	@UseJWTWithApiKeyAuthorization({ permissions: [PermissionCodes.PARTICIPANT] })
	@ApiOperation({ summary: "ERR invites users on scenario" })
	@ApiOkResponse({ description: "Nothing returns" })
	@ApiBadRequestResponse({ type: ErrorResponseDTO })
	async invite(
		@Body() body: { users: InviteUserOnScenarioDTO[]; courseProgressId?: string },
		@Request() { user }: RequestWithUser
	) {
		return this.courseProgressService.inviteUserOnScenario(body.courseProgressId, user, body.users);
	}

	/**
	 * Angenommene Einladung eines Nutzers wird bestätigt.
	 */
	@Post("accept-invite")
	@UseJWTWithApiKeyAuthorization({ permissions: [PermissionCodes.PARTICIPANT] })
	@ApiOperation({ summary: "Invited user accepts scenario`s invitation" })
	@ApiOkResponse({ type: UserInfoDTO })
	@ApiBadRequestResponse({ type: ErrorResponseDTO })
	async acceptInvite(
		@Body() body: { user: InviteUserOnScenarioDTO; courseProgressId?: string; accessToken: string },
		@Request() { user }: { user: IScenarioUser }
	) {
		return this.courseProgressService.acceptCourseProgressInvite(
			user,
			body.user,
			body.courseProgressId,
			body.accessToken
		);
	}

	/**
	 * Löscht ein Szenario – nur für berechtigte Admins/Firmen.
	 */
	@Delete(":id")
	@UseJWTWithApiKeyAuthorization({ permissions: [PermissionCodes.COURSES, PermissionCodes.GLOBAL_ADMIN] })
	@ApiOperation({ summary: "Safely deletes", description: "Safely deletes the result of the scenario" })
	delete(@Param() params: { id: string }, @Request() { user }: RequestWithUser) {
		return this.courseProgressService.delete(params.id, user);
	}

	/**
	 * Erstellt und exportiert einen Bericht zum Szenario (z. B. für Evaluation oder Archivierung).
	 */
	@Post("report/:id")
	@UseJWTWithApiKeyAuthorization({ permissions: [PermissionCodes.GLOBAL_ADMIN] })
	@ApiOperation({ summary: "Receiving a report", description: "Receiving a report on the scenario" })
	async exportScenarioReport(
		@Param() { id }: { id: string },
		@Request() { user }: RequestWithUser,
		@Body() body: ExportScenarioReportDto,
		@Res() res: Response
	) {
		await this.courseProgressService.exportScenarioProgressReport(id, user, body, res);
	}
}
