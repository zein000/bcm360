import User from "../models/user.model";

/**
 * Interface: ICreateConnection
 *
 * Repräsentiert die Datenstruktur, die beim Erstellen einer neuen Verbindung (z. B. zwischen Benutzern)
 * übermittelt oder gespeichert wird.
 * Diese Verbindung kann beispielsweise aus einem Netzwerk wie LinkedIn stammen.
 *
 * @property firstName - Vorname der verbundenen Person
 * @property lastName - Nachname der verbundenen Person
 * @property linkedinUrl - Link zum LinkedIn-Profil der Person
 * @property email - E-Mail-Adresse der Person
 * @property companyName - Firmenname, bei dem die Person tätig ist
 * @property title - Berufsbezeichnung der Person
 * @property connectedAt - Zeitpunkt der Verbindung (als ISO-String)
 * @property user - Die zugehörige Benutzerinstanz aus dem System (Verknüpfung zu `User`-Modell)
 */
export interface ICreateConnection {
	firstName: string;
	lastName: string;
	linkedinUrl: string;
	email: string;
	companyName: string;
	title: string;
	connectedAt: string;
	user: User;
}
