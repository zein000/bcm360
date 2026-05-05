import { Inject, Injectable } from "@nestjs/common";
import { ConfigType } from "@nestjs/config";
import { Cache } from "cache-manager";

import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { Mutex } from "async-mutex";

import { ScenarioMessageTypes } from "src/course-progress/enum/ScenarioMessageTypes.enum";
import {
	EMPTY_COURSE_SCENARIO,
	IScenarioJson,
	IStageContentInfo,
	IStageInfo,
} from "src/course-progress/interfaces/ScenarioJson.interface";
import { ScenarioMessageInfo } from "src/course-progress/interfaces/ScenarioMessageInfo.interface";
import { IScenarioUser } from "src/course-progress/interfaces/ScenarioUser.interface";
import { FileTypes } from "src/file/enum/FileTypes.enum";
import { PermissionCodes } from "src/permissions/enum/codes";
import User from "src/users/models/user.model";

import { v4 } from "uuid";

import { CachingService } from "../caching.service";
import cacheConfig from "../config/caching.config";
import { ActiveTimersData } from "../interfaces/ActiveTimersData.interface";
import { ITemporaryContent } from "../interfaces/ITemporaryContent.interface";
import { ScenarioProgress } from "../interfaces/ScenarioProgress.interface";

/**
 * Klasse: ScenarioProgressCachingService
 *
 * Diese Serviceklasse erweitert den `CachingService` und verwaltet den Fortschritt von Kursszenarien im Cache.
 * Sie speichert komplexe Szenario-Daten, verwaltet aktive Timer und synchronisiert den Zugriff durch Mutex-Locks.
 *
 * Verwendungszweck:
 * - Speicherung und Abruf des aktuellen Fortschritts eines Szenarios pro Kurs (z. B. für Echtzeit-Fortschritt, Wiederherstellung)
 * - Verhindert gleichzeitiges Überschreiben durch parallele Zugriffe durch Mutex-Handling
 * - Speichert temporäre Timer-Daten global im Cache
 *
 * Besonderheiten:
 * - Verwendet `async-mutex` zur Synchronisierung
 * - Szenario-Daten sind serialisiert als JSON
 */
@Injectable()
export class ScenarioProgressCachingService extends CachingService {
	private locks = new Map<string, Mutex>();
	private activeLocks = new Map<string, () => void>();

	constructor(
		@Inject(cacheConfig.KEY)
		config: ConfigType<typeof cacheConfig>,
		@Inject(CACHE_MANAGER) cacheManager: Cache
	) {
		super(cacheManager, "scenario-progress", config.scenarioTtl);
	}

	/**
	 * Funktion: setActiveTimers
	 *
	 * Speichert globale aktive Timer-Daten im Cache.
	 *
	 * @param activeTimersData - Objekt mit aktiven Timern
	 * @returns Promise mit Ergebnis der Cache-Operation
	 */
	async setActiveTimers(activeTimersData: ActiveTimersData) {
		return this.set("active-timers", JSON.stringify(activeTimersData));
	}

	/**
	 * Funktion: getActiveTimers
	 *
	 * Ruft aktive Timer-Daten aus dem Cache ab.
	 *
	 * @returns Ein Objekt mit Timern oder ein leeres Objekt, wenn nichts gefunden wurde
	 */
	async getActiveTimers(): Promise<ActiveTimersData> {
		const res = await this.get("active-timers");
		return res ? JSON.parse(res) : {};
	}

	/**
	 * Funktion: getMutex
	 *
	 * Gibt ein Mutex-Objekt für einen Kurs zurück oder erstellt es, falls noch nicht vorhanden.
	 *
	 * @param courseId - Kurs-ID
	 * @returns Instanz eines Mutex für Synchronisierung
	 */
	private getMutex(courseId: string): Mutex {
		if (!this.locks.has(courseId)) {
			this.locks.set(courseId, new Mutex());
		}
		return this.locks.get(courseId)!;
	}

	/**
	 * Funktion: unlockScenario
	 *
	 * Gibt das Lock für ein Szenario wieder frei, nachdem `setScenario` abgeschlossen wurde.
	 *
	 * @param courseId - Kurs-ID
	 */
	unlockScenario(courseId: string) {
		const release = this.activeLocks.get(courseId);
		if (release) {
			release();
			this.activeLocks.delete(courseId);
		}
	}

	/**
	 * Funktion: setScenario
	 *
	 * Speichert ein Szenario im Cache. Diese Funktion darf nur aufgerufen werden,
	 * wenn vorher `getScenarioProgress` (im Schreibmodus) aufgerufen wurde.
	 *
	 * @param courseId - Kurs-ID
	 * @param data - Fortschrittsdaten eines Szenarios
	 * @throws Error, wenn kein Lock vorhanden ist
	 */
	async setScenario(courseId: string, data: ScenarioProgress) {
		const release = this.activeLocks.get(courseId);
		if (!release) {
			throw new Error(`Cannot set scenario for ${courseId} without prior getScenarioProgress`);
		}
		data.lastUpdateTimeStamp = Date.now();
		await this.set(courseId, JSON.stringify(data));
		release();
		this.activeLocks.delete(courseId);
	}

	/**
	 * Funktion: getScenarioProgress
	 *
	 * Liest den Fortschritt eines Szenarios aus dem Cache. Falls keiner existiert, wird eine leere Standardstruktur zurückgegeben.
	 * Im Schreibmodus wird ein Lock gesetzt, das mit `setScenario` wieder freigegeben werden muss.
	 *
	 * @param courseId - Kurs-ID
	 * @param isReadOnly - Wenn true, wird das Lock nach dem Lesen direkt wieder freigegeben
	 * @returns Szenario-Fortschritt (aus Cache oder initialisiert)
	 */
	async getScenarioProgress(
		courseId: string,
		isReadOnly = false
	): Promise<ScenarioProgress | undefined> {
		const mutex = this.getMutex(courseId);
		const release = await mutex.acquire();

		try {
			const res = await this.get(courseId);
			const data = res
				? JSON.parse(res)
				: {
						protocolHistory: [],
						chatHistory: [],
						currentStage: 0,
						currentStageStartTimestamp: 0,
						currentStageEndTimestamp: 0,
						json: EMPTY_COURSE_SCENARIO,
						stageContent: [],
						users: [],
						errInfo: null,
						lastUpdateTimeStamp: 0,
					};

			if (isReadOnly) {
				release();
			} else {
				this.activeLocks.set(courseId, release);
			}

			return data;
		} catch (err) {
			release();
			throw err;
		}
	}

	/**
	 * Erweiterung: ScenarioProgressCachingService – Methoden
	 *
	 * Diese Methoden ergänzen den `ScenarioProgressCachingService` um zusätzliche Operationen zum Speichern,
	 * Aktualisieren und Verwalten des Szenario-Fortschritts innerhalb eines Kursdurchlaufs.
	 *
	 * Verwendungszwecke:
	 * - Speichern des JSON-Inhalts eines Szenarios
	 * - Wechsel zwischen Szenario-Stufen (Stages)
	 * - Speicherung von Nachrichten (Protokoll und Chat)
	 * - Verwaltung aktiver Timer
	 * - Speichern von Benutzeraktionen und -austritten
	 */

	/**
	 * Speichert das gesamte Szenario-JSON im Cache.
	 *
	 * @param courseId - Kurs-ID
	 * @param json - Szenario-Datenstruktur (JSON)
	 */
	async saveScenarioJson(courseId: string, json: IScenarioJson) {
		let existedProgress = await this.getScenarioProgress(courseId);
		existedProgress.json = json;
		return this.setScenario(courseId, existedProgress);
	}

	/**
	 * Setzt Start- und Endzeitpunkte für die aktuelle Stage.
	 *
	 * @param courseId - Kurs-ID
	 * @param currentStageEndTimestamp - Endzeit der Stage
	 * @param currentStageStartTimestamp - Optional: Startzeit der Stage
	 */
	async setCurrentStageEndTimestamp(
		courseId: string,
		currentStageEndTimestamp: number,
		currentStageStartTimestamp: number = 0
	) {
		let existedProgress = await this.getScenarioProgress(courseId);
		existedProgress.currentStageEndTimestamp = currentStageEndTimestamp;
		await this.saveActiveTimerStage(courseId, currentStageEndTimestamp);
		if (currentStageStartTimestamp) {
			existedProgress.currentStageStartTimestamp = currentStageStartTimestamp;
		}
		return this.setScenario(courseId, existedProgress);
	}

	/**
	 * Fügt eine Protokollnachricht hinzu oder aktualisiert sie.
	 *
	 * @param courseId - Kurs-ID
	 * @param message - Nachricht im Protokollformat
	 */
	async saveProtocolMessage(courseId: string, message: ScenarioMessageInfo) {
		let existedProgress = await this.getScenarioProgress(courseId);

		const existingMessageIndex = existedProgress.protocolHistory.findIndex(
			(item) => item.id === message.id
		);

		if (existingMessageIndex >= 0) {
			existedProgress.protocolHistory[existingMessageIndex] = message;
		} else {
			existedProgress.protocolHistory.push(message);
		}
		return this.setScenario(courseId, existedProgress);
	}

	/**
	 * Fügt eine Chatnachricht hinzu oder aktualisiert sie.
	 *
	 * @param courseId - Kurs-ID
	 * @param message - Nachricht im Chatformat
	 */
	async saveChatMessage(courseId: string, message: ScenarioMessageInfo) {
		let existedProgress = await this.getScenarioProgress(courseId);

		const existingMessageIndex = existedProgress.chatHistory.findIndex(
			(item) => item.id === message.id
		);

		if (existingMessageIndex >= 0) {
			existedProgress.chatHistory[existingMessageIndex] = message;
		} else {
			existedProgress.chatHistory.push(message);
		}
		return this.setScenario(courseId, existedProgress);
	}

	/**
	 * Führt einen Szenario-Wechsel zu einer neuen Stage durch.
	 *
	 * @param courseId - Kurs-ID
	 * @param newStageId - ID der neuen Stage
	 * @throws Error, wenn Stage ungültig ist
	 */
	async goToNewStage(courseId: string, newStageId: number) {
		let existedProgress = await this.getScenarioProgress(courseId);

		const stageIndex = existedProgress.json.Content.findIndex((item) => item.id === newStageId);
		if (stageIndex === -1) {
			throw new Error(`Invalid stage ID: ${newStageId}`);
		}
		if (stageIndex !== existedProgress.currentStage) {
			existedProgress.currentStage = stageIndex;
			existedProgress.currentStageStartTimestamp = Date.now();
			const newStageData = existedProgress.json.Content[stageIndex];
			if (newStageData.timeLimit) {
				existedProgress.currentStageEndTimestamp = Date.now() + newStageData.timeLimit * 1000;
				await this.saveActiveTimerStage(courseId, existedProgress.currentStageEndTimestamp);
			} else {
				existedProgress.currentStageEndTimestamp = 0;
				await this.removeActiveTimerStage(courseId);
			}
			if (newStageData?.content && newStageData?.contentType) {
				const stageContent: IStageContentInfo = {
					id: v4(),
					content: newStageData.content,
					contentType: newStageData.contentType,
					timeStamp: Date.now(),
					stageNumber: newStageData.id,
					isRemoved: false,
				};
				existedProgress.stageContent.push(stageContent);
			}
		}
		await this.clearTemporaryContentForCourseProgress(courseId, false);
		return this.setScenario(courseId, existedProgress);
	}

	/**
	 * Speichert eine neue Entscheidungsphase in das Protokoll.
	 *
	 * @param courseId - Kurs-ID
	 * @param stageInfo - Informationen zur Stage und den Entscheidungsoptionen
	 */
	async pushNewDecision(courseId: string, stageInfo: IStageInfo) {
		const initialProtocolDecision = {
			id: v4(),
			data: {
				name: stageInfo?.decisionName ?? "",
				confirmationRequired: stageInfo.confirmationRequired as any,
				decisionOptions: stageInfo.decisionOptions!.map((optionData) => ({
					option: optionData.option,
					phaseId: optionData.phaseId,
					userVotedIds: [],
				})),
			},
			type: ScenarioMessageTypes.DECISION,
			timestamp: Date.now(),
		};
		await this.saveProtocolMessage(courseId, initialProtocolDecision);
	}

	/**
	 * Speichert oder aktualisiert den Timer-Endzeitpunkt einer Stage im globalen Timer-Cache.
	 *
	 * @param courseId - Kurs-ID
	 * @param currentStageTimeStampEnd - Zeitstempel der geplanten Beendigung der Stage
	 */
	async saveActiveTimerStage(courseId: string, currentStageTimeStampEnd: number) {
		const existedData = await this.getActiveTimers();
		existedData[courseId] = currentStageTimeStampEnd;
		return this.setActiveTimers(existedData);
	}

	/**
	 * Entfernt einen Stage-Timer aus dem Cache.
	 *
	 * @param courseId - Kurs-ID
	 */
	async removeActiveTimerStage(courseId: string) {
		const existedData = await this.getActiveTimers();
		if (existedData[courseId]) {
			delete existedData[courseId];
			return this.setActiveTimers(existedData);
		}
		return;
	}

	/**
	 * Aktualisiert den Zeitstempel des Austritts eines Benutzers aus dem Szenario.
	 *
	 * @param courseId - Kurs-ID
	 * @param user - Benutzer-Objekt mit ID
	 * @param exitTimeStamp - Zeitstempel des Austritts (default: jetzt)
	 */
	async updateUserExitTimeStamp(courseId: string, user: IScenarioUser, exitTimeStamp = Date.now()) {
		let existedProgress = await this.getScenarioProgress(courseId);
		const userIndex = existedProgress.users.findIndex((item) => item.id === user.id);

		if (userIndex >= 0) {
			existedProgress.users[userIndex].exitTimeStamp = exitTimeStamp;
			return this.setScenario(courseId, existedProgress);
		} else {
			return this.unlockScenario(courseId);
		}
	}

	/**
	 * Erweiterung: ScenarioProgressCachingService – weitere Methoden
	 *
	 * Diese Methoden bieten zusätzliche Funktionalität für das Caching und Management von Szenario-Inhalten,
	 * darunter zeitverzögerte Inhalte, Spoiler-Management, temporäre Cacheobjekte und das vollständige Löschen
	 * des Szenario-Fortschritts.
	 */

	/**
	 * Speichert oder aktualisiert Content einer bestimmten Stage im Szenario-Verlauf.
	 *
	 * @param courseId - Kurs-ID
	 * @param info - Inhalt mit Metadaten zur Stage
	 */
	async saveScenarioStageContent(courseId: string, info: IStageContentInfo) {
		let existedProgress = await this.getScenarioProgress(courseId);
		const existedContentIndex = existedProgress.stageContent.findIndex(
			(item) => item.id === info.id
		);

		if (existedContentIndex >= 0) {
			existedProgress.stageContent[existedContentIndex] = info;
		} else {
			existedProgress.stageContent.push(info);
		}
		return this.setScenario(courseId, existedProgress);
	}

	/**
	 * Fügt Spoiler-Content für die aktuelle Stage hinzu und dokumentiert die Anfrage im Protokoll.
	 *
	 * @param courseId - Kurs-ID
	 * @param requesterEmail - E-Mail des Benutzers, der den Spoiler anfordert
	 * @returns Fortschritt mit hinzugefügtem Spoiler-Inhalt (falls vorhanden)
	 */
	async showCurrentStageSpoiler(courseId: string, requesterEmail: string) {
		let existedProgress = await this.getScenarioProgress(courseId);
		let spoilerContent: IStageContentInfo;
		const currentStageInfo = existedProgress.json.Content[existedProgress.currentStage];
		if (currentStageInfo?.spoilerContent?.content) {
			spoilerContent = {
				id: v4(),
				content: currentStageInfo.spoilerContent.content,
				contentType: FileTypes.Spoiler,
				timeStamp: Date.now(),
				title: currentStageInfo.spoilerContent.title,
				stageNumber: currentStageInfo.id,
				isRemoved: false,
			};
			existedProgress.stageContent.push(spoilerContent);
		}
		const requester = existedProgress.users.find((item) => item.email === requesterEmail);
		if (requester) {
			existedProgress.protocolHistory.push({
				id: v4(),
				data: {
					userId: requester.id,
					firstName: requester.firstName,
					lastName: requester.lastName,
					email: requester.email,
					message: `requested-spoiler`,
					options: {
						phaseNumber: currentStageInfo.id,
					},
				},
				type: ScenarioMessageTypes.MESSAGE,
				timestamp: Date.now(),
			} as ScenarioMessageInfo);
		}
		await this.setScenario(courseId, existedProgress);
		return { existedProgress, spoilerContent };
	}

	/**
	 * Entfernt einen bestimmten Stage-Content aus dem Verlauf.
	 *
	 * @param courseId - Kurs-ID
	 * @param info - Inhalt, der entfernt werden soll
	 */
	async removeScenarioStageContent(courseId: string, info: IStageContentInfo) {
		let existedProgress = await this.getScenarioProgress(courseId);
		const existedContentIndex = existedProgress.stageContent.findIndex(
			(item) => item.id === info.id
		);

		if (existedContentIndex >= 0) {
			existedProgress.stageContent = existedProgress.stageContent.filter(
				(_, index) => index !== existedContentIndex
			);
			return this.setScenario(courseId, existedProgress);
		}
	}

	/**
	 * Löscht den kompletten Szenario-Fortschritt aus dem Cache.
	 *
	 * @param courseId - Kurs-ID
	 */
	async clearScenarioProgress(courseId: string) {
		const release = this.activeLocks.get(courseId);
		if (release) {
			release();
			this.activeLocks.delete(courseId);
		}

		await this.del(courseId);
	}

	/**
	 * Speichert den aktuellen temporären Content (z. B. für zeitlich gesteuerte Inhalte).
	 *
	 * @param temporaryContent - Objekt mit Zeitinhalten pro Kurs-Fortschritts-ID
	 */
	async setTemporaryContent(temporaryContent: { [key: string]: ITemporaryContent[] }) {
		return this.set("temporary-content", JSON.stringify(temporaryContent));
	}

	/**
	 * Gibt alle aktuell zwischengespeicherten temporären Inhalte zurück.
	 *
	 * @returns Objekt mit allen `ITemporaryContent[]`, gruppiert nach Kursfortschritt
	 */
	async getTemporaryContent(): Promise<{ [key: string]: ITemporaryContent[] }> {
		const res = await this.get("temporary-content");
		return res ? JSON.parse(res) : {};
	}

	/**
	 * Fügt neue zeitverzögerte Inhalte hinzu, die zu einem späteren Zeitpunkt angezeigt werden sollen.
	 *
	 * @param courseProgressId - ID des Szenario-Fortschritts
	 * @param timeStamp - Basis-Zeitstempel (z. B. für Startzeit)
	 * @param timeDelayedContent - Inhalte mit Zeitsteuerung
	 * @param stageNumber - Optional: Nummer der zugeordneten Stage
	 */
	async addTemporaryContent(
		courseProgressId: string,
		timeStamp: number,
		timeDelayedContent: IStageContentInfo[],
		stageNumber?: number
	) {
		const currentTempContent = await this.getTemporaryContent();
		const preparedTempContent = timeDelayedContent.map((item) => {
			const contentId = v4();
			return {
				courseProgressId,
				deleteTime: timeStamp + item.endTimeInSeconds * 1000,
				startShowingTime: timeStamp + item.startTimeInSeconds * 1000,
				stageInfo: {
					id: contentId,
					timeStamp: timeStamp + item.startTimeInSeconds * 1000,
					stageNumber,
					isRemoved: false,
					...item,
					autoplay: item.autoplay ?? false,
				},
				isGlobal: stageNumber || stageNumber === 0 ? false : true,
			} as ITemporaryContent;
		});
		if (currentTempContent[courseProgressId]?.length) {
			currentTempContent[courseProgressId] = [
				...currentTempContent[courseProgressId],
				...preparedTempContent,
			];
		} else {
			currentTempContent[courseProgressId] = preparedTempContent;
		}
		return this.setTemporaryContent(currentTempContent);
	}

	//cut
	/**
	 * Weitere Methoden für den ScenarioProgressCachingService
	 *
	 * Diese Methoden erweitern die Verwaltung von Szenario-Fortschritten und temporären Inhalten
	 * um Funktionen zur Initialisierung, Bereinigung, Rechteverwaltung und Nutzerentfernung.
	 */

	/**
	 * Entfernt bestimmte temporäre Inhalte aus dem Cache anhand von IDs.
	 *
	 * @param removedData - Array mit Kursfortschritts-ID und zu entfernenden Content-IDs
	 */
	async removeTemporaryContentArray(
		removedData: { courseProgressId: string; contentIds: string[] }[]
	) {
		const currentTempContent = await this.getTemporaryContent();
		for (const { courseProgressId, contentIds } of removedData) {
			currentTempContent[courseProgressId] = currentTempContent[courseProgressId].filter(
				(item) => !contentIds.includes(item.stageInfo?.id)
			);
		}
		return this.setTemporaryContent(currentTempContent);
	}

	/**
	 * Entfernt alle oder nur nicht-globale Inhalte eines Kursfortschritts aus dem Cache.
	 *
	 * @param courseProgressId - Kursfortschritts-ID
	 * @param isRemoveAll - Wenn true, wird alles gelöscht. Sonst nur nicht-globale Inhalte
	 */
	async clearTemporaryContentForCourseProgress(courseProgressId: string, isRemoveAll = true) {
		const currentTempContent = await this.getTemporaryContent();
		if (isRemoveAll) {
			delete currentTempContent[courseProgressId];
		} else {
			currentTempContent[courseProgressId] = currentTempContent[courseProgressId]?.filter(
				(content) => content?.isGlobal
			);

			if (currentTempContent[courseProgressId]?.length === 0) {
				delete currentTempContent[courseProgressId];
			}
		}
		return this.setTemporaryContent(currentTempContent);
	}

	/**
	 * Initialisiert den Szenariofortschritt beim Start eines Kurses.
	 *
	 * @param courseProgressId - ID des Kursfortschritts
	 * @param errInfo - Benutzerinfo für Error-Fallback oder Host
	 * @param courseScenario - Gesamtes Szenario-JSON
	 * @param isOnlyOneStage - Gibt an, ob das Szenario nur eine Stage hat
	 */
	async onCourseInitialize(
		courseProgressId: string,
		errInfo: Partial<User>,
		courseScenario: IScenarioJson,
		isOnlyOneStage: boolean
	) {
		const currentCourseProgress = await this.getScenarioProgress(courseProgressId);
		const timeStamp = Date.now();
		const stageInfo = courseScenario?.Content?.[0];

		if (stageInfo) {
			if (stageInfo?.confirmationRequired && stageInfo?.decisionOptions?.length) {
				const initialProtocolDecision = {
					id: v4(),
					data: {
						name: stageInfo?.decisionName ?? "",
						confirmationRequired: stageInfo.confirmationRequired as any,
						decisionOptions: stageInfo.decisionOptions!.map((optionData) => ({
							option: optionData.option,
							phaseId: optionData.phaseId,
							userVotedIds: [],
						})),
					},
					type: ScenarioMessageTypes.DECISION,
					timestamp: timeStamp,
				};
				currentCourseProgress.protocolHistory.push(initialProtocolDecision);
			}

			if (stageInfo?.content && stageInfo?.contentType) {
				const stageContent: IStageContentInfo = {
					id: v4(),
					content: stageInfo.content,
					contentType: stageInfo.contentType,
					timeStamp,
					stageNumber: stageInfo.id,
					title: stageInfo.phaseName,
					isRemoved: false,
					autoplay: stageInfo.autoplay ?? false,
				};
				currentCourseProgress.stageContent.push(stageContent);
			}

			if (stageInfo?.timeDelayedContent?.length) {
				await this.addTemporaryContent(
					courseProgressId,
					timeStamp,
					stageInfo.timeDelayedContent,
					stageInfo.id
				);
			}

			currentCourseProgress.json = courseScenario;

			if (stageInfo?.timeLimit) {
				const currentStageEndTimestamp = timeStamp + stageInfo.timeLimit * 1000;
				currentCourseProgress.currentStageEndTimestamp = currentStageEndTimestamp;
				await this.saveActiveTimerStage(courseProgressId, currentStageEndTimestamp);
			}
		}

		if (courseScenario?.timeDelayedContent?.length) {
			await this.addTemporaryContent(
				courseProgressId,
				timeStamp,
				courseScenario.timeDelayedContent
			);
		}

		if (isOnlyOneStage) {
			currentCourseProgress.protocolHistory.push({
				id: v4(),
				data: {},
				type: ScenarioMessageTypes.END,
				timestamp: timeStamp,
			});
		}

		if (errInfo?.id && errInfo?.firstName && errInfo?.lastName && errInfo?.email) {
			const errData = {
				id: v4(),
				firstName: errInfo.firstName,
				lastName: errInfo.lastName,
				email: errInfo.email,
				isActive: false,
				isAccepted: true,
				firstJoinTimeStamp: timeStamp,
			} as IScenarioUser;
			currentCourseProgress.users.push(errData);
			currentCourseProgress.errInfo = errData;
		}

		return this.setScenario(courseProgressId, currentCourseProgress);
	}

	/**
	 * Aktualisiert die Berechtigungen eines Nutzers im Szenarioverlauf.
	 *
	 * @param courseProgressId - Kursfortschritts-ID
	 * @param targetUserId - Benutzer-ID
	 * @param permissions - Neue Berechtigungen (enum)
	 */
	async updateUserPermissions(
		courseProgressId: string,
		targetUserId: string,
		permissions: PermissionCodes[]
	) {
		const currentCourseProgress = await this.getScenarioProgress(courseProgressId);
		const targetUserIndex = currentCourseProgress.users.findIndex(
			(item) => item.id === targetUserId
		);

		if (targetUserIndex >= 0) {
			currentCourseProgress.users[targetUserIndex].permissions = permissions;
			await this.setScenario(courseProgressId, currentCourseProgress);
			return currentCourseProgress.users[targetUserIndex];
		} else {
			this.unlockScenario(courseProgressId);
			return null;
		}
	}

	/**
	 * Entfernt einen Nutzer aus einem Szenario und protokolliert die Aktion.
	 *
	 * @param courseProgressId - Kursfortschritts-ID
	 * @param user - Benutzer, der entfernt werden soll
	 * @param requester - Benutzer, der den Kick ausgeführt hat
	 */
	async removeUserFromScenario(courseProgressId: string, user: IScenarioUser, requester: User) {
		const currentCourseProgress = await this.getScenarioProgress(courseProgressId);

		currentCourseProgress.users = currentCourseProgress.users.map((item) => {
			if (item?.id === user?.id) {
				item.isRemoved = true;
			}
			return item;
		});

		currentCourseProgress.protocolHistory.push({
			id: v4(),
			data: {
				userId: requester.id,
				firstName: requester.firstName,
				lastName: requester.lastName,
				email: requester.email,
				message: `removed-user`,
				options: {
					userData: user.isAccepted ? `${user.firstName} ${user.lastName}` : user.email,
				},
			},
			type: ScenarioMessageTypes.MESSAGE,
			timestamp: Date.now(),
		} as ScenarioMessageInfo);

		await this.setScenario(courseProgressId, currentCourseProgress);
		return currentCourseProgress;
	}
}
