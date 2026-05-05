/**
 * Funktion: getUnique
 *
 * Diese Funktion kombiniert zwei Arrays (`arr1` und `arr2`) und entfernt dabei doppelte Werte.
 * Das Ergebnis ist ein neues Array mit ausschließlich eindeutigen (unique) Elementen.
 *
 * @param arr1 - Erstes Array (beliebige Werte, z. B. Zahlen oder Strings)
 * @param arr2 - Zweites Array
 * @returns Ein Array, das alle eindeutigen Werte aus beiden Arrays enthält
 *
 * Beispiel:
 * getUnique([1, 2], [2, 3]) // → [1, 2, 3]
 */
export function getUnique(arr1, arr2) {
	return [...new Set([...arr1, ...arr2])];
}
