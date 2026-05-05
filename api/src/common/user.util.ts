import { PermissionCodes } from "src/permissions/enum/codes";
import User from "src/users/models/user.model";
import {
	getRandomChars,
	getRandomDigits,
	getRandomSpecials,
	randomizeArray,
} from "./random.utils";

/**
 * Funktion: getUserToken
 *
 * Generiert ein zufälliges Token, z.B. für Einladungen oder Passwortrücksetzungen.
 * Besteht aus drei Teilen mit zufälligen alphanumerischen Zeichen.
 *
 * @returns Ein zufälliger String
 */
export const getUserToken = (): string => {
	return (
		Math.random().toString(36).substring(2, 15) +
		Math.random().toString(36).substring(2, 15) +
		Math.random().toString(36).substring(2, 4)
	);
};

/**
 * Funktion: getInviteTokenCompareDate
 *
 * Liefert ein Datum, das 7 Tage in der Vergangenheit liegt.
 * Wird genutzt, um zu prüfen, ob ein Token abgelaufen ist.
 *
 * @returns Vergleichsdatum (z. B. für Ablaufprüfung)
 */
export const getInviteTokenCompareDate = (): Date => {
	const compareDate: Date = new Date();
	const validTokenDaysInterval = 7;
	compareDate.setDate(compareDate.getDate() - validTokenDaysInterval);
	return compareDate;
};

/**
 * Funktion: getRandomPassword
 *
 * Generiert ein sicheres, zufälliges Passwort bestehend aus:
 * - 2 Ziffern
 * - 5 Kleinbuchstaben
 * - 1 Großbuchstabe
 * - 1 Sonderzeichen
 *
 * @returns Ein sicheres Passwort als String
 */
export const getRandomPassword = (): string => {
	return randomizeArray(
		Array.prototype.concat(
			getRandomDigits(2),
			getRandomChars(5),
			getRandomChars(1).map((c) => c.toUpperCase()),
			getRandomSpecials(1)
		)
	).join("");
};

/**
 * Regulärer Ausdruck zur Validierung sicherer Passwörter:
 * - Mind. 1 Kleinbuchstabe
 * - Mind. 1 Großbuchstabe
 * - Mind. 1 Zahl
 * - Mind. 1 Sonderzeichen
 * - Min. Länge: 8 Zeichen
 */
export const passwordRegExp = new RegExp(
	/(?=[\p{L}\p{N}~`!@#$%^&*()_\-+={[}\]|\\:;"'<,>.?/]+$)^(?=.*[\p{Ll}])(?=.*[\p{Lu}])(?=.*[\p{N}])(?=.*[~`!@#$%^&*()_\-+={[}\]|\\:;"'<,>.?/])(?=.{8,}).*$/u
);

/**
 * Mindestlänge eines gültigen Passworts.
 */
export const passwordLength = 8;

/**
 * Funktion: hasPermission
 *
 * Prüft, ob ein Benutzer eine bestimmte Berechtigung besitzt.
 *
 * @param user - Benutzerobjekt
 * @param permission - Zu prüfender Berechtigungscode
 * @returns true, wenn Benutzer Berechtigung besitzt, sonst false
 */
export const hasPermission = (user: User, permission: PermissionCodes): boolean => {
	if (!user || !user.role) {
		return false;
	}
	const permissions = user.role.permissions.map((p) => p.code);
	return permissions.includes(permission);
};
