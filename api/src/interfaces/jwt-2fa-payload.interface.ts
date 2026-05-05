import { RoleInfoDTO } from "src/roles/dto/role-info.dto";

/**
 * Interface: JWT2FAPayload
 *
 * Dieses Interface definiert die Struktur der JWT-Payload, die bei aktivierter Zwei-Faktor-Authentifizierung (2FA)
 * verwendet wird – typischerweise nach dem ersten Login-Schritt.
 *
 * Verwendungszweck:
 * - Wird beim Erstellen und Verifizieren von JWTs verwendet, die 2FA-geschützte Bereiche absichern
 * - Enthält die Benutzer-ID, Rolleninformationen und ob 2FA aktiviert ist
 *
 * Felder:
 * - id: Eindeutige ID des Benutzers
 * - roles: Liste der Rollen, die dem Benutzer zugewiesen sind (inkl. Berechtigungen etc.)
 * - is2FAEnabled: Gibt an, ob die Zwei-Faktor-Authentifizierung für den Benutzer aktiviert ist
 */
export interface JWT2FAPayload {
	id: number;
	roles: RoleInfoDTO[];
	is2FAEnabled: boolean;
}
