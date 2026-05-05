import {
	IScenarioJson,
	IStageContentInfo,
} from "src/course-progress/interfaces/ScenarioJson.interface";
import { ScenarioMessageInfo } from "src/course-progress/interfaces/ScenarioMessageInfo.interface";
import { IScenarioUser } from "src/course-progress/interfaces/ScenarioUser.interface";

/**
 * Interface: ScenarioProgress
 *
 * Dieses Interface beschreibt den vollständigen Zustand eines Szenarios während eines Kursdurchlaufs.
 * Es wird im Cache (z.B. Redis oder In-Memory) gespeichert und laufend aktualisiert,
 * um den Echtzeit-Fortschritt und Benutzerinteraktionen nachverfolgen zu können.
 *
 * Verwendungszweck:
 * - Speichern und Wiederherstellen des Szenariozustands im `ScenarioProgressCachingService`
 * - Grundlage für temporäre Anzeigeinhalte, Protokollhistorie und Szenario-Logik
 *
 * Felder:
 * - protocolHistory: Verlauf aller Protokollnachrichten (z.B. Entscheidungen, Spoileraktionen)
 * - chatHistory: Verlauf aller Chatnachrichten zwischen Teilnehmenden
 * - currentStage: Index der aktuellen Stage im Szenario-Array
 * - currentStageStartTimestamp: Zeitstempel, wann die aktuelle Stage begonnen hat
 * - currentStageEndTimestamp: Optionaler Zeitstempel für automatische Beendigung (z.B. Timer)
 * - json: Das komplette Szenario als strukturierte JSON-Datei
 * - stageContent: Inhalte, die während des Szenarios angezeigt wurden (Text, Medien etc.)
 * - users: Liste aller Nutzer, die am Szenario beteiligt sind
 * - errInfo: Sonderrolle (z.B. Moderator oder Host), oft zur Fehlerverfolgung oder Darstellung
 * - lastUpdateTimeStamp: Zeitpunkt der letzten Änderung am Szenariostatus
 */
export interface ScenarioProgress {
	protocolHistory: ScenarioMessageInfo[];
	chatHistory: ScenarioMessageInfo[];
	currentStage: number;
	currentStageStartTimestamp: number;
	currentStageEndTimestamp: number;
	json: IScenarioJson;
	stageContent: IStageContentInfo[];
	users: IScenarioUser[];
	errInfo: IScenarioUser;
	lastUpdateTimeStamp: number;
}
