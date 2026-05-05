// Import der möglichen Berechtigungscodes für Benutzer aus einer Enum-Definition.
import { PermissionCodes } from "src/permissions/enum/codes";

/**
 * Interface zur Beschreibung eines Benutzers innerhalb eines Szenarios.
 * 
 * Dieses Interface wird verwendet, um die Eigenschaften eines Benutzers zu speichern, 
 * der an einem bestimmten Szenario teilnimmt (z. B. ein Training oder eine simulierte Umgebung).
 */
export interface IScenarioUser {
    /** Eindeutige ID des Benutzers (vermutlich UUID) */
    id: string,

    /** Optional: Vorname des Benutzers */
    firstName?: string,

    /** Optional: Nachname des Benutzers */
    lastName?: string,

    /** E-Mail-Adresse des Benutzers (wird wahrscheinlich zur Identifikation oder Einladung verwendet) */
    email: string,

    /** Optional: Gibt an, ob der Benutzer momentan aktiv ist (z. B. in der Session eingeloggt) */
    isActive?: boolean;

    /** Optional: Ob der Benutzer die Einladung zum Szenario angenommen hat */
    isAccepted?: boolean;

    /** Optional: Liste von Berechtigungen (aus Enum `PermissionCodes`), die diesem Benutzer zugewiesen wurden */
    permissions?: PermissionCodes[];

    /** Optional: Token für die Authentifizierung oder Teilnahme am Szenario */
    token?: string;

    /** Optional: ID zur Verknüpfung des Benutzers mit einem Kursfortschritt (z. B. Lernfortschritt) */
    courseProgressId?: string;

    /** Optional: Zeitstempel (Unix-Zeit in Millisekunden), wann der Benutzer dem Szenario erstmals beigetreten ist */
    firstJoinTimeStamp?: number;

    /** Optional: Zeitstempel, wann der Benutzer das Szenario verlassen hat. Null, wenn noch aktiv. */
    exitTimeStamp?: number | null;

    /** Optional: Zeitstempel, wann der Benutzer eingeladen wurde */
    invitedTimeStamp?: number;

    /** Optional: Gibt an, ob der Benutzer aus dem Szenario entfernt wurde */
    isRemoved?: boolean;
}
