import { forwardRef, Inject, Injectable, Logger, NotFoundException } from "@nestjs/common";
import { ConfigType } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { Cron, CronExpression } from "@nestjs/schedule";
import { Response } from "express";
import appConfig from "src/app/config/app.config";
import { ScenarioProgressCachingService } from "src/caching/services/scenario-progress-caching.service";
import { PageDTO, PageMetaDTO } from "src/common/dto";
import { PageOptionsDTO } from "src/common/dto/page-options.dto";
import { CourseService } from "src/courses/course.service";
import { MailService } from "src/mail/mail.service";
import { PermissionCodes } from "src/permissions/enum/codes";
import { participantPermissionCodes } from "src/roles/constants/base-roles";
import User from "src/users/models/user.model";
import { v4 } from "uuid";
import { CourseProgressGateway } from "./course-progress.gateway";
import { CourseProgressInfoDto } from "./dto/cource-progress-info.dto";
import { ExportScenarioReportDto } from "./dto/export-report.dto";
import { InviteUserOnScenarioDTO } from "./dto/invite-user-on-scenario.dto";
import { AdditionalStatusInfoTags } from "./enum/AdditionalStatusInfoTags.enum";
import { ScenarioMessageTypes } from "./enum/ScenarioMessageTypes.enum";
import { SocketEvents } from "./enum/SocketEvents.enum";
import { CourseProgressEnum } from "./enum/Status";
import { ExportScenarioProgressService } from "./export-scenario-progress.service";
import { IScenarioJson } from "./interfaces/ScenarioJson.interface";
import { ScenarioMessageInfo } from "./interfaces/ScenarioMessageInfo.interface";
import { IScenarioUser } from "./interfaces/ScenarioUser.interface";
import CourseProgress from "./models/course-progress.model";
import { CourseProgressContentRepository } from "./repositories/course-progress-content.repository";
import { CourseProgressUsersRepository } from "./repositories/course-progress-users.repository";
import { CourseProgressRepository } from "./repositories/course-progress.repository";
import { ProtocolDecisionRepository } from "./repositories/protocol-decisions.repository";
import { ProtocolHistoryRepository } from "./repositories/protocol-history.repository";
import { ProtocolMessagesRepository } from "./repositories/protocol-messages.repository";
import { getUnique } from "./utils/getUnique";

/**
 * Klasse: CourseProgressService
 *
 * Diese Serviceklasse verwaltet den vollständigen Lebenszyklus eines Szenarioverlaufs
 * (CourseProgress) in einer Lernanwendung. Sie übernimmt:
 * - das Starten, Abschließen und Überwachen von Szenarien
 * - das Einladen und Verwalten von Teilnehmenden
 * - das Caching über den `ScenarioProgressCachingService`
 * - das Schreiben persistenter Daten über verschiedene Repositories
 * - die Kommunikation mit dem WebSocket-Gateway
 *
 * Zusätzlich ist ein täglicher Cronjob definiert, der abgelaufene Szenarien automatisch abschließt.
 */
@Injectable()
export class CourseProgressService {
	private readonly logger = new Logger(CourseProgressService.name);

	constructor(
		@Inject(appConfig.KEY)
		private config: ConfigType<typeof appConfig>,
		private readonly courseProgressRepository: CourseProgressRepository,
		private readonly contentCourseProgressRepository: CourseProgressContentRepository,
		private readonly usersCourseProgressRepository: CourseProgressUsersRepository,
		private readonly protocolDecisionRepository: ProtocolDecisionRepository,
		private readonly protocolHistoryRepository: ProtocolHistoryRepository,
		private readonly protocolMessagesRepository: ProtocolMessagesRepository,
		private readonly courseService: CourseService,
		@Inject(forwardRef(() => CourseProgressGateway))
		private readonly courseProgressGateway: CourseProgressGateway,
		private readonly mailService: MailService,
		private readonly scenarioProgressCachingService: ScenarioProgressCachingService,
		private readonly jwtService: JwtService,
		private readonly exportScenarioProgressService: ExportScenarioProgressService
	) {}

	/**
	 * Funktion: handleCron
	 *
	 * Dieser Cronjob wird täglich um Mitternacht ausgeführt.
	 * Er beendet automatisch alle Szenarien, die seit über 24 Stunden
	 * nicht mehr aktualisiert wurden.
	 */
	@Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
	async handleCron() {
		this.logger.debug("Running scheduled task to complete all scenarios that are not active");
		try {
			const currentScenariosInProgress =
				await this.courseProgressRepository.findAllScenariosInProgress();

			if (!currentScenariosInProgress.length) {
				this.logger.debug("No scenarios in progress.");
				return;
			}

			await this.bulkFinishingScenariosInProgress(currentScenariosInProgress);

			this.logger.debug(`Completed processing ${currentScenariosInProgress.length} scenarios.`);
		} catch (error) {
			this.logger.error(
				"Error during running scheduled task to complete all scenarios that are not active:",
				error
			);
		}
	}

	/**
	 * Funktion: bulkFinishingScenariosInProgress
	 *
	 * Beendet eine Liste von Kursen/Szenarien, entweder weil sie inaktiv sind
	 * oder weil sie manuell zwangsweise beendet werden sollen.
	 *
	 * @param currentScenariosInProgress - Liste aktiver Szenarien
	 * @param forceFinishing - Optional: Erzwingt das Beenden aller Einträge, auch wenn sie noch aktiv sind
	 */
	async bulkFinishingScenariosInProgress(
		currentScenariosInProgress: CourseProgress[],
		forceFinishing = false
	) {
		const tasks = currentScenariosInProgress.map(async (scenario) => {
			const existedProgress = await this.scenarioProgressCachingService.getScenarioProgress(
				scenario.id,
				true
			);
			const lastUpdateTimeStamp = existedProgress?.lastUpdateTimeStamp;
			const currentTimeStamp = Date.now();

			if (
				!lastUpdateTimeStamp ||
				currentTimeStamp - lastUpdateTimeStamp > 24 * 60 * 60 * 1000 ||
				forceFinishing
			) {
				return Promise.all([
					this.finalizeSession(
						scenario.id,
						CourseProgressEnum.Paused,
						AdditionalStatusInfoTags.AUTO_COMPLETED
					),
					this.scenarioProgressCachingService.clearTemporaryContentForCourseProgress(scenario.id),
					this.scenarioProgressCachingService.removeActiveTimerStage(scenario.id),
				]);
			}
		});

		return Promise.all(tasks);
	}

	/**
	 * Funktion: initializeTrainingCourse
	 *
	 * Startet einen neuen Kurs für einen Benutzer.
	 * Falls der Benutzer bereits an einem Szenario teilnimmt,
	 * wird dieses zuerst beendet.
	 *
	 * @param data - Teilweise Informationen zum neuen Szenario (z. B. `courseId`, `userId`)
	 * @param errInfo - Daten des Benutzers, der das Szenario startet
	 * @returns Ein DTO mit Informationen zum neu gestarteten Kursverlauf
	 */
	async initializeTrainingCourse(data: Partial<CourseProgress>, errInfo: Partial<User>) {
		const existedScenarioInProgress =
			await this.courseProgressRepository.findAllScenariosInProgressForUser(errInfo.id);

		if (existedScenarioInProgress.length) {
			await this.bulkFinishingScenariosInProgress(existedScenarioInProgress, true);
		}

		const courseProgress = new CourseProgress();
		courseProgress.status = CourseProgressEnum.InProgress;
		courseProgress.courseId = data.courseId;
		courseProgress.userId = data.userId;

		const courseProgressInfo = (
			await this.courseProgressRepository.saveCourseProgress(courseProgress)
		).dataValues;

		const courseInfo = await this.courseService.findOne(data.courseId);
		const courseScenario = courseInfo?.json as unknown as IScenarioJson;
		const isOnlyOneStage = courseScenario?.Content && courseScenario?.Content?.length - 1 === 0;

		await this.scenarioProgressCachingService.onCourseInitialize(
			courseProgressInfo.id,
			errInfo,
			courseScenario,
			isOnlyOneStage
		);

		return new CourseProgressInfoDto(courseProgress);
	}

	/**
	 * Funktion: findOne
	 *
	 * Sucht einen Kursfortschritt (CourseProgress) anhand seiner ID.
	 * Wird keine Übereinstimmung gefunden, wird eine Ausnahme ausgelöst.
	 *
	 * @param id - Die ID des Szenariofortschritts
	 * @returns Das zugehörige DTO-Objekt mit allen Szenarioinformationen
	 */
	async findOne(id: string): Promise<CourseProgressInfoDto> {
		const courseProgress = await this.courseProgressRepository.findOneCourseProgress(id);

		if (!courseProgress) {
			throw new NotFoundException("Scenario info in progress was not found");
		}

		return new CourseProgressInfoDto(courseProgress);
	}

	/**
	 * Funktion: checkIfAnyScenariosInProgress
	 *
	 * Prüft, ob ein Benutzer aktuell an einem Szenario teilnimmt.
	 * Falls ja, wird das zugehörige DTO zurückgegeben, andernfalls `null`.
	 *
	 * @param user - Der aktuell eingeloggte Benutzer
	 * @returns Das Szenario-Datenobjekt oder `null`, wenn kein laufendes Szenario existiert
	 */
	async checkIfAnyScenariosInProgress(user: User) {
		const courseProgress = await this.courseProgressRepository.findLastScenarioInProgress(user.id);
		if (!courseProgress?.id) {
			return null;
		}

		const existedProgress = await this.scenarioProgressCachingService.getScenarioProgress(
			courseProgress.id,
			true
		);

		if (existedProgress?.errInfo && existedProgress?.errInfo?.email === user.email) {
			return new CourseProgressInfoDto(courseProgress);
		}
		return null;
	}

	//cut
	/**
	 * Funktion: finalizeSession
	 *
	 * Beendet ein laufendes Szenario und speichert alle zugehörigen Daten dauerhaft in der Datenbank.
	 * Dazu zählen:
	 * - Benutzerinformationen (Teilnehmer:innen)
	 * - Inhalte der durchlaufenen Stages
	 * - Nachrichten und Entscheidungsverläufe
	 *
	 * Außerdem wird der Fortschritt als abgeschlossen markiert, mit Endzeitpunkt, Status und Abschlussnachricht.
	 * Abschließend wird der zugehörige Caching-Eintrag entfernt.
	 *
	 * @param courseProgressId - Die ID des Szenarioverlaufs, der abgeschlossen werden soll
	 * @param status - Der Abschlussstatus (z. B. Success, Failed, Paused)
	 * @param phaseEndText - Eine zusätzliche Beschreibung zum Szenarioabschluss
	 * @returns Das zuletzt gecachte Szenario (z. B. für Export oder Anzeige)
	 */
	async finalizeSession(
		courseProgressId: string,
		status: CourseProgressEnum = CourseProgressEnum.Success,
		phaseEndText: AdditionalStatusInfoTags = AdditionalStatusInfoTags.SUCCESS
	) {
		// Prüft, ob es den Szenarioverlauf in der Datenbank gibt
		const courseProgressInfo =
			await this.courseProgressRepository.findOneCourseProgress(courseProgressId);

		if (!courseProgressInfo) {
			throw new NotFoundException("Scenario progress was not found");
		}

		// Holt vollständige Szenarioinformationen aus dem Cache
		const scenarioInfo = await this.scenarioProgressCachingService.getScenarioProgress(
			courseProgressId,
			true
		);

		try {
			const protocolHistory = scenarioInfo.protocolHistory;

			// Bereitet Teilnehmerdaten zur Speicherung in DB vor
			const preparedUsers = scenarioInfo.users.map((user) => ({
				id: user.id,
				courseProgressId,
				firstName: user?.firstName ?? "",
				lastName: user?.lastName ?? "",
				email: user?.email ?? "",
				isAccepted: user?.isAccepted ?? false,
				isERR: scenarioInfo?.errInfo?.id === user.id,
				firstJoinTimeStamp: user?.isAccepted ? (user?.firstJoinTimeStamp ?? 0) : 0,
				exitTimeStamp: user?.isAccepted ? (user?.exitTimeStamp ?? Date.now()) : 0,
				invitedTimeStamp: user?.invitedTimeStamp ?? 0,
			}));
			await this.usersCourseProgressRepository.bulkCreate(preparedUsers);

			// Speichert alle durchlaufenen Inhalte des Szenarios
			const preparedContent = scenarioInfo.stageContent.map((content) => ({
				id: content.id,
				content: content.content,
				contentType: content.contentType,
				stageNumber: content.stageNumber,
				title: content?.title ?? "Information",
				timeStamp: content.timeStamp,
				courseProgressId,
			}));
			await this.contentCourseProgressRepository.bulkCreate(preparedContent);

			// Speichert Nachrichten und Entscheidungen im Protokollverlauf
			for (const item of protocolHistory) {
				if (
					item.type === ScenarioMessageTypes.MESSAGE ||
					item.type === ScenarioMessageTypes.DECISION
				) {
					let userId = null;
					if (item?.data?.email === scenarioInfo?.errInfo?.email) {
						userId = scenarioInfo?.errInfo?.id;
					} else if (item?.data?.userId && typeof item?.data?.userId === "string") {
						userId = item.data?.userId;
					}

					// Erstellt einen neuen Protokolleintrag
					const protocolHistoryItem = await this.protocolHistoryRepository.create({
						courseProgressId,
						type: item.type,
						timestamp: item.timestamp,
						userId,
					});

					// Entscheidungsverlauf speichern
					if (item.type === ScenarioMessageTypes.DECISION) {
						let votedBy = [];

						if (item.data?.finalDecision?.userVotedIds?.length) {
							// Falls ursprünglicher User mit ERR ersetzt werden soll
							if (
								item.data.finalDecision.userVotedIds?.find(
									(voterId) => voterId?.toString() === courseProgressInfo.userId?.toString()
								)
							) {
								item.data.finalDecision.userVotedIds = item.data.finalDecision.userVotedIds.map(
									(id) =>
										id?.toString() === courseProgressInfo?.userId?.toString()
											? scenarioInfo?.errInfo?.id
											: id
								);
							}
							votedBy = item.data.finalDecision.userVotedIds;
						}

						await this.protocolDecisionRepository.create(
							{
								protocolHistoryId: protocolHistoryItem.id,
								decision: item.data.name,
								finalDecision: item.data.finalDecision?.option || "Not selected",
							},
							votedBy
						);
					}
					// Nachricht speichern
					else if (item.type === ScenarioMessageTypes.MESSAGE) {
						await this.protocolMessagesRepository.create({
							protocolHistoryId: protocolHistoryItem.id,
							message: item.data.message,
							options: item.data?.options ? JSON.stringify(item.data.options) : null,
						});
					}
				}
			}
		} catch (error) {
			console.log("\n\n error during related scenario content saving", error, "\n\n");
			throw new Error(`Failed to save scenario content: ${error.message}`);
		}

		// Abschlussdaten in courseProgress setzen
		const resultStatus =
			scenarioInfo?.json?.Content?.[scenarioInfo.currentStage]?.phaseEndResult ?? status;

		courseProgressInfo.status = resultStatus;
		courseProgressInfo.finalPhaseId = scenarioInfo?.json?.Content?.[scenarioInfo.currentStage]?.id;
		courseProgressInfo.scenarioEndMessage =
			scenarioInfo?.json?.Content?.[scenarioInfo.currentStage]?.phaseEndText ?? phaseEndText;
		courseProgressInfo.finishDate = new Date();

		// Persistiert Kursfortschritt mit neuem Status und Abschlussnachricht
		await this.courseProgressRepository.saveCourseProgress(courseProgressInfo);

		// Entfernt Cache-Eintrag für dieses Szenario
		await this.scenarioProgressCachingService.clearScenarioProgress(courseProgressId);

		return scenarioInfo;
	}

	//cut
	/**
	 * Funktion: inviteUserOnScenario
	 *
	 * Diese Funktion lädt Benutzer:innen zu einem laufenden Szenario ein.
	 * Dabei wird:
	 * - geprüft, ob Benutzer:innen bereits eingeladen oder vorhanden sind,
	 * - ein Token zur Einladung generiert,
	 * - ggf. eine Einladung per E-Mail versendet,
	 * - das Benutzer:innen-Array im Szenario aktualisiert,
	 * - ein Protokolleintrag erzeugt,
	 * - und die Änderungen im Cache gespeichert.
	 *
	 * Abschließend werden alle Clients über die aktualisierte Teilnehmerliste informiert.
	 *
	 * @param courseProgressId - ID des Szenariodurchlaufs
	 * @param errInfo - Informationen über den Benutzer (meist ERR), der die Einladung verschickt
	 * @param invitedUsers - Liste der einzuladenden Benutzer:innen (mit E-Mail und Berechtigungen)
	 */
	async inviteUserOnScenario(
		courseProgressId: string,
		errInfo: Partial<User>,
		invitedUsers: InviteUserOnScenarioDTO[]
	) {
		const timeStamp = Date.now();

		// Holt aktuellen Szenariofortschritt und bereits geladene Benutzer:innen
		const currentScenarioProgress =
			await this.scenarioProgressCachingService.getScenarioProgress(courseProgressId);
		const existedUsers = currentScenarioProgress.users;

		// Zwischenspeicher für erfolgreich eingeladene Benutzer:innen
		const sentEmails: {
			email: string;
			token: string;
			id: string;
			isExistedInvitation: boolean;
			permissions: PermissionCodes[];
			firstName?: string;
			lastName?: string;
			isAccepted?: boolean;
			firstJoinTimeStamp?: number;
			exitTimeStamp?: number;
			invitedTimeStamp?: number;
		}[] = [];

		// Verarbeitet alle eingeladenen Benutzer:innen und prüft, ob bereits eingeladen oder entfernt
		const results = await Promise.allSettled(
			invitedUsers.map(async (invitedUser) => {
				const existedUser = existedUsers.find((user) => user.email === invitedUser.email);

				let token: string;
				let id: string;

				// Existierende Benutzer:innen erhalten bestehenden oder neuen Token
				if (existedUser) {
					id = existedUser.id;
					if (existedUser?.isRemoved) {
						token = await this.jwtService.signAsync({
							id,
							courseProgressId,
							email: invitedUser.email,
						});
					} else {
						token = existedUser?.token;
					}
				} else {
					id = v4();
					token = await this.jwtService.signAsync({
						id,
						courseProgressId,
						email: invitedUser.email,
					});
				}

				// URL für Erstanmeldung mit Token und Szenario-ID
				const url = new URL("/first-login", this.config.webAppDomain);
				url.searchParams.append("token", token);
				url.searchParams.append("courseProgressId", courseProgressId);

				try {
					// Nur wenn der Benutzer noch nicht akzeptiert hat oder entfernt wurde, wird eine Einladung verschickt
					if (!existedUser?.isAccepted || existedUser?.isRemoved) {
						await this.mailService.sendUserInvitationOnCourse(
							errInfo,
							invitedUser.email,
							url.toString(),
							currentScenarioProgress?.json?.scenarioName ?? "Scenario",
							`${errInfo?.firstName ?? ""} ${errInfo?.lastName ?? ""}`
						);
					}

					// Rückgabe der Einladung für spätere Verwendung
					return {
						id,
						email: invitedUser.email,
						token,
						isExistedInvitation: !!existedUser && !existedUser?.isRemoved,
						permissions: invitedUser?.permissions ?? [],
						firstName: existedUser?.firstName,
						lastName: existedUser?.lastName,
						isAccepted: existedUser?.isAccepted,
						firstJoinTimeStamp: existedUser?.firstJoinTimeStamp,
						exitTimeStamp: existedUser?.exitTimeStamp,
						invitedTimeStamp: existedUser?.invitedTimeStamp,
					};
				} catch (error) {
					console.error(`Failed to send email to ${invitedUser.email}`, error);
					return { email: invitedUser.email, error };
				}
			})
		);

		// Filtert alle erfolgreichen Einladungen heraus
		results.forEach((result) => {
			if (result.status === "fulfilled") {
				sentEmails.push({
					email: result.value.email,
					id: result.value.id,
					isExistedInvitation: result?.value?.isExistedInvitation,
					token: result?.value?.token,
					permissions: result?.value?.permissions,
					firstName: result?.value?.firstName,
					lastName: result?.value?.lastName,
					isAccepted: result?.value?.isAccepted,
					exitTimeStamp: result?.value?.exitTimeStamp,
					firstJoinTimeStamp: result?.value?.firstJoinTimeStamp,
					invitedTimeStamp: result?.value?.invitedTimeStamp,
				});
			}
		});

		// Erstellt neue Benutzer:innen-Einträge basierend auf nicht bereits bestehenden Einladungen
		const newUsers = sentEmails
			.filter((item) => !item?.isExistedInvitation)
			.map(
				({
					email,
					id,
					token,
					permissions,
					firstName,
					lastName,
					isAccepted,
					exitTimeStamp,
					firstJoinTimeStamp,
					invitedTimeStamp,
				}) =>
					({
						id,
						email,
						firstName: firstName ?? "",
						lastName: lastName ?? "",
						isAccepted: !!isAccepted,
						isRemoved: false,
						isActive: false,
						token: token,
						invitedTimeStamp: invitedTimeStamp ?? timeStamp,
						exitTimeStamp: exitTimeStamp ?? 0,
						firstJoinTimeStamp: firstJoinTimeStamp ?? 0,
						permissions: getUnique(permissions, participantPermissionCodes),
					}) as IScenarioUser
			);

		// Kombiniert bestehende und neue Benutzer:innen in einer Map (Unique by E-Mail)
		const uniqueUsersMap = new Map<string, IScenarioUser>();
		[...currentScenarioProgress.users, ...newUsers].forEach((user) => {
			uniqueUsersMap.set(user.email, user);
		});
		currentScenarioProgress.users = Array.from(uniqueUsersMap.values());

		// Fügt Protokolleintrag zur Einladung hinzu
		currentScenarioProgress.protocolHistory.push({
			id: v4(),
			data: {
				userId: errInfo?.id,
				firstName: errInfo?.firstName,
				lastName: errInfo?.lastName,
				email: errInfo?.email,
				message: `invited-users`,
				options: {
					usersString: sentEmails.map((user) => user.email).join(", "),
				},
			},
			type: ScenarioMessageTypes.MESSAGE,
			timestamp: timeStamp,
		} as ScenarioMessageInfo);

		// Speichert aktualisierten Szenariofortschritt im Cache
		await this.scenarioProgressCachingService.setScenario(
			courseProgressId,
			currentScenarioProgress
		);

		// Aktualisiert Liste der verbundenen Benutzer:innen im Frontend
		const connectedUsers =
			await this.courseProgressGateway.getConnectedUsersInRoom(courseProgressId);

		this.courseProgressGateway.emitSocketEvent(
			courseProgressId,
			SocketEvents.UPDATE_CONNECTED_USERS,
			connectedUsers
		);

		this.courseProgressGateway.emitSocketEvent(
			courseProgressId,
			SocketEvents.ACTUAL_SCENARIO_DATA,
			currentScenarioProgress
		);
	}

	/**
	 * Funktion: acceptCourseProgressInvite
	 *
	 * Diese Funktion wird aufgerufen, wenn ein eingeladener Benutzer dem Szenario beitritt.
	 * Sie aktualisiert den Benutzer im Cache, markiert ihn als "akzeptiert",
	 * fügt einen Beitrittszeitpunkt hinzu und protokolliert die Teilnahme.
	 *
	 * @param user - Der eingeladene Benutzer (aus Token dekodiert)
	 * @param invitedUser - Die Daten, die der Benutzer beim Beitritt angibt (z. B. Name)
	 * @param courseProgressId - ID des zugehörigen Szenarios
	 * @param accessToken - Neues Token des Benutzers für spätere Authentifizierung
	 * @returns Objekt mit aktualisiertem Benutzer und Szenario-ID
	 */
	async acceptCourseProgressInvite(
		user: IScenarioUser,
		invitedUser: InviteUserOnScenarioDTO,
		courseProgressId: string,
		accessToken: string
	) {
		if (!user?.isAccepted) {
			const currentScenarioProgress =
				await this.scenarioProgressCachingService.getScenarioProgress(courseProgressId);

			const existedUserIndex = currentScenarioProgress.users.findIndex(
				(existedUser) => existedUser.id === user.id
			);

			if (existedUserIndex !== -1) {
				currentScenarioProgress.users[existedUserIndex] = {
					...currentScenarioProgress.users[existedUserIndex],
					firstName: invitedUser.firstName,
					lastName: invitedUser.lastName,
					isAccepted: true,
					token: accessToken,
					firstJoinTimeStamp: Date.now(),
				};

				currentScenarioProgress.protocolHistory.push({
					id: v4(),
					data: {
						userId: currentScenarioProgress.users[existedUserIndex]?.id,
						firstName: currentScenarioProgress.users[existedUserIndex]?.firstName,
						lastName: currentScenarioProgress.users[existedUserIndex]?.lastName,
						email: currentScenarioProgress.users[existedUserIndex]?.email,
						message: `user-joined`,
					},
					type: ScenarioMessageTypes.MESSAGE,
					timestamp: Date.now(),
				} as ScenarioMessageInfo);

				await this.scenarioProgressCachingService.setScenario(
					courseProgressId,
					currentScenarioProgress
				);

				this.courseProgressGateway.emitSocketEvent(
					courseProgressId,
					SocketEvents.ACTUAL_SCENARIO_DATA,
					currentScenarioProgress
				);

				return {
					courseProgressId,
					user: { ...user, ...currentScenarioProgress.users[existedUserIndex] },
					accessToken,
				};
			} else {
				this.scenarioProgressCachingService.unlockScenario(courseProgressId);
			}
		}
		return { courseProgressId, user, accessToken };
	}

	/**
	 * Funktion: findAll
	 *
	 * Gibt eine paginierte Liste aller Kursverläufe (Szenario-Fortschritte) eines Nutzers zurück.
	 * Unterstützt Suchparameter, Pagination und DTO-Transformation.
	 *
	 * @param pageOptions - Optionen zur Paginierung (Limit, Seite, Suchwert)
	 * @param user - Der aktuelle Benutzer
	 * @returns Eine paginierte Liste von Szenariofortschritts-Datensätzen
	 */
	async findAll(pageOptions: PageOptionsDTO, user: User): Promise<PageDTO<CourseProgressInfoDto>> {
		const { rows, count } = await this.courseProgressRepository.findAllAndCount(
			pageOptions.limit || 1000,
			pageOptions.skip,
			pageOptions.searchValue || null,
			user
		);

		const pageMeta = new PageMetaDTO({ itemCount: count, pageOptions });

		return new PageDTO(
			rows.map((course) => new CourseProgressInfoDto(course)),
			pageMeta
		);
	}

	/**
	 * Funktion: delete
	 *
	 * Löscht einen Szenariofortschritt aus der Datenbank für den aktuellen Benutzer.
	 * Diese Funktion wird meist nur von Admins oder bei aufgeräumten Altdaten genutzt.
	 *
	 * @param id - Die ID des Szenarioverlaufs
	 * @param user - Der aktuelle Benutzer (zur Berechtigungsprüfung)
	 * @returns Ergebnis der Löschoperation (z. B. `true` bei Erfolg)
	 */
	async delete(id: string, user: User) {
		return this.courseProgressRepository.deleteCourseProgress(id, user);
	}

	/**
	 * Funktion: exportScenarioProgressReport
	 *
	 * Exportiert den vollständigen Szenarioverlauf als Datei (z. B. PDF oder CSV)
	 * und sendet diese direkt über die HTTP-Antwort an den Client.
	 *
	 * @param courseProgressId - ID des Szenarios, das exportiert werden soll
	 * @param user - Der aktuelle Benutzer (zur Prüfung auf Zugriffsrechte)
	 * @param body - Einstellungen zum Export (z. B. ob Entscheidungen enthalten sein sollen)
	 * @param res - Die Express-HTTP-Antwort zum Versenden der Datei
	 */
	async exportScenarioProgressReport(
		courseProgressId: string,
		user: User,
		body: ExportScenarioReportDto,
		res: Response
	) {
		const scenarioProgress =
			await this.courseProgressRepository.findCourseProgressWithRelatedDataForReport(
				courseProgressId,
				user
			);

		return await this.exportScenarioProgressService.sendExportFileInResponse(
			res,
			scenarioProgress,
			body
		);
	}
}
