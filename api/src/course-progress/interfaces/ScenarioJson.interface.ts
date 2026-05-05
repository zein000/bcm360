import { FileTypes } from "src/file/enum/FileTypes.enum";
import { CourseProgressEnum } from "../enum/Status";

/**
 * Hauptstruktur eines Szenarios im JSON-Format.
 *
 * Diese Struktur wird verwendet, um den Ablauf, die Inhalte und die Entscheidungslogik
 * eines Szenarios zu definieren (z. B. für Simulationen, Rollenspiele oder Lerneinheiten).
 */
export interface IScenarioJson {
	/** Autor des Szenarios (Name, User, Ersteller etc.) */
	author: string;

	/** Liste der Phasen (Stages), aus denen das Szenario besteht */
	Content: IStageInfo[];

	/** Szenarioname – wird meist in der UI angezeigt */
	scenarioName: string;

	/** Optional: Inhalte, die zeitverzögert angezeigt werden (z. B. automatisch nach X Sekunden) */
	timeDelayedContent?: IStageContentInfo[];
}

/**
 * Beschreibt eine einzelne Phase oder Abschnitt im Szenario.
 */
export interface IStageInfo {
	id: number;

	/** Hauptinhalt der Phase – z. B. Beschreibung, Frage, Instruktion */
	content: string;

	/** Name der Phase (z. B. "Evakuierung", "Lageeinschätzung") */
	phaseName: string;

	/** Optional: Zeitlimit in Sekunden, das für diese Phase gilt */
	timeLimit?: number;

	/** Dateityp oder Inhaltsformat (Text, Video, Audio, Bild etc.) */
	contentType: FileTypes;

	/** Optional: Titel der Entscheidungsfrage, die in dieser Phase gestellt wird */
	decisionName?: string;

	/** Optional: Antwortoptionen für die Entscheidung (z. B. "abwarten", "evakuieren") */
	decisionOptions?: IDecisionOptions[];

	/** Optional: ID der Entscheidung, die automatisch getroffen wird, wenn Zeit abläuft */
	timeLeftDecisionId?: number;

	/** Optional: Zusatzinhalt, der zuerst versteckt ist und aufgedeckt werden kann */
	spoilerContent?: ISpoilerContent;

	/** Optional: Text, der am Ende der Phase angezeigt wird (z. B. Feedback, Zusammenfassung) */
	phaseEndText?: string;

	/** Optional: Inhalte, die in der Phase zeitverzögert abgespielt oder eingeblendet werden */
	timeDelayedContent?: IStageContentInfo[];

	/** Gibt an, wie Entscheidungen bestätigt werden müssen (z. B. nur von Gruppenleiter oder allen) */
	confirmationRequired: DecisionConfirmationTypes;

	/** Optional: Ergebnisstatus, der nach Abschluss dieser Phase gesetzt wird */
	phaseEndResult?: CourseProgressEnum;

	/** Optional: Gibt an, ob Inhalte automatisch abgespielt werden sollen */
	autoplay?: boolean;
}

/**
 * Optionaler Zusatzinhalt, der zunächst versteckt ist (z. B. Spoiler, Hinweise).
 */
export type ISpoilerContent = {
	content: string;
	title: string;
};

/**
 * Zusätzlicher oder verzögerter Inhalt innerhalb einer Phase.
 * Wird z. B. automatisch nach einer bestimmten Zeit eingeblendet.
 */
export interface IStageContentInfo {
	id?: string;

	/** Der eigentliche Inhalt (Text, Bild, Video etc.) */
	content: string;

	/** Optional: Titel des Inhalts */
	title?: string;

	/** Zeitpunkt (in Sekunden), wann der Inhalt starten soll */
	startTimeInSeconds?: number;

	/** Typ des Inhalts (Text, Audio, Video ...) */
	contentType: FileTypes;

	/** Zeitpunkt, wann der Inhalt enden soll */
	endTimeInSeconds?: number;

	/** Zeitstempel (in ms) der Erstellung/Einbindung */
	timeStamp?: number;

	/** Zu welcher Phase dieser Inhalt gehört (Index oder Nummer) */
	stageNumber?: number;

	/** Optional: Automatische Wiedergabe aktivieren */
	autoplay?: boolean;

	/** Optional: Kennzeichnung, ob Inhalt entfernt wurde */
	isRemoved?: boolean;
}

/**
 * Struktur für eine Entscheidungsoption, z. B. für Multiple-Choice-Fragen.
 */
export interface IDecisionOptions {
	/** Der Antworttext (z. B. "Evakuieren") */
	option: string;

	/** Die ID der Phase, zu der diese Entscheidung führt */
	phaseId: number;
}

/**
 * Definiert, wie Entscheidungen im Szenario bestätigt werden müssen.
 */
export enum DecisionConfirmationTypes {
	/** Nur vom Gruppenleiter */
	FROM_LEADER = "FROM_LEADER",

	/** Von allen Teilnehmern */
	FROM_ALL = "FROM_ALL",

	/** Keine Bestätigung nötig */
	NONE = "NONE",
}

/**
 * Leere Szenariovorlage (Default-Objekt), z. B. zum Initialisieren eines neuen Szenarios.
 */
export const EMPTY_COURSE_SCENARIO: IScenarioJson = {
	scenarioName: "",
	author: "",
	Content: [
		{
			id: null,
			phaseName: "",
			timeLimit: null,
			confirmationRequired: DecisionConfirmationTypes.NONE,
			phaseEndResult: CourseProgressEnum?.Success,
			phaseEndText: "",
			decisionName: "",
			content: "",
			timeLeftDecisionId: -1,
			contentType: FileTypes.Text,
			decisionOptions: [],
		},
	],
	timeDelayedContent: [],
};
