/**
 * Enum zur Beschreibung zusätzlicher Statusinformationen.
 * 
 * Diese Tags bieten genauere Informationen über das Ergebnis oder 
 * den Abschlussstatus eines Szenarios, Moduls oder einer Aufgabe.
 */
export enum AdditionalStatusInfoTags {
    /** Das verfügbare Zeitlimit wurde erreicht */
    TIMEUP = "time-up",

    /** Die Aufgabe oder das Szenario wurde erfolgreich abgeschlossen */
    SUCCESS = "success",

    /** Die Aufgabe oder das Szenario wurde nicht erfolgreich abgeschlossen */
    FAILURE = "failure",

    /** Das Szenario wurde automatisch abgeschlossen (z. B. durch das System oder einen Timer) */
    AUTO_COMPLETED = "auto-completed",
}
