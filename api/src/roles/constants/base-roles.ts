import { PermissionCodes } from "src/permissions/enum/codes";

/**
 * Konstante: participantPermissionCodes
 *
 * Liste von Berechtigungen, die standardmäßig der Rolle "Participant" zugewiesen werden.
 * Diese Berechtigungen erlauben grundlegende Interaktionen wie Logout oder das Abrufen eigener Daten.
 */
export const participantPermissionCodes = [
	PermissionCodes.GET_ME,
	PermissionCodes.COURSES,
	PermissionCodes.UPDATE_ME,
	PermissionCodes.DISABLE_2FA,
	PermissionCodes.GENERATE_2FA,
	PermissionCodes.UPLOAD_FILES,
	PermissionCodes.LOGOUT,
	PermissionCodes.PARTICIPANT,
];

/**
 * Konstante: userPermissionCodes
 *
 * Liste von Berechtigungen, die standardmäßig der Rolle "User" zugewiesen werden.
 * Diese decken zusätzliche Funktionen wie 2FA, Kurszugriff, Rollenwechsel oder Protokollarbeit ab.
 */
export const userPermissionCodes = [
	PermissionCodes.CHANGE_PASSWORD,
	PermissionCodes.GET_ME,
	PermissionCodes.LOGOUT,
	PermissionCodes.DISABLE_2FA,
	PermissionCodes.VERIFY_2FA,
	PermissionCodes.COURSES,
	PermissionCodes.USER,
	PermissionCodes.PARTICIPANT,
	PermissionCodes.PROTOCOL_WRITER,
];
