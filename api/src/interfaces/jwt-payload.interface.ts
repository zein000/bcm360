import { RoleInfoDTO } from "src/roles/dto/role-info.dto";

/**
 * Interface: JWTPayload
 *
 * Dieses Interface beschreibt die Standardstruktur eines JWT-Tokens,
 * das für die Authentifizierung nach erfolgreichem Login verwendet wird.
 *
 * Verwendungszweck:
 * - Wird zum Signieren und Verifizieren von Zugriffstokens (z. B. Auth-Token für geschützte Endpunkte) genutzt
 * - Beinhaltet essentielle Informationen über den Benutzer und dessen Berechtigungen
 *
 * Felder:
 * - id: Eindeutige ID des Benutzers
 * - roles: Liste von Rollenobjekten, die die Berechtigungen und Zugehörigkeiten des Benutzers beschreiben
 */
export interface JWTPayload {
	id: number;
	roles: RoleInfoDTO[];
}
