import { IStageContentInfo } from "src/course-progress/interfaces/ScenarioJson.interface";

/**
 * Interface: ITemporaryContent
 *
 * Dieses Interface beschreibt die Struktur für zeitlich gesteuerte Inhalte im Szenario-Fortschritt.
 * Diese Inhalte werden zu einem definierten Zeitpunkt sichtbar und zu einem anderen Zeitpunkt automatisch entfernt.
 *
 * Verwendungszweck:
 * - Steuerung von Inhalten (z. B. Hinweise, Videos, Texte), die zeitverzögert angezeigt werden sollen
 * - Zwischengespeichert im Cache durch den `ScenarioProgressCachingService`
 *
 * Felder:
 * - courseProgressId: ID des Szenario-Fortschritts (Kurskontext)
 * - startShowingTime: Zeitpunkt (ms seit Epoch), ab wann der Inhalt angezeigt werden soll
 * - deleteTime: Zeitpunkt, wann der Inhalt wieder gelöscht/ausgeblendet werden soll
 * - stageInfo: Die eigentlichen Inhaltsinformationen (inkl. Metadaten)
 * - isGlobal: Gibt an, ob der Inhalt global (szenarioübergreifend) oder nur stagenspezifisch ist
 */
export interface ITemporaryContent {
	courseProgressId: string;
	startShowingTime: number;
	deleteTime: number;
	stageInfo: IStageContentInfo;
	isGlobal: boolean;
}
