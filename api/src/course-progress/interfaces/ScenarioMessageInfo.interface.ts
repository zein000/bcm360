import { ScenarioMessageTypes } from "../enum/ScenarioMessageTypes.enum";

/**
 * Struktur: ScenarioMessageInfo
 *
 * Repräsentiert eine einzelne Nachricht im Rahmen eines Szenarios.
 * Diese Nachrichten sind typisiert und enthalten Zusatzdaten (Payload), die je nach Typ variieren können.
 *
 * Einsatzbereiche:
 * - Kommunikation zwischen System und Nutzer
 * - Auslösung von Entscheidungen oder Szenariosteuerung
 * - Visualisierung des Nachrichtenverlaufs (Protokollierung)
 */
export interface ScenarioMessageInfo {
	/** Eindeutige ID der Nachricht (vermutlich UUID) */
	id: string;

	/** Typ der Nachricht, z. B. 'message', 'decision', 'system' – definiert über ein Enum */
	type: ScenarioMessageTypes;

	/** Zeitpunkt, zu dem die Nachricht erzeugt wurde (Unix-Zeitstempel in Millisekunden) */
	timestamp: number;

	/**
	 * Nutzlast bzw. Inhalt der Nachricht.
	 * Der konkrete Inhalt hängt vom Nachrichtentyp ab (kann z. B. ein Text, eine Entscheidung oder Systeminfo sein).
	 * Der Typ ist hier absichtlich offen gehalten (`any`), da die Struktur je nach Verwendungszweck variiert.
	 */
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	data: any;
}
